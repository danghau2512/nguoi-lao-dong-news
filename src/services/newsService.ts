import type {NewsArticle} from "../types/news.ts";

function normalizeSearchText(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
}

export function searchArticles(articles: NewsArticle[], keyword: string): NewsArticle[] {
    const query = normalizeSearchText(keyword)

    if (!query) {
        return []
    }

    return articles.filter((article) => {
        const title = normalizeSearchText(article.title)
        const description = normalizeSearchText(article.description)

        return title.includes(query) || description.includes(query)
    })
}
