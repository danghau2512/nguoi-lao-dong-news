
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import {
  handleArticleAiRequest,
  handleSearchKeywordRequest
} from './server/articleAi.ts'
import { handleViettelTtsRequest } from './server/viettelTts.ts'
import { handleViettelSttRequest } from './server/viettelStt.ts'

const laodongRssProxy: Plugin = {
  name: 'laodong-rss-proxy',

  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/laodong/rss/')) {
        next()
        return
      }

      try {
        const sourceUrl =
          'https://laodong.vn' +
          req.url.replace(/^\/api\/laodong/, '')

        const headers: Record<string, string> = {
          Accept: 'application/rss+xml, application/xml, text/xml'
        }

        let response = await fetch(sourceUrl, {
          headers,
          signal: AbortSignal.timeout(15000)
        })

        let xml = await response.text()

        if (!/<rss(?:\s|>)/i.test(xml)) {
          const cookie = xml.match(
            /document\.cookie\s*=\s*["'](D1N=[a-f0-9]+)["']/i
          )?.[1]

          if (!cookie) {
            throw new Error(
              'Nguồn không trả về RSS hoặc mẫu cookie D1N đã thay đổi'
            )
          }

          headers.Cookie = cookie

          response = await fetch(sourceUrl, {
            headers,
            signal: AbortSignal.timeout(15000)
          })

          xml = await response.text()
        }

        if (!response.ok) {
          throw new Error(
            `Nguồn trả về HTTP ${response.status}`
          )
        }

        if (!/<rss(?:\s|>)/i.test(xml)) {
          throw new Error(
            'Nguồn vẫn chưa trả về RSS sau khi gửi cookie'
          )
        }

        res.statusCode = 200

        res.setHeader(
          'Content-Type',
          'application/xml; charset=utf-8'
        )

        res.end(xml)
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : 'Không lấy được RSS'

        console.error('Lỗi RSS Lao Động:', message)

        res.statusCode = 502

        res.setHeader(
          'Content-Type',
          'text/plain; charset=utf-8'
        )

        res.end(message)
      }
    })
  }
}

const laodongArticleProxy: Plugin = {
  name: 'laodong-article-proxy',

  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestUrl = new URL(
        req.url ?? '/',
        'http://localhost'
      )

      if (requestUrl.pathname !== '/api/laodong/article') {
        next()
        return
      }

      const sendError = (status: number, message: string) => {
        res.statusCode = status

        res.setHeader(
          'Content-Type',
          'application/json; charset=utf-8'
        )

        res.end(JSON.stringify({ message }))
      }

      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        sendError(405, 'Endpoint chỉ hỗ trợ GET')
        return
      }

      let sourceUrl: URL

      try {
        sourceUrl = new URL(
          requestUrl.searchParams.get('url') ?? ''
        )
      } catch {
        sendError(
          400,
          'Thiếu URL bài viết hoặc URL không hợp lệ'
        )
        return
      }

      if (
        sourceUrl.origin !== 'https://laodong.vn' ||
        sourceUrl.username ||
        sourceUrl.password ||
        !sourceUrl.pathname.endsWith('.ldo')
      ) {
        sendError(
          400,
          'Chỉ hỗ trợ URL bài viết HTTPS thuộc laodong.vn'
        )
        return
      }

      sourceUrl.hash = ''

      try {
        const headers: Record<string, string> = {
          Accept: 'text/html'
        }

        let response = await fetch(sourceUrl, {
          headers,
          redirect: 'error',
          signal: AbortSignal.timeout(15000)
        })

        let html = await response.text()

        const cookie = html.match(
          /document\.cookie\s*=\s*["'](D1N=[a-f0-9]+)["']/i
        )?.[1]

        if (cookie) {
          headers.Cookie = cookie

          response = await fetch(sourceUrl, {
            headers,
            redirect: 'error',
            signal: AbortSignal.timeout(15000)
          })

          html = await response.text()
        }

        if (!response.ok) {
          throw new Error(
            `Nguồn trả về HTTP ${response.status}`
          )
        }

        if (/document\.cookie\s*=\s*["']D1N=/i.test(html)) {
          throw new Error(
            'Nguồn vẫn yêu cầu xác minh cookie'
          )
        }

        if (
          !response.headers.get('content-type')
            ?.includes('text/html')
        ) {
          throw new Error('Nguồn không trả về HTML')
        }

        if (!html.trim()) {
          throw new Error('Nội dung HTML rỗng')
        }

        res.statusCode = 200

        res.setHeader(
          'Content-Type',
          'text/html; charset=utf-8'
        )

        res.setHeader(
          'Content-Security-Policy',
          "sandbox; default-src 'none'"
        )

        res.end(html)
      } catch (error) {
        console.error('Lỗi lấy bài Lao Động:', error)

        if (
          error instanceof Error &&
          error.name === 'TimeoutError'
        ) {
          sendError(
            504,
            'Hết thời gian chờ lấy bài viết'
          )
          return
        }

        const message = error instanceof Error
          ? error.message
          : 'Không lấy được bài viết'

        sendError(502, message)
      }
    })
  }
}

