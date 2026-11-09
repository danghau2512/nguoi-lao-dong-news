
import { Link, useSearchParams } from 'react-router-dom'
import type { NewsArticle } from '../types/news'
import { useCategoryNews } from '../hooks/useCategoryNews'
import { categories } from '../constants/categories'
import NewsCard from '../components/NewsCard'
import NewsStatus from '../components/NewsStatus'
import './SearchPage.css'

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const { articles, status, error } = useCategoryNews('thoi-su')

    const queryValue = searchParams.get('q')

    let searchKeyword = ''

    if (queryValue !== null) {
        searchKeyword = queryValue.trim()
    }

    const normalizedKeyword = searchKeyword.toLocaleLowerCase('vi-VN')

    let searchResults: NewsArticle[] = []

    if (normalizedKeyword !== '') {
        searchResults = articles.filter((article) => {
            const title = article.title.toLocaleLowerCase('vi-VN')
            const description = article.description.toLocaleLowerCase('vi-VN')

            let categoryName = ''

            for (const category of categories) {
                if (category.slug === article.categorySlug) {
                    categoryName = category.name.toLocaleLowerCase('vi-VN')
                    break
                }
            }

            if (title.includes(normalizedKeyword)) {
                return true
            }

            if (description.includes(normalizedKeyword)) {
                return true
            }

            if (categoryName.includes(normalizedKeyword)) {
                return true
            }

            return false
        })
    }

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
                ) : (status === 'idle' || status === 'loading') ? (
                    <NewsStatus type="loading" />
                ) : status === 'failed' ? (
                    <NewsStatus
                        type="error"
                        message={error ?? undefined}
                    />
                ) : (
                    <>
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
                            <NewsStatus type="empty" />
                        )}
                    </>
                )}

            </div>

        </div>
    )
}
