
import type { IncomingMessage, ServerResponse } from 'node:http'

const VIETTEL_STT_URL = 'https://viettelai.vn/asr/recognize'

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

    for (const key of [
        'transcript',
        'text',
        'utterance',
        'sentence',
        'transcription'
    ]) {
        if (typeof data[key] === 'string') {
            return data[key].trim()
        }
    }

    for (const key of [
        'response',
        'result',
        'results',
        'hypotheses',
        'alternatives',
        'segments',
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

    if (!token || token.trim() === '') {
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

    if (
        audioBuffer.length < 44 ||
        audioBuffer.toString('ascii', 0, 4) !== 'RIFF' ||
        audioBuffer.toString('ascii', 8, 12) !== 'WAVE'
    ) {
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

    formData.append('token', token.trim())

    try {
        const response = await fetch(VIETTEL_STT_URL, {
            method: 'POST',
            headers: {
                accept: '*/*'
            },
            body: formData,
            signal: AbortSignal.timeout(30000)
        })

        let result: unknown

        try {
            result = await response.json()
        } catch {
            sendJson(res, 502, {
                message: 'Viettel STT không trả về JSON hợp lệ.'
            })
            return
        }

        if (
            typeof result !== 'object' ||
            result === null ||
            Array.isArray(result)
        ) {
            sendJson(res, 502, {
                message: 'Dữ liệu trả về từ Viettel không hợp lệ.'
            })
            return
        }

        const data = result as Record<string, unknown>

        if (!response.ok || data.code !== 200) {
            const errorCode = typeof data.code === 'number'
                ? data.code
                : response.status

            const apiMessage = typeof data.message === 'string'
                ? data.message
                : 'Không xác định được nguyên nhân.'

            console.error(
                'Lỗi Viettel STT:',
                'HTTP:', response.status,
                'Code:', data.code,
                'Message:', apiMessage
            )

            if (errorCode === 401) {
                sendJson(res, 502, {
                    message:
                        'Viettel STT chưa xác thực được token. ' +
                        'Kiểm tra token trong file .env.'
                })
                return
            }

            if (errorCode === 403) {
                sendJson(res, 502, {
                    message:
                        'Token hiện tại không có quyền sử dụng Viettel STT.'
                })
                return
            }

            if (errorCode === 400) {
                sendJson(res, 502, {
                    message:
                        'Viettel STT báo dữ liệu đầu vào không hợp lệ.'
                })
                return
            }

            sendJson(res, 502, {
                message:
                    'Viettel STT trả về lỗi. HTTP ' +
                    response.status +
                    ', mã API ' +
                    String(data.code ?? 'không có') +
                    '.'
            })
            return
        }

        if (data.response === undefined || data.response === null) {
            sendJson(res, 502, {
                message:
                    'Viettel STT trả về thành công nhưng thiếu kết quả.'
            })
            return
        }

        console.log(
            'Viettel STT response:',
            JSON.stringify(data.response, null, 2)
        )

        const transcript = getTranscript(data.response)

        console.log('Văn bản trích xuất:', transcript)

        if (transcript === '') {
            console.error(
                'Không tìm thấy trường văn bản trong response Viettel.'
            )

            sendJson(res, 502, {
                message:
                    'Chưa đọc được văn bản từ phản hồi Viettel STT. ' +
                    'Cần kiểm tra cấu trúc response thực tế.'
            })
            return
        }

        sendJson(res, 200, {
            transcript: transcript
        })
    } catch (error) {
        console.error('Lỗi gọi Viettel STT:', error)

        if (error instanceof Error) {
            console.error('Tên lỗi:', error.name)
            console.error('Thông báo lỗi:', error.message)
            console.error('Nguyên nhân gốc:', error.cause)
        }

        sendJson(res, 502, {
            message: 'Không thể kết nối Viettel Speech-to-Text.'
        })
    }
}
