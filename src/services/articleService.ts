export async function fetchArticleHtml(sourceUrl: string): Promise<string> {
    if (!sourceUrl.trim()) {
        throw new Error('Thiếu URL bài viết')
    }
    const params = new URLSearchParams({
        url: sourceUrl,
    })
    const response = await fetch(
        `/api/laodong/article?${params.toString()}`
    )
    if (!response.ok) {
        let message = `Không lấy được bài viết: HTTP ${response.status}`

        try {
            const errorData: unknown = await response.json()

            if (
                typeof errorData === 'object' &&
                errorData !== null &&
                'message' in errorData &&
                typeof errorData.message === 'string'
            ) {
                message = errorData.message
            }
        } catch {
        }

        throw new Error(message)
    }
    const contentType = response.headers.get('content-type') ?? ''

    if (!contentType.toLowerCase().includes('text/html')) {
        throw new Error('Proxy không trả về HTML')
    }
    const html = await response.text()

    if (!html.trim()) {
        throw new Error('Nội dung HTML rỗng')
    }
    return html
}

export function extractArticleSummary(html: string) {
    const document = new DOMParser().parseFromString(
        html,
        'text/html'
    )
    const title =
        document.querySelector('h1.title')?.textContent?.trim() ?? ''
    const description =
        document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content')
            ?.trim() ?? ''
    if (!title) {
        throw new Error('Không tìm thấy tiêu đề bài viết')
    }
    const author =
        document.querySelector('span.authors')?.textContent?.trim() ||
        undefined
    const publishedAt =
        document
            .querySelector(
                'meta[property="article:published_time"], ' +
                'meta[name="article:published_time"]'
            )
            ?.getAttribute('content')
            ?.trim() || undefined
    return {
        title,
        description,
        author,
        publishedAt,
    }
}