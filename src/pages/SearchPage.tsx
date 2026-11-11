
import { Link, useSearchParams } from 'react-router-dom'
import type { NewsArticle } from '../types/news'
import { useCategoryNews } from '../hooks/useCategoryNews'
import { searchArticles } from '../services/newsService'
import NewsCard from '../components/NewsCard'
import NewsStatus from '../components/NewsStatus'
import './SearchPage.css'

export default function SearchPage() {
    const [searchParams] = useSearchParams()

    const thoiSu = useCategoryNews('thoi-su')
    const kinhDoanh = useCategoryNews('kinh-doanh')

    const articles: NewsArticle[] = [
        ...thoiSu.articles,
        ...kinhDoanh.articles
    ]

    let isLoading = false

    if (
        thoiSu.status === 'idle' ||
        thoiSu.status === 'loading' ||
        kinhDoanh.status === 'idle' ||
        kinhDoanh.status === 'loading'
    ) {
        isLoading = true
    }

    let bothFailed = false

    if (
        thoiSu.status === 'failed' &&
        kinhDoanh.status === 'failed'
    ) {
        bothFailed = true
    }

    let hasOneFailed = false
    let failedFeedName = ''

    if (
        thoiSu.status === 'failed' &&
        kinhDoanh.status !== 'failed'
    ) {
        hasOneFailed = true
        failedFeedName = 'Thời sự'
    } else if (
        kinhDoanh.status === 'failed' &&
        thoiSu.status !== 'failed'
    ) {
        hasOneFailed = true
        failedFeedName = 'Kinh doanh'
    }

    function handleRetry() {
        if (thoiSu.status === 'failed') {
            thoiSu.retry()
        }

        if (kinhDoanh.status === 'failed') {
            kinhDoanh.retry()
        }
    }

    const queryValue = searchParams.get('q')

    let searchKeyword = ''

    if (queryValue !== null) {
        searchKeyword = queryValue.trim()
    }

    const searchResults = searchArticles(articles, searchKeyword)

    return (
        <div className="search-page">

            <div className="search-page-breadcrumb">
                <Link to="/">Trang chủ</Link>

                <i
                    className="fa-solid fa-chevron-right"
                    aria-hidden="true"
                ></i>

                <span>Tìm kiếm</span>
            </div>

            <div className="search-page-heading">
                <h1>Kết quả tìm kiếm</h1>

                {searchKeyword !== '' ? (
                    <p>
                        Từ khóa:
                        <strong> {searchKeyword}</strong>
                    </p>
                ) : (
                    <p>Tìm kiếm các bài viết trên Góc Tin.</p>
                )}
            </div>

            <div className="search-page-content">

                {searchKeyword === '' ? (
                    <div className="search-page-message">
                        <i
                            className="fa-solid fa-magnifying-glass"
                            aria-hidden="true"
                        ></i>

                        <h2>Chưa nhập từ khóa</h2>

                        <p>
                            Vui lòng nhập từ khóa vào thanh tìm kiếm
                            trên Header hoặc Footer.
                        </p>
                    </div>
                ) : isLoading === true ? (
                    <NewsStatus type="loading" />
                ) : bothFailed === true ? (
                    <div className="search-page-error">

                        <NewsStatus
                            type="error"
                            message="Không thể tải dữ liệu từ cả hai nguồn RSS."
                        />

                        <div className="search-page-retry">
                            <button
                                type="button"
                                className="search-page-retry-button"
                                onClick={handleRetry}
                            >
                                <i
                                    className="fa-solid fa-rotate-right"
                                    aria-hidden="true"
                                ></i>

                                Thử lại
                            </button>
                        </div>

                    </div>
                ) : (
                    <>
                        {hasOneFailed === true ? (
                            <div
                                className="search-page-warning"
                                role="alert"
                            >
                                <div className="search-page-warning-content">
                                    <i
                                        className="fa-solid fa-triangle-exclamation"
                                        aria-hidden="true"
                                    ></i>

                                    <div>
                                        <h2>
                                            Không thể tải RSS {failedFeedName}
                                        </h2>

                                        <p>
                                            Kết quả tìm kiếm có thể chưa được
                                            cập nhật đầy đủ. Bạn có thể thử
                                            tải lại nguồn RSS bị lỗi.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="search-page-retry-button"
                                    onClick={handleRetry}
                                >
                                    <i
                                        className="fa-solid fa-rotate-right"
                                        aria-hidden="true"
                                    ></i>

                                    Thử lại
                                </button>
                            </div>
                        ) : null}

                        <p className="search-page-count">
                            Tìm thấy {searchResults.length} bài viết
                            phù hợp với từ khóa
                            <strong> "{searchKeyword}"</strong>
                        </p>

                        {searchResults.length > 0 ? (
                            <div className="search-page-news-list">
                                {searchResults.map((news) => (
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
                        ) : (
                            <NewsStatus
                                type="empty"
                                title="Không tìm thấy bài viết"
                                message="Không có bài viết nào phù hợp với từ khóa bạn đã nhập trong dữ liệu hiện có."
                            />
                        )}
                    </>
                )}

            </div>

        </div>
    )
}
