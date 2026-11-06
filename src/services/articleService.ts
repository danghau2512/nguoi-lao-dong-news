import DOMPurify from 'dompurify'

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

export function extractArticleContent(html: string, sourceUrl: string): string {
    const document = new DOMParser().parseFromString(
        html,
        'text/html'
    )
    const contentElement = document.querySelector(
        '#gallery-ctt.art-body'
    )
    if (!contentElement) {
        throw new Error('Không tìm thấy vùng nội dung bài viết')
    }
    const contentText = contentElement.textContent?.trim() ?? ''
    if (!contentText) {
        throw new Error('Nội dung bài viết rỗng hoặc chưa được hỗ trợ')
    }
    for (const image of contentElement.querySelectorAll('img')) {
        const imageSources = [
            image.getAttribute('data-src'),
            image.getAttribute('src'),
        ]

        for (const imageSource of imageSources) {
            const value = imageSource?.trim()
            if (!value) continue

            try {
                const imageUrl = new URL(value, sourceUrl)

                if (imageUrl.protocol === 'https:' || imageUrl.protocol === 'http:') {
                    image.setAttribute('src', imageUrl.href)
                    break
                }
            } catch {
            }
        }
    }

    const cleanContent = DOMPurify.sanitize(contentElement.innerHTML, {
        ALLOWED_TAGS: [
            'p', 'br', 'div', 'span',
            'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'b', 'em', 'i',
            'ul', 'ol', 'li', 'blockquote',
            'a', 'figure', 'img', 'figcaption',
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'aside', 'nav'],
        FORBID_CONTENTS: ['script', 'style', 'iframe', 'form', 'aside', 'nav'],
        RETURN_DOM_FRAGMENT: true,
    })

    if (!cleanContent.textContent?.trim() && !cleanContent.querySelector('img[src]')) {
        throw new Error('Nội dung bài viết rỗng hoặc chưa được hỗ trợ')
    }

    contentElement.replaceChildren(cleanContent)
    return contentElement.innerHTML
}