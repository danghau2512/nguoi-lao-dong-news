
import { useRef, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, CircleAlert, LoaderCircle, X } from 'lucide-react'

import { fetchArticleDetail } from '../services/articleService'
import {
    isArticleSaved,
    recordArticleView,
    toggleSavedArticle
} from '../services/personalStorage'

import ArticleToolbar from '../components/ArticleToolbar'
import ArticleComments from '../components/ArticleComments'
import ArticleAiAssistant from '../components/ArticleAiAssistant'
import ArticleLoading from '../components/ArticleLoading'

import {
    ARTICLE_AUDIO_VOICES,
    DEFAULT_ARTICLE_AUDIO_VOICE
} from '../constants/articleAudioVoices'
import { useArticleAudio } from '../hooks/useArticleAudio'
import { getArticleSpeechText } from '../utils/articleSpeechText'

import './ArticlePage.css'
import './ArticleSave.css'


type ArticleDetail = Awaited<ReturnType<typeof fetchArticleDetail>>

const fontSizeLabels: Record<number, string> = {
    16: 'Nhỏ',
    18: 'Vừa',
    20: 'Lớn',
    22: 'Rất lớn'
}

export default function ArticlePage() {
    const [searchParams] = useSearchParams()

    const sourceUrl = searchParams.get('url')?.trim() ?? ''

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [sourceUrl])

    return (
        <ArticleDetailView
            key={sourceUrl}
            sourceUrl={sourceUrl}
        />
    )
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

