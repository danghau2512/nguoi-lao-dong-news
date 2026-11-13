
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import ArticleToolbar from '../components/ArticleToolbar'
import { fetchArticleDetail } from '../services/articleService'
import {
    isArticleSaved,
    recordArticleView,
    toggleSavedArticle
} from '../services/personalStorage'
import './ArticlePage.css'
import './ArticleSave.css'

type ArticleDetail = Awaited<ReturnType<typeof fetchArticleDetail>>

export default function ArticlePage() {
    const [searchParams] = useSearchParams()
    const sourceUrl = searchParams.get('url')?.trim() ?? ''

    return <ArticleDetailView key={sourceUrl} sourceUrl={sourceUrl} />
}

function isValidArticleUrl(sourceUrl: string): boolean {
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

    const [isSaved, setIsSaved] = useState(() => isArticleSaved(sourceUrl))
    const [saveMessage, setSaveMessage] = useState('')
    const [saveMessageType, setSaveMessageType] =
        useState<'success' | 'error'>('success')

    const sourceError = !sourceUrl
        ? 'Thiếu URL bài viết.'
        : !isValidArticleUrl(sourceUrl)
            ? 'URL bài viết không hợp lệ.'
            : ''

    useEffect(() => {
        if (sourceError !== '') {
            return
        }

        let ignore = false

        fetchArticleDetail(sourceUrl)
            .then((detail) => {
                if (ignore) {
                    return
                }

                setArticle(detail)

                try {
                    recordArticleView({
                        sourceUrl: sourceUrl,
                        title: detail.title,
                        description: detail.description
                    })
                } catch (storageError) {
                    console.error(
                        'Không thể lưu lịch sử xem bài:',
                        storageError
                    )
                }
            })
            .catch((caughtError: unknown) => {
                if (ignore) {
                    return
                }

                if (caughtError instanceof Error && caughtError.message !== '') {
                    setError(caughtError.message)
                } else {
                    setError('Không tải được bài viết.')
                }
            })

        return () => {
            ignore = true
        }
    }, [sourceUrl, sourceError, retryCount])

    useEffect(() => {
        if (saveMessage === '') {
            return
        }

        const timeoutId = window.setTimeout(() => {
            setSaveMessage('')
        }, 3000)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [saveMessage])

    function handleRetry() {
        setError('')
        setRetryCount((count) => count + 1)
    }

    function handleToggleSave() {
        if (article === null) {
            return
        }

        try {
            const saved = toggleSavedArticle({
                sourceUrl: sourceUrl,
                title: article.title,
                description: article.description
            })

            setIsSaved(saved)
            setSaveMessageType('success')

            if (saved === true) {
                setSaveMessage('Đã lưu bài viết thành công!')
            } else {
                setSaveMessage('Đã bỏ lưu bài viết thành công!')
            }
        } catch {
            setSaveMessageType('error')
            setSaveMessage(
                'Không thể lưu bài viết. Hãy kiểm tra bộ nhớ trình duyệt.'
            )
        }
    }

    function handleCloseNotification() {
        setSaveMessage('')
    }

    const errorMessage = sourceError || error

    if (article === null) {
        return (
            <section className="article-page">
                {errorMessage !== '' ? (
                    <p role="alert">{errorMessage}</p>
                ) : (
                    <p role="status">Đang tải bài viết…</p>
                )}

                {error !== '' && sourceError === '' ? (
                    <button type="button" onClick={handleRetry}>
                        Thử lại
                    </button>
                ) : null}

                <Link to="/">Quay lại trang chủ</Link>
            </section>
        )
    }

    return (
        <article className="article-page">

            {saveMessage !== '' ? (
                <div
                    className={
                        saveMessageType === 'success'
                            ? 'article-save-toast article-save-toast-success'
                            : 'article-save-toast article-save-toast-error'
                    }
                    role={saveMessageType === 'error' ? 'alert' : 'status'}
                >
                    <div className="article-save-toast-icon">
                        {saveMessageType === 'success' ? (
                            <CheckCircle2 size={23} aria-hidden="true" />
                        ) : (
                            <CircleAlert size={23} aria-hidden="true" />
                        )}
                    </div>

                    <div className="article-save-toast-content">
                        <strong>
                            {saveMessageType === 'success'
                                ? 'Thông báo'
                                : 'Có lỗi xảy ra'}
                        </strong>

                        <p>{saveMessage}</p>
                    </div>

                    <button
                        type="button"
                        className="article-save-toast-close"
                        onClick={handleCloseNotification}
                        aria-label="Đóng thông báo"
                    >
                        <X size={19} aria-hidden="true" />
                    </button>
                </div>
            ) : null}

            <header className="article-page__header">
                <h1 className="article-page__title">
                    {article.title}
                </h1>

                {article.description !== '' ? (
                    <p className="article-page__description">
                        {article.description}
                    </p>
                ) : null}

                <ArticleToolbar
                    author={article.author}
                    publishedAt={article.publishedAt}
                    isSaved={isSaved}
                    onToggleSave={handleToggleSave}
                />
            </header>

            <div
                className="article-page__content"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            <Link className="article-page__back" to="/">
                Quay lại trang chủ
            </Link>
        </article>
    )
}
