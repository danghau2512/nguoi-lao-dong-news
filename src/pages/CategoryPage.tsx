
import { Link, useParams } from 'react-router-dom'
import { categories } from '../constants/categories'
import { rssFeeds } from '../constants/rssFeeds'
import { useCategoryNews } from '../hooks/useCategoryNews'
import NewsCard from '../components/NewsCard'
import NewsStatus from '../components/NewsStatus'
import './CategoryPage.css'

type CategoryNewsListProps = {
    categorySlug: string
}

function CategoryNewsList(props: CategoryNewsListProps) {
    const { articles, status, error, retry } = useCategoryNews(props.categorySlug)

    if (status === 'idle' || status === 'loading') {
        return <NewsStatus type="loading" />
    }


    if (status === 'failed') {
        let errorMessage = 'Không thể tải tin tức.'

        if (error !== null && error.trim() !== '') {
            errorMessage = error
        }

        return (
            <div className="category-page-error">

                <NewsStatus
                    type="error"
                    message={errorMessage}
                />

                <div className="category-page-retry">
                    <button
                        type="button"
                        className="category-page-retry-button"
                        onClick={retry}
                    >
                        <i
                            className="fa-solid fa-rotate-right"
                            aria-hidden="true"
                        ></i>

                        Thử lại
                    </button>
                </div>

            </div>
        )
    }

    if (articles.length === 0) {
        return (
            <NewsStatus
                type="empty"
                title="Chuyên mục chưa có bài viết"
                message="Nguồn RSS đã được tải thành công nhưng hiện chưa có bài viết nào để hiển thị."
            />
        )
    }

    return (
        <>
            <p className="category-page-count">
                Có {articles.length} bài viết
            </p>

            <div className="category-page-news-list">
                {articles.map((news) => (
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
        </>
    )
}

export default function CategoryPage() {
    const { slug } = useParams<{ slug: string }>()

    const category = categories.find((item) => {
        return item.slug === slug
    })

    if (category === undefined) {
        return (
            <div className="category-page">
                <h1>Không tìm thấy chuyên mục</h1>

                <p>Chuyên mục bạn yêu cầu không tồn tại.</p>

                <Link to="/">Quay lại trang chủ</Link>
            </div>
        )
    }

    const rssFeed = rssFeeds.find((item) => {
        return item.categorySlug === slug
    })

    return (
        <div className="category-page">

            <div className="category-page-breadcrumb">
                <Link to="/">Trang chủ</Link>

                <i
                    className="fa-solid fa-chevron-right"
                    aria-hidden="true"
                ></i>

                <span>{category.name}</span>
            </div>

            <div className="category-page-heading">
                <h1>{category.name}</h1>

                <p>
                    Danh sách tin tức thuộc chuyên mục {category.name}
                </p>
            </div>

            <div className="category-page-content">
                {rssFeed !== undefined ? (
                    <CategoryNewsList
                        categorySlug={category.slug}
                    />
                ) : (
                    <div className="category-page-no-feed">
                        <NewsStatus
                            type="empty"
                            title="Chuyên mục chưa có nguồn RSS"
                            message={`Chuyên mục ${category.name} hiện chưa được cấu hình nguồn RSS. Bạn có thể xem tin tức tại các chuyên mục đã hỗ trợ.`}
                        />

                        <div className="category-page-other-links">
                            <Link to="/chuyen-muc/thoi-su">
                                Thời sự
                            </Link>

                            <Link to="/chuyen-muc/kinh-doanh">
                                Kinh doanh
                            </Link>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}
