import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchArticleDetail } from '../services/articleService'
import './ArticlePage.css'


    type ArticleDetail = Awaited<ReturnType<typeof fetchArticleDetail>>

    export default function ArticlePage() {
        const [searchParams] = useSearchParams()
        const sourceUrl = searchParams.get('url')?.trim() ?? ''

        return <ArticleDetailView key={sourceUrl} sourceUrl={sourceUrl} />
    }

    function isValidArticleUrl(sourceUrl: string) {
        try {
            const url = new URL(sourceUrl)

            return (
                url.origin === 'https://laodong.vn' &&
                url.pathname.endsWith('.ldo')
            )
        } catch {
            return false
        }
    }

    function ArticleDetailView({ sourceUrl }: { sourceUrl: string }) {
        const [article, setArticle] = useState<ArticleDetail | null>(null)
        const [error, setError] = useState('')

        const [retryCount, setRetryCount] = useState(0)

        function handleRetry() {
            setError('')
            setRetryCount((count) => count + 1)
        }

        const sourceError = !sourceUrl
            ? 'Thiếu URL bài viết.'
            : !isValidArticleUrl(sourceUrl)
                ? 'URL bài viết không hợp lệ.'
                : ''

        useEffect(() => {
            if (sourceError) return

            let ignore = false

            fetchArticleDetail(sourceUrl)
                .then((detail) => {
                    if (!ignore) setArticle(detail)
                })
                .catch((error: unknown) => {
                    if (ignore) return

                    setError(
                        error instanceof Error && error.message
                            ? error.message
                            : 'Không tải được bài viết.'
                    )
                })

            return () => {
                ignore = true
            }
        }, [sourceUrl, sourceError, retryCount])

        const errorMessage = sourceError || error

        if (!article) {
            return (
                <section className="article-page">
                    {errorMessage ? (
                        <p role="alert">{errorMessage}</p>
                    ) : (
                        <p role="status">Đang tải bài viết…</p>
                    )}

                    {error && !sourceError && (
                        <button type="button" onClick={handleRetry}>
                            Thử lại
                        </button>
                    )}

                    <Link to="/">Quay lại trang chủ</Link>
                </section>
            )
        }
    return (
        <article className="article-page">
            <header className="article-page__header">
                <h1 className="article-page__title">{article.title}</h1>

                {article.description && (
                    <p className="article-page__description">{article.description}</p>
                )}

                {article.author && <p>{article.author}</p>}

                {article.publishedAt && (
                    <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleString('vi-VN', {
                            timeZone: 'Asia/Ho_Chi_Minh',
                        })}
                    </time>
                )}
            </header>

            <div
                className="article-page__content"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}/>

            <Link className="article-page__back" to="/"> Quay lại trang chủ </Link>
        </article>
    )
}