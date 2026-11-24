
export async function extractSearchKeyword(
    text: string
): Promise<string> {
    const response = await fetch('/api/ai/search-keyword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        }),
        signal: AbortSignal.timeout(20000)
    })

    const result: unknown = await response.json()

    if (!response.ok) {
        if (
            typeof result === 'object' &&
            result !== null &&
            'message' in result &&
            typeof result.message === 'string'
        ) {
            throw new Error(result.message)
        }

        throw new Error('Không thể xử lý từ khóa bằng AI.')
    }

    if (
        typeof result !== 'object' ||
        result === null ||
        !('keyword' in result) ||
        typeof result.keyword !== 'string' ||
        result.keyword.trim() === ''
    ) {
        throw new Error('Gemini không trả về từ khóa hợp lệ.')
    }

    return result.keyword.trim()
}
