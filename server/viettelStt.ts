
import type { IncomingMessage, ServerResponse } from 'node:http'

const VIETTEL_STT_URL =
    'https://viettelgroup.ai/voice/api/asr/v1/rest/decode_file'

const MAX_AUDIO_SIZE = 2 * 1024 * 1024

function sendJson(
    res: ServerResponse,
    status: number,
    data: object
) {
    res.statusCode = status
    res.setHeader(
        'Content-Type',
        'application/json; charset=utf-8'
    )
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(data))
}

function getTranscript(value: unknown): string {
    if (typeof value === 'string') {
        return value.trim()
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const text = getTranscript(item)

            if (text !== '') {
                return text
            }
        }

        return ''
    }

    if (typeof value !== 'object' || value === null) {
        return ''
    }

    const data = value as Record<string, unknown>

    for (const key of ['transcript', 'text', 'utterance', 'sentence']) {
        if (typeof data[key] === 'string') {
            return data[key].trim()
        }
    }

    for (const key of [
        'result',
        'results',
        'hypotheses',
        'alternatives',
        'data'
    ]) {
        if (data[key] !== undefined) {
            const text = getTranscript(data[key])

            if (text !== '') {
                return text
            }
        }
    }

    return ''
}

export async function handleViettelSttRequest(
    req: IncomingMessage,
    res: ServerResponse,
    token?: string
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')

        sendJson(res, 405, {
            message: 'API chỉ hỗ trợ phương thức POST.'
        })
        return
    }

    if (!token) {
        sendJson(res, 503, {
            message: 'Chưa cấu hình Viettel STT token.'
        })
        return
    }

    const contentType = req.headers['content-type'] ?? ''

    if (!contentType.startsWith('audio/wav')) {
        sendJson(res, 415, {
            message: 'File gửi lên phải có định dạng WAV.'
        })
        return
    }

    const chunks: Buffer[] = []
    let totalSize = 0

    try {
        for await (const chunk of req) {
            const data = Buffer.isBuffer(chunk)
                ? chunk
                : Buffer.from(chunk)

            totalSize += data.length

            if (totalSize > MAX_AUDIO_SIZE) {
                sendJson(res, 413, {
                    message: 'File ghi âm vượt quá 2MB.'
                })
                return
            }

            chunks.push(data)
        }
    } catch {
        sendJson(res, 400, {
            message: 'Không đọc được dữ liệu ghi âm.'
        })
        return
    }

    const audioBuffer = Buffer.concat(chunks)

    if (audioBuffer.length < 44 ||
        audioBuffer.toString('ascii', 0, 4) !== 'RIFF' ||
        audioBuffer.toString('ascii', 8, 12) !== 'WAVE') {
        sendJson(res, 400, {
            message: 'Nội dung file WAV không hợp lệ.'
        })
        return
    }

    const formData = new FormData()

    formData.append(
        'file',
        new Blob([new Uint8Array(audioBuffer)], {
            type: 'audio/wav'
        }),
        'voice-search.wav'
    )

    try {
        const response = await fetch(VIETTEL_STT_URL, {
            method: 'POST',
            headers: {
                token: token
            },
            body: formData,
            signal: AbortSignal.timeout(30000)
        })

        if (!response.ok) {
            console.error(
                'Viettel STT HTTP status:',
                response.status
            )

            sendJson(res, 502, {
                message:
                    'Viettel STT trả về HTTP ' +
                    response.status +
                    '. Kiểm tra endpoint và quyền token.'
            })
            return
        }

        const result: unknown = await response.json()
        const transcript = getTranscript(result)

        if (transcript === '') {
            sendJson(res, 502, {
                message:
                    'Chưa đọc được văn bản từ phản hồi Viettel. ' +
                    'Cần kiểm tra cấu trúc JSON thực tế.'
            })
            return
        }

        sendJson(res, 200, {
            transcript: transcript
        })
    } catch (error) {
        console.error(
            'Lỗi gọi Viettel STT:',
            error instanceof Error ? error.message : 'Unknown'
        )

        sendJson(res, 502, {
            message: 'Không thể kết nối Viettel Speech-to-Text.'
        })
    }
}
