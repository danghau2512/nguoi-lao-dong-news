import { Link, useParams } from 'react-router-dom'
import {mockNews} from "../data/mockNews.ts";
import { categories } from '../constants/categories'

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>()

    const article = mockNews.find(item => item.id === id)

    if (!article) {
        return (
            <section className={`article-page`}>
                <h2>Không tìm thấy bài viết</h2>
                <p>Bài viết không có trong dữ liệu mẫu hiện tại.</p>
                <Link to="/">Quay lại trang chủ</Link>
            </section>
        )
    }

    const category = categories.find(
        (item) => item.slug === article.categorySlug
    )

    return (
        <article className="article-page">
            <header className="article-page__header">
                <p className="article-page__notice">
                    Dữ liệu mẫu — chưa lấy từ báo Người Lao Động.
                </p>

                <p className="article-page__category">
                    {category?.name ?? 'Chưa có chuyên mục'}
                </p>

                <h1 className="article-page__title">
                    {article.title}
                </h1>

                <p className="article-page__description">
                    {article.description}
                </p>
            </header>

            <Link to="/">Quay lại trang chủ</Link>
        </article>
    )
}