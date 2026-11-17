import type { IncomingMessage, ServerResponse } from 'node:http'
import { ARTICLE_AUDIO_VOICES, DEFAULT_ARTICLE_AUDIO_VOICE } from '../src/constants/articleAudioVoices.ts'

const speeds = [0.8, 1, 1.2]

function sendError(res: ServerResponse, status: number, message: string) {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ message }))
}

export async function handleViettelTtsRequest(
    req: IncomingMessage,
    res: ServerResponse,
    token?: string,
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return sendError(res, 405, 'Hãy gửi yêu cầu bằng POST.')
    }

    if (!token) {
        return sendError(res, 503, 'Máy chủ chưa cấu hình VIETTEL_AI_TOKEN.')
    }

    let body = ''
    let input: { text?: unknown; voice?: unknown; speed?: unknown }

    try {
        req.setEncoding('utf8')

        for await (const chunk of req.iterator({ destroyOnReturn: false })) {
            body += chunk

            if (body.length > 16_000) {
                req.resume()
                return sendError(res, 413, 'Dữ liệu gửi lên quá lớn.')
            }
        }

        input = JSON.parse(body) ?? {}
    } catch {
        return sendError(res, 400, 'Dữ liệu gửi lên phải là JSON.')
    }

    const { text, speed = 1 } = input
    const voice = input.voice ?? DEFAULT_ARTICLE_AUDIO_VOICE

    if (typeof text !== 'string' || !text.trim() || text.trim().length > 3000) {
        return sendError(res, 400, 'Đoạn cần đọc phải có từ 1 đến 3.000 ký tự.')
    }

    if (!ARTICLE_AUDIO_VOICES.some(({ id }) => id === voice)) {
        return sendError(res, 400, 'Giọng đọc không hợp lệ.')
    }

    if (typeof speed !== 'number' || !speeds.includes(speed)) {
        return sendError(res, 400, 'Tốc độ đọc không hợp lệ.')
    }

    try {
        const audio = await fetch('https://viettelai.vn/tts/speech_synthesis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text.trim(),
                voice,
                speed,
                token,
                tts_return_option: 3,
                without_filter: false,
            }),
            signal: AbortSignal.timeout(30_000),
        })

        if (!audio.ok) {
            return sendError(res, 502, `Viettel AI trả lỗi HTTP ${audio.status}.`)
        }

        const contentType = audio.headers.get('Content-Type') ?? ''
        if (!contentType.startsWith('audio/') && !contentType.startsWith('application/octet-stream')) {
            return sendError(res, 502, 'Viettel AI chưa trả về dữ liệu âm thanh.')
        }

        const mp3 = Buffer.from(await audio.arrayBuffer())
        res.setHeader('Content-Type', 'audio/mpeg')
        res.setHeader('Cache-Control', 'no-store')
        res.end(mp3)
    } catch {
        sendError(res, 502, 'Không nhận được âm thanh từ Viettel AI.')
    }
}
