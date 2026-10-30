export interface NewsCategory {
    slug: string
    name: string
}
export interface NewsArticle {
    id: string
    title: string
    description: string
    sourceUrl: string
    categorySlug: string
    imageUrl?: string
    publishedAt?: string
}
export interface ArticleDetail extends NewsArticle {
    contentHtml: string
    author?: string
}