
import { useState } from 'react'
import NewsCard from '../components/NewsCard'
import NewsStatus from '../components/NewsStatus'
import { useCategoryNews } from '../hooks/useCategoryNews'
import './HomePage.css'

const LOAD_MORE_SIZE = 6

export default function HomePage() {
    const { articles, status, error, retry } =
        useCategoryNews('thoi-su')

    const [visibleMoreCount, setVisibleMoreCount] =
        useState(LOAD_MORE_SIZE)

    if (status === 'idle' || status === 'loading') {
        return (
            <div className="home-page">
                <NewsStatus type="loading" />
            </div>
        )
    }

    if (status === 'failed') {
        return (
            <div className="home-page">
                <NewsStatus
                    type="error"
                    message={error ?? undefined}
                />

                <button type="button" onClick={retry}>
                    Thử lại
                </button>
            </div>
        )
    }

    if (articles.length === 0) {
        return (
            <div className="home-page">
                <NewsStatus type="empty" />
            </div>
        )
    }

    const featuredNews = articles[0]
    const latestNews = articles.slice(1, 3)
    const smallNews = articles.slice(3, 8)

    const moreNews = articles.slice(8)

    const visibleMoreNews = moreNews.slice(
        0,
        visibleMoreCount
    )

    const hasMoreNews = visibleMoreCount < moreNews.length

    function handleLoadMore() {
        setVisibleMoreCount((count) => {
            return count + LOAD_MORE_SIZE
        })
    }

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

            {moreNews.length > 0 ? (
                <section className="home-page-more">
                    <h2 className="home-page-title">
                        Tin khác
                    </h2>

                    <p className="home-page-more-count">
                        Đang hiển thị {visibleMoreNews.length}
                        /{moreNews.length} bài viết
                    </p>

                    <div className="home-page-more-list">
                        {visibleMoreNews.map((news) => (
                            <NewsCard
                                key={news.id}
                                id={news.id}
                                title={news.title}
                                description={news.description}
                                imageUrl={news.imageUrl}
                                categorySlug={news.categorySlug}
                                sourceUrl={news.sourceUrl}
                            />
                        ))}
                    </div>

                    {hasMoreNews === true ? (
                        <div className="home-page-more-actions">
                            <button
                                type="button"
                                className="home-page-more-button"
                                onClick={handleLoadMore}
                            >
                                Xem thêm bài viết
                            </button>
                        </div>
                    ) : null}
                </section>
            ) : null}
        </div>
    )
}