function ArticleDetailView({ sourceUrl }: {
    sourceUrl: string
}) {
    const [article, setArticle] = useState<ArticleDetail | null>(null)
    const [error, setError] = useState('')
    const [retryCount, setRetryCount] = useState(0)
    const [fontSize, setFontSize] = useState<number>()
    const [playbackRate, setPlaybackRate] = useState(1)
    const [voice, setVoice] = useState(DEFAULT_ARTICLE_AUDIO_VOICE)
    const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
    const articleContentRef = useRef<HTMLDivElement>(null)
    const [readingProgress, setReadingProgress] = useState(0)

    const { status, audioError, playArticle, pauseArticle, resumeArticle } = useArticleAudio(playbackRate)
    const [isSaved, setIsSaved] = useState(() => {
        return isArticleSaved(sourceUrl)
    })

    const [saveMessage, setSaveMessage] = useState('')

    const [saveMessageType, setSaveMessageType] =
        useState<'success' | 'error'>('success')

    let sourceError = ''

    if (sourceUrl === '') {
        sourceError = 'Thiếu URL bài viết.'
    } else if (isValidArticleUrl(sourceUrl) === false) {
        sourceError = 'URL bài viết không hợp lệ.'
    }

    useEffect(() => {
        if (sourceError !== '') {
            return
        }

        let ignore = false

        fetchArticleDetail(sourceUrl)
            .then((detail) => {
                if (ignore === true) {
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
                if (ignore === true) {
                    return
                }

                if (
                    caughtError instanceof Error &&
                    caughtError.message !== ''
                ) {
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

    function focusCommentInput() {
        document.getElementById(
            'article-comment-content'
        )?.focus()
    }

    function handleFontSizeChange(size: number) {
        if (fontSize === size) {
            return
        }

        setFontSize(size)
        setSaveMessageType('success')
        setSaveMessage(
            `Đã đổi cỡ chữ: ${fontSizeLabels[size]}`
        )
    }

    function handlePrint() {
        window.print()
    }

    function handleCloseNotification() {
        setSaveMessage('')
    }

    useEffect(() => {
        const content = articleContentRef.current

        if (!content) {
            return
        }

        const updateReadingProgress = () => {
            const { top, bottom, height } =
                content.getBoundingClientRect()

            const viewportHeight = window.innerHeight
            const scrollDistance = height - viewportHeight

            if (scrollDistance <= 0) {
                setReadingProgress(
                    bottom <= viewportHeight ? 100 : 0
                )
                return
            }

            const percent = (-top / scrollDistance) * 100

            setReadingProgress(
                Math.min(100, Math.max(0, percent))
            )
        }

        updateReadingProgress()

        window.addEventListener(
            'scroll',
            updateReadingProgress,
            { passive: true }
        )

        window.addEventListener(
            'resize',
            updateReadingProgress
        )

        const observer = new ResizeObserver(updateReadingProgress)
        observer.observe(content)

        return () => {
            window.removeEventListener(
                'scroll',
                updateReadingProgress
            )

            window.removeEventListener(
                'resize',
                updateReadingProgress
            )

            observer.disconnect()
        }
    }, [article])

    const errorMessage = sourceError || error

    if (article === null) {
        if (errorMessage === '') {
            return <ArticleLoading />
        }

        return (
            <section className="article-page">
                <p role="alert">{errorMessage}</p>

                {error !== '' && sourceError === '' ? (
                    <button
                        type="button"
                        onClick={handleRetry}
                    >
                        Thử lại
                    </button>
                ) : null}

                <Link to="/">
                    Quay lại trang chủ
                </Link>
            </section>
        )
    }

    const listenControl = {
        idle: {
            label: 'Đọc bài',
            onClick: () => {
                const text = getArticleSpeechText(article.title, article.contentHtml)
                playArticle(text, voice)
            },
        },
        loading: { label: 'Đọc bài', onClick: undefined },
        ready: { label: 'Đọc bài', onClick: resumeArticle },
        playing: { label: 'Tạm dừng', onClick: pauseArticle },
        paused: { label: 'Tiếp tục', onClick: resumeArticle },

    }[status]
    const isGeneratingAudio = status === 'loading'
    const toastType = isGeneratingAudio ? 'loading' : saveMessageType
    const toastMessage = isGeneratingAudio ? 'Đang tạo âm thanh…' : saveMessage

    const ToastIcon = {
        loading: LoaderCircle,
        success: CheckCircle2,
        error: CircleAlert,
    }[toastType]
    return (
        <article className="article-page">
            <div
                className="article-reading-progress"
                role="progressbar"
                aria-label="Tiến trình đọc bài"
                aria-valuenow={Math.round(readingProgress)}
                style={{ width: `${readingProgress}%` }}
            />

            {toastMessage && (
                <div
                    className={`article-save-toast article-save-toast-${toastType}`}
                    role={toastType === 'error' ? 'alert' : 'status'}
                >
                    <div className="article-save-toast-icon">
                        <ToastIcon size={23} aria-hidden="true" />
                    </div>

                    <div className="article-save-toast-content">
                        <strong>
                            {toastType === 'error' ? 'Có lỗi xảy ra' : 'Thông báo'}
                        </strong>
                        <p>{toastMessage}</p>
                    </div>

                    {!isGeneratingAudio && (
                        <button
                            type="button"
                            className="article-save-toast-close"
                            onClick={handleCloseNotification}
                            aria-label="Đóng thông báo"
                        >
                            <X size={19} aria-hidden="true" />
                        </button>
                    )}
                </div>
            )}

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
                    onFeedback={focusCommentInput}
                    onPrint={handlePrint}
                    author={article.author}
                    publishedAt={article.publishedAt}
                    readingMinutes={article.readingMinutes}
                    isSaved={isSaved}
                    onToggleSave={handleToggleSave}
                    onFontSizeChange={handleFontSizeChange}
                    onListen={listenControl.onClick}
                    onAudioSettings={() => setIsAudioSettingsOpen((open) => !open)}
                    audioSettings={isAudioSettingsOpen && (
                        <>
                            <strong>Cài đặt đọc bài</strong>

                            <label>
                                Giọng đọc
                                <select value={voice} onChange={(event) => setVoice(event.target.value)}>
                                    {ARTICLE_AUDIO_VOICES.map(({ id, label }) => (
                                        <option key={id} value={id}>{label}</option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Tốc độ đọc
                                <select
                                    value={playbackRate}
                                    onChange={(event) => setPlaybackRate(Number(event.target.value))}
                                >
                                    <option value={0.75}>0,75×</option>
                                    <option value={1}>1×</option>
                                    <option value={1.25}>1,25×</option>
                                    <option value={1.5}>1,5×</option>
                                </select>
                            </label>

                            {status !== 'idle' && (
                                <small>Giọng đã chọn áp dụng từ lượt đọc tiếp theo.</small>
                            )}
                        </>
                    )}
                    listenLabel={listenControl.label}
                />
                {audioError && <p role="alert">{audioError}</p>}
            </header>

            <ArticleAiAssistant
                title={article.title}
                contentHtml={article.contentHtml}
            />

            <div
                className="article-page__content"
                ref={articleContentRef}
                style={{ fontSize }}
                dangerouslySetInnerHTML={{
                    __html: article.contentHtml
                }}
            />

            <ArticleComments
                key={sourceUrl}
                sourceUrl={sourceUrl}
            />

            <Link
                className="article-page__back"
                to="/"
            >
                Quay lại trang chủ
            </Link>
        </article>
    )
}
