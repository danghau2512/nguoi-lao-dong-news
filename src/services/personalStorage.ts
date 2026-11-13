
export type PersonalArticle = {
    sourceUrl: string
    title: string
    description: string
    timestamp: number
}

type ArticleInformation = {
    sourceUrl: string
    title: string
    description: string
}

const SAVED_KEY = 'goc-tin-saved-articles'
const HISTORY_KEY = 'goc-tin-reading-history'

function readArticles(key: string): PersonalArticle[] {
    try {
        const text = window.localStorage.getItem(key)

        if (text === null) {
            return []
        }

        const data: unknown = JSON.parse(text)

        if (!Array.isArray(data)) {
            return []
        }

        const articles: PersonalArticle[] = []

        for (const item of data) {
            if (typeof item !== 'object' || item === null) {
                continue
            }

            if (
                !('sourceUrl' in item) ||
                !('title' in item) ||
                !('description' in item) ||
                !('timestamp' in item)
            ) {
                continue
            }

            if (
                typeof item.sourceUrl !== 'string' ||
                typeof item.title !== 'string' ||
                typeof item.description !== 'string' ||
                typeof item.timestamp !== 'number' ||
                !Number.isFinite(item.timestamp)
            ) {
                continue
            }

            articles.push({
                sourceUrl: item.sourceUrl,
                title: item.title,
                description: item.description,
                timestamp: item.timestamp
            })
        }

        articles.sort((first, second) => second.timestamp - first.timestamp)

        return articles
    } catch {
        return []
    }
}

export function getSavedArticles(): PersonalArticle[] {
    return readArticles(SAVED_KEY)
}

export function isArticleSaved(sourceUrl: string): boolean {
    const savedArticles = getSavedArticles()

    return savedArticles.some((item) => {
        return item.sourceUrl === sourceUrl
    })
}

export function toggleSavedArticle(article: ArticleInformation): boolean {
    const savedArticles = getSavedArticles()

    const alreadySaved = savedArticles.some((item) => {
        return item.sourceUrl === article.sourceUrl
    })

    if (alreadySaved) {
        const remainingArticles = savedArticles.filter((item) => {
            return item.sourceUrl !== article.sourceUrl
        })

        window.localStorage.setItem(
            SAVED_KEY,
            JSON.stringify(remainingArticles)
        )

        return false
    }

    const newArticle: PersonalArticle = {
        sourceUrl: article.sourceUrl,
        title: article.title,
        description: article.description,
        timestamp: Date.now()
    }

    window.localStorage.setItem(
        SAVED_KEY,
        JSON.stringify([newArticle, ...savedArticles])
    )

    return true
}

export function removeSavedArticle(sourceUrl: string): void {
    const remainingArticles = getSavedArticles().filter((item) => {
        return item.sourceUrl !== sourceUrl
    })

    window.localStorage.setItem(
        SAVED_KEY,
        JSON.stringify(remainingArticles)
    )
}

export function getReadingHistory(): PersonalArticle[] {
    return readArticles(HISTORY_KEY)
}

export function recordArticleView(article: ArticleInformation): void {
    const previousHistory = getReadingHistory()

    const remainingHistory = previousHistory.filter((item) => {
        return item.sourceUrl !== article.sourceUrl
    })

    const recentlyViewed: PersonalArticle = {
        sourceUrl: article.sourceUrl,
        title: article.title,
        description: article.description,
        timestamp: Date.now()
    }

    window.localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify([recentlyViewed, ...remainingHistory])
    )
}
