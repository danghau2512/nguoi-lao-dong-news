
import type { NewsArticle } from '../types/news'
import NewsCard from '../components/NewsCard'
import NewsStatus from '../components/NewsStatus'
import './HomePage.css'

type HomePageProps = {
    articles: NewsArticle[]
    isLoading?: boolean
    error?: string | null
}

export default function HomePage(props: HomePageProps) {

    if (props.isLoading === true) {
        return (
            <div className="home-page">
                <NewsStatus type="loading" />
            </div>
        )
    }

    if (
        props.error !== undefined &&
        props.error !== null &&
        props.error.trim() !== ''
    ) {
        return (
            <div className="home-page">
                <NewsStatus
                    type="error"
                    message={props.error}
                />
            </div>
        )
    }

    if (props.articles.length === 0) {
        return (
            <div className="home-page">
                <NewsStatus type="empty" />
            </div>
        )
    }

    const featuredNews = props.articles[0]
    const latestNews = props.articles.slice(1, 3)
    const smallNews = props.articles.slice(3, 8)

    return (
        <div className="home-page">

            <section className="home-page-featured">
                <h1 className="home-page-title">
                    Tin tức nổi bật
                </h1>

                <div className="home-page-featured-content">
                    {featuredNews !== undefined ? (
                        <NewsCard
                            id={featuredNews.id}
                            title={featuredNews.title}
                            description={featuredNews.description}
                            imageUrl={featuredNews.imageUrl}
                            categorySlug={featuredNews.categorySlug}
                            sourceUrl={featuredNews.sourceUrl}
                        />
                    ) : (
                        <p>Chưa có tin tức nổi bật.</p>
                    )}
                </div>
            </section>

            <div className="home-page-bottom">

                <section className="home-page-latest">
                    <h2 className="home-page-title">
                        Tin mới nhất
                    </h2>

                    <div className="home-page-latest-content">
                        {latestNews.length > 0 ? (
                            latestNews.map((news) => (
                                <NewsCard
                                    key={news.id}
                                    id={news.id}
                                    title={news.title}
                                    description={news.description}
                                    imageUrl={news.imageUrl}
                                    categorySlug={news.categorySlug}
                                    sourceUrl={news.sourceUrl}
                                />
                            ))
                        ) : (
                            <p>Chưa có bài viết mới.</p>
                        )}
                    </div>
                </section>

                <aside className="home-page-small-news">
                    <h2 className="home-page-title">
                        Tin đáng chú ý
                    </h2>

                    <div className="home-page-small-news-list">
                        {smallNews.length > 0 ? (
                            smallNews.map((news) => (
                                <NewsCard
                                    key={news.id}
                                    id={news.id}
                                    title={news.title}
                                    description={news.description}
                                    imageUrl={news.imageUrl}
                                    categorySlug={news.categorySlug}
                                    sourceUrl={news.sourceUrl}
                                />
                            ))
                        ) : (
                            <p>Chưa có thêm tin tức.</p>
                        )}
                    </div>
                </aside>

            </div>

        </div>
    )
}
