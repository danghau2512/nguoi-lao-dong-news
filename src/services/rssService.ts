import { rssFeeds } from '../constants/rssFeeds'
import type { NewsArticle } from '../types/news'

export async function getNewsByCategory(categorySlug: string): Promise<NewsArticle[]> {
    const feed = rssFeeds.find((item) => item.categorySlug === categorySlug)

    if (!feed) {
        throw new Error(`Chưa cấu hình RSS cho chuyên mục: ${categorySlug}`)
    }
    const response = await fetch(feed.proxyPath)
    if (!response.ok) {
        throw new Error(`Không lấy được RSS: HTTP ${response.status}`)
    }
    const xml = await response.text()
    const document = new DOMParser().parseFromString(xml, 'application/xml')
    if (document.querySelector('parsererror')) {
        throw new Error('Dữ liệu trả về không phải XML hợp lệ')
    }

    if (document.documentElement.tagName !== 'rss' || !document.querySelector('rss > channel')) {
        throw new Error('Dữ liệu trả về không đúng cấu trúc RSS')
    }

    const items = document.querySelectorAll('rss > channel > item')
    const articles: NewsArticle[] = []

    for (const item of items) {
        const title = item.querySelector('title')?.textContent?.trim() ?? ''
        const sourceUrl = item.querySelector('link')?.textContent?.trim() ?? ''

        if (!title || !sourceUrl) {
            continue
        }

        const description = item.querySelector('description')?.textContent?.trim() ?? ''
        const imageUrl = item.querySelector('enclosure')?.getAttribute('url') ?? ''
        const publishedAt = item.querySelector('pubDate')?.textContent?.trim() ?? ''
        const id = sourceUrl.match(/-(\d+)\.ldo(?:[?#].*)?$/)?.[1] ?? sourceUrl

        articles.push({id, title, description, sourceUrl, categorySlug, imageUrl, publishedAt,})
    }

    return articles
}