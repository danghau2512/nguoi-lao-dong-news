export interface RssFeedConfig {
    categorySlug: string
    sourceUrl: string
    proxyPath: string
}

export const rssFeeds: RssFeedConfig[] = [
    {
        categorySlug: 'thoi-su',
        sourceUrl: 'https://laodong.vn/rss/thoi-su.rss',
        proxyPath: '/api/laodong/rss/thoi-su.rss',
    },
]