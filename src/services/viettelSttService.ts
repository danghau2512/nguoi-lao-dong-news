
import { convertAudioToWav } from '../utils/audioWav'

export async function transcribeWithViettel(
    audio: Blob
): Promise<string> {
    const wavAudio = await convertAudioToWav(audio)

    if (wavAudio.size > 2 * 1024 * 1024) {
        throw new Error('Bản ghi quá dài. Hãy nói ngắn hơn.')
    }

    const response = await fetch('/api/stt', {
        method: 'POST',
        headers: {
            'Content-Type': 'audio/wav'
        },
        body: wavAudio
    })

    const result: unknown = await response.json()

    if (typeof result !== 'object' || result === null) {
        throw new Error('Phản hồi API không hợp lệ.')
    }

    if (!response.ok) {
        if ('message' in result &&
            typeof result.message === 'string') {
            throw new Error(result.message)
        }

        throw new Error('Không thể nhận dạng giọng nói.')
    }

    if (!('transcript' in result) ||
        typeof result.transcript !== 'string') {
        throw new Error('API không trả về văn bản hợp lệ.')
    }

    const keyword = result.transcript
        .replace(/[.,!?;:]+$/g, '')
        .trim()

    if (keyword === '') {
        throw new Error('Không nhận dạng được từ khóa tìm kiếm.')
    }

    return keyword
}
