
export type ArticleAiMessage = {
    role: 'user' | 'assistant'
    text: string
}

type ArticleAiRequest = {
    mode: 'summary' | 'question'
    title: string
    articleText: string
    question?: string
    history: ArticleAiMessage[]
}

export async function askArticleAi(
    data: ArticleAiRequest
): Promise<string> {
    const response = await fetch('/api/ai/article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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

        throw new Error('Không thể kết nối tới trợ lý AI.')
    }

    if (
        typeof result !== 'object' ||
        result === null ||
        !('answer' in result) ||
        typeof result.answer !== 'string'
    ) {
        throw new Error('Dữ liệu trả về từ AI không hợp lệ.')
    }

    return result.answer
}
