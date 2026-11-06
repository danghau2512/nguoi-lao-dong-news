
import { Link, useParams } from 'react-router-dom'
import type { NewsArticle } from '../types/news'
import { categories } from '../constants/categories'
import NewsCard from '../components/NewsCard'
import NewsStatus from '../components/NewsStatus'
import './CategoryPage.css'

type CategoryPageProps = {
    articles: NewsArticle[]
}

export default function CategoryPage(props: CategoryPageProps) {
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

    const categoryArticles = props.articles.filter((article) => {
        return article.categorySlug === slug
    })

    return (
        <div className="category-page">

            <div className="category-page-breadcrumb">
                <Link to="/">Trang chủ</Link>

                <i className="fa-solid fa-chevron-right"></i>

                <span>{category.name}</span>
            </div>

            <div className="category-page-heading">
                <h1>{category.name}</h1>

                <p>
                    Danh sách tin tức thuộc chuyên mục {category.name}
                </p>
            </div>

            <div className="category-page-content">

                {categoryArticles.length > 0 ? (
                    <>
                        <p className="category-page-count">
                            Có {categoryArticles.length} bài viết
                        </p>

                        <div className="category-page-news-list">
                            {categoryArticles.map((news) => (
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
                ) : (
                    <NewsStatus type="empty" />
                )}

            </div>

        </div>
    )
}
