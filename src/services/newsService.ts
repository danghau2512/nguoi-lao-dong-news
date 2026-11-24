
import Fuse from 'fuse.js'
import type { NewsArticle } from '../types/news.ts'

function normalizeSearchText(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function containsPhrase(text: string, query: string): boolean {
    return (' ' + text + ' ').includes(' ' + query + ' ')
}

export function searchArticles(
    articles: NewsArticle[],
    keyword: string
): NewsArticle[] {
    const query = normalizeSearchText(keyword)

    if (query === '') {
        return []
    }

    const keywords = [...new Set(query.split(' '))]

    const searchData = articles.map((article) => {
        const title = normalizeSearchText(article.title)

        const description = normalizeSearchText(
            article.description
        )

        const category = normalizeSearchText(
            article.categorySlug
        )

        const words = [
            ...new Set(
                (title + ' ' + description)
                    .split(' ')
                    .filter((word) => word !== '')
            )
        ]

        return {
            article: article,
            title: title,
            description: description,
            category: category,
            words: words
        }
    })

    const exactTitleResults = searchData.filter((item) => {
        return containsPhrase(item.title, query)
    })

    const categoryResults = searchData.filter((item) => {
        return item.category === query
    })

    const exactDescriptionResults = searchData.filter((item) => {
        return containsPhrase(item.description, query)
    })

    const uniqueResults = new Map<string, NewsArticle>()

    const exactResults = [
        ...exactTitleResults,
        ...categoryResults,
        ...exactDescriptionResults
    ]

    for (const item of exactResults) {
        const article = item.article
        const articleKey = article.sourceUrl || article.id

        if (!uniqueResults.has(articleKey)) {
            uniqueResults.set(articleKey, article)
        }
    }

    if (uniqueResults.size > 0) {
        return Array.from(uniqueResults.values())
    }

    const hasLongKeyword = keywords.some((word) => {
        return word.length > 3
    })

    if (!hasLongKeyword) {
        return []
    }

    const allKeywordResults = searchData.filter((item) => {
        return keywords.every((word) => {
            return item.words.includes(word)
        })
    })

    for (const item of allKeywordResults) {
        const article = item.article
        const articleKey = article.sourceUrl || article.id

        if (!uniqueResults.has(articleKey)) {
            uniqueResults.set(articleKey, article)
        }
    }

    if (uniqueResults.size > 0) {
        return Array.from(uniqueResults.values())
    }

    const fuzzyResults: {
        article: NewsArticle
        score: number
    }[] = []

    for (const item of searchData) {
        const fuse = new Fuse(item.words, {
            threshold: 0.25,
            ignoreLocation: true,
            includeScore: true,
            shouldSort: true
        })

        let totalScore = 0
        let exactMatchCount = 0
        let fuzzyMatchCount = 0
        let isMatched = true

        for (const word of keywords) {
            if (item.words.includes(word)) {
                exactMatchCount++
                continue
            }

            if (word.length <= 3) {
                isMatched = false
                break
            }

            const matches = fuse.search(word)

            const bestMatch = matches.find((match) => {
                return (
                    Math.abs(match.item.length - word.length) <= 1 &&
                    (match.score ?? 1) <= 0.25
                )
            })

            if (!bestMatch) {
                isMatched = false
                break
            }

            fuzzyMatchCount++
            totalScore += bestMatch.score ?? 1
        }

        if (
            keywords.length > 1 &&
            exactMatchCount === 0
        ) {
            isMatched = false
        }

        if (fuzzyMatchCount > 1) {
            isMatched = false
        }

        if (isMatched) {
            fuzzyResults.push({
                article: item.article,
                score: totalScore / keywords.length
            })
        }
    }

    fuzzyResults.sort((a, b) => {
        return a.score - b.score
    })

    for (const item of fuzzyResults) {
        const article = item.article
        const articleKey = article.sourceUrl || article.id

        if (!uniqueResults.has(articleKey)) {
            uniqueResults.set(articleKey, article)
        }
    }

    return Array.from(uniqueResults.values())
}
