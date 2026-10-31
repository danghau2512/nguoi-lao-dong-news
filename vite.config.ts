import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const laodongRssProxy: Plugin = {
  name: 'laodong-rss-proxy',

  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/laodong/rss/')) {
        next()
        return
      }

      try {
        const sourceUrl = 'https://laodong.vn' + req.url.replace(/^\/api\/laodong/, '')
        const headers: Record<string, string> = {
          Accept: 'application/rss+xml, application/xml, text/xml',
        }

        let response = await fetch(sourceUrl, {
          headers,
          signal: AbortSignal.timeout(15000),
        })

        let xml = await response.text()

        if (!/<rss(?:\s|>)/i.test(xml)) {
          const cookie = xml.match(/document\.cookie\s*=\s*["'](D1N=[a-f0-9]+)["']/i)?.[1]

          if (!cookie) {
            throw new Error('Nguồn không trả về RSS hoặc mẫu cookie D1N đã thay đổi')
          }

          headers.Cookie = cookie

          response = await fetch(sourceUrl, {
            headers,
            signal: AbortSignal.timeout(15000),
          })

          xml = await response.text()
        }

        if (!response.ok) {
          throw new Error(`Nguồn trả về HTTP ${response.status}`)
        }

        if (!/<rss(?:\s|>)/i.test(xml)) {
          throw new Error('Nguồn vẫn chưa trả về RSS sau khi gửi cookie')
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        res.end(xml)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không lấy được RSS'

        console.error('Lỗi RSS Lao Động:', message)

        res.statusCode = 502
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(message)
      }
    })
  },
}
export default defineConfig({
  plugins: [react(),laodongRssProxy],

  server: {
    proxy: {
      '/api/laodong': {
        target: 'https://laodong.vn',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api\/laodong/, ''),
      },
    },
  },
})