const geminiArticleProxy: Plugin = {
  name: 'gemini-article-proxy',

  configureServer(server) {
    const environment = loadEnv(
      server.config.mode,
      server.config.root,
      ''
    )

    server.middlewares.use(async (req, res, next) => {
      const requestUrl = new URL(
        req.url ?? '/',
        'http://localhost'
      )

      if (requestUrl.pathname === '/api/ai/search-keyword') {
        await handleSearchKeywordRequest(
          req,
          res,
          environment.GEMINI_API_KEY,
          environment.GEMINI_MODEL
        )

        return
      }

      if (requestUrl.pathname !== '/api/ai/article') {
        next()
        return
      }

      await handleArticleAiRequest(
        req,
        res,
        environment.GEMINI_API_KEY,
        environment.GEMINI_MODEL
      )
    })
  }
}

const viettelTtsProxy: Plugin = {
  name: 'viettel-tts-proxy',

  configureServer(server) {
    const env = loadEnv(
      server.config.mode,
      server.config.root,
      ''
    )

    server.middlewares.use((req, res, next) => {
      const requestUrl = new URL(
        req.url ?? '/',
        'http://localhost'
      )

      if (requestUrl.pathname !== '/api/tts') {
        next()
        return
      }

      void handleViettelTtsRequest(
        req,
        res,
        env.VIETTEL_AI_TOKEN
      )
    })
  }
}

const viettelSttProxy: Plugin = {
  name: 'viettel-stt-proxy',

  configureServer(server) {
    const env = loadEnv(
      server.config.mode,
      server.config.root,
      ''
    )

    server.middlewares.use((req, res, next) => {
      const requestUrl = new URL(
        req.url ?? '/',
        'http://localhost'
      )

      if (requestUrl.pathname !== '/api/stt') {
        next()
        return
      }

      const token =
        env.VIETTEL_STT_TOKEN ||
        env.VIETTEL_AI_TOKEN

      void handleViettelSttRequest(
        req,
        res,
        token
      )
    })
  }
}

const fakeAuthApi: Plugin = {
  name: 'fake-auth-api',

  configureServer(server) {
    server.middlewares.use('/api/auth/login', async (req, res) => {
      function sendJson(status: number, data: object) {
        res.statusCode = status
        res.setHeader(
          'Content-Type',
          'application/json; charset=utf-8'
        )
        res.end(JSON.stringify(data))
      }

      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        sendJson(405, {
          message: 'API chỉ hỗ trợ POST.'
        })
        return
      }

      let body = ''

      try {
        for await (const chunk of req) {
          body += String(chunk)

          if (body.length > 4096) {
            sendJson(413, {
              message: 'Dữ liệu gửi lên quá lớn.'
            })
            return
          }
        }

        const credentials = JSON.parse(body)

        if (
          typeof credentials?.email !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          sendJson(400, {
            message: 'Vui lòng nhập email và mật khẩu.'
          })
          return
        }

        const email = credentials.email.trim().toLowerCase()

        if (
          email !== '3aetest@example.com' ||
          credentials.password !== 'Test1234'
        ) {
          sendJson(401, {
            message: 'Email hoặc mật khẩu không đúng.'
          })
          return
        }

        sendJson(200, {
          id: 1,
          name: '3ae test',
          email,
        })
      } catch {
        sendJson(400, {
          message: 'Dữ liệu đăng nhập không hợp lệ.'
        })
      }
    })
  }
}

export default defineConfig({
  plugins: [
    react(),
    laodongRssProxy,
    laodongArticleProxy,
    geminiArticleProxy,
    viettelTtsProxy,
    viettelSttProxy,
    fakeAuthApi
  ],

  server: {
    proxy: {
      '/api/laodong': {
        target: 'https://laodong.vn',
        changeOrigin: true,
        followRedirects: true,

        rewrite: (path) => {
          return path.replace(/^\/api\/laodong/, '')
        }
      }
    }
  }
})
