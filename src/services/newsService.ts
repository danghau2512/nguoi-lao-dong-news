
import Fuse from 'fuse.js'
import type { NewsArticle } from '../types/news.ts'

function normalizeSearchText(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, ' ')
}

export function searchArticles(
    articles: NewsArticle[],
    keyword: string
): NewsArticle[] {
    const query = normalizeSearchText(keyword)

    if (query === '' || !/[\p{L}\p{N}]/u.test(query)) {
        return []
    }

    const searchData = articles.map((article) => {
        return {
            article: article,
            title: normalizeSearchText(article.title),
            description: normalizeSearchText(article.description),
            category: normalizeSearchText(
                article.categorySlug.replace(/-/g, ' ')
            )
        }
    })

    const fuse = new Fuse(searchData, {
        keys: [
            {
                name: 'title',
                weight: 0.7
            },
            {
                name: 'description',
                weight: 0.3
            }
        ],
        threshold: query.length <= 3 ? 0 : 0.3,
        ignoreLocation: true,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 2
    })

    const exactTitleResults = searchData.filter((item) => {
        return item.title.includes(query)
    })

    const categoryResults = searchData.filter((item) => {
        return item.category === query
    })

    const exactDescriptionResults = searchData.filter((item) => {
        return item.description.includes(query)
    })

    const fuzzyResults = fuse.search(query).map((result) => {
        return result.item
    })

    const combinedResults = [
        ...exactTitleResults,
        ...categoryResults,
        ...exactDescriptionResults,
        ...fuzzyResults
    ]

    const uniqueResults = new Map<string, NewsArticle>()

    for (const item of combinedResults) {
        const article = item.article
        const articleKey = article.sourceUrl || article.id

        if (!uniqueResults.has(articleKey)) {
            uniqueResults.set(articleKey, article)
        }
    }

    return Array.from(uniqueResults.values())
}
