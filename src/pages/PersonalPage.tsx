import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { Bookmark, Clock3, Trash2 } from 'lucide-react'
import {
    getReadingHistory,
    getReadingMark
} from '../services/personalStorage'
import type { PersonalArticle } from '../services/personalStorage'
import { logoutUser } from '../store/authSlice'
import { removeSaved } from '../store/savedArticlesSlice'
import type { AppDispatch, RootState } from '../store/store'
import './PersonalPage.css'

type PersonalTab = 'saved' | 'history'

function getArticlePath(article: PersonalArticle, shouldResume = false): string {
    const matchedId = article.sourceUrl.match(/-(\d+)\.ldo(?:[?#].*)?$/)

    let articleId = 'nguon'

    if (matchedId !== null) {
        articleId = matchedId[1]
    }

    const params = new URLSearchParams({
        url: article.sourceUrl
    })
    if (shouldResume) {
        params.set('resume', '1')
    }

    return '/bai-viet/' + articleId + '?' + params.toString()
}

function getTimeLabel(timestamp: number): string {
    const date = new Date(timestamp)

    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

export default function PersonalPage() {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.auth.user)
    const [activeTab, setActiveTab] = useState<PersonalTab>('saved')

    const savedArticles = useSelector(
        (state: RootState) => state.savedArticles.items
    )

    const [historyArticles, setHistoryArticles] = useState<PersonalArticle[]>(
        () => getReadingHistory()
    )

    const [message, setMessage] = useState('')

    function handleChangeTab(nextTab: PersonalTab) {
        setActiveTab(nextTab)
        setHistoryArticles(getReadingHistory())
        setMessage('')
    }

    function handleRemoveSavedArticle(sourceUrl: string) {
        try {
            dispatch(removeSaved(sourceUrl))
            setMessage('Đã bỏ lưu bài viết thành công!')
        } catch {
            setMessage('Không thể bỏ lưu bài viết.')
        }
    }

    let visibleArticles = savedArticles

    if (activeTab === 'history') {
        visibleArticles = historyArticles
    }

    if (!user) {
        return <Navigate to="/dang-nhap" replace />
    }

    return (
        <section className="personal-page">

            <div className="personal-page-heading">
                <div>
                    <h1>Trang cá nhân</h1>

                    <p className="personal-page-greeting">
                        Xin chào, <strong>{user.name}</strong>!
                    </p>
                </div>

                <button
                    className="personal-page-logout"
                    type="button"
                    onClick={() => dispatch(logoutUser())}
                >
                    Đăng xuất
                </button>
            </div>

            <div
                className="personal-page-tabs"
                role="tablist"
                aria-label="Nội dung trang cá nhân"
            >
                <button
                    id="personal-saved-tab"
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'saved'}
                    aria-controls="personal-content"
                    className={activeTab === 'saved' ? 'is-active' : ''}
                    onClick={() => handleChangeTab('saved')}
                >
                    <Bookmark size={19} aria-hidden="true" />
                    <span>Đã lưu ({savedArticles.length})</span>
                </button>

                <button
                    id="personal-history-tab"
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'history'}
                    aria-controls="personal-content"
                    className={activeTab === 'history' ? 'is-active' : ''}
                    onClick={() => handleChangeTab('history')}
                >
                    <Clock3 size={19} aria-hidden="true" />
                    <span>Lịch sử ({historyArticles.length})</span>
                </button>
            </div>

            {message !== '' ? (
                <p
                    className="personal-page-message"
                    role="status"
                >
                    {message}
                </p>
            ) : null}

            <div
                id="personal-content"
                role="tabpanel"
                aria-labelledby={
                    activeTab === 'saved'
                        ? 'personal-saved-tab'
                        : 'personal-history-tab'
                }
            >
                <div className="personal-page-section-heading">
                    <h2>
                        {activeTab === 'saved'
                            ? 'Bài viết đã lưu'
                            : 'Lịch sử đọc bài'}
                    </h2>

                    <span>
                        {visibleArticles.length} bài viết
                    </span>
                </div>

                {visibleArticles.length === 0 ? (
                    <div className="personal-page-empty">

                        {activeTab === 'saved' ? (
                            <Bookmark
                                size={52}
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        ) : (
                            <Clock3
                                size={52}
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        )}

                        <h3>
                            {activeTab === 'saved'
                                ? 'Bạn chưa lưu bài viết nào'
                                : 'Bạn chưa có lịch sử đọc bài'}
                        </h3>

                        <p>
                            {activeTab === 'saved'
                                ? 'Hãy mở bài báo và bấm Lưu bài để xem lại sau.'
                                : 'Những bài báo bạn xem thành công sẽ được lưu tại đây.'}
                        </p>

                        <Link to="/">
                            Khám phá tin tức
                        </Link>
                    </div>
                ) : (
                    <div className="personal-page-list">
                        {visibleArticles.map((article) => {
                            const readingMark = activeTab === 'history'
                                ? getReadingMark(article.sourceUrl)
                                : null

                            return (
                            <article
                                key={article.sourceUrl}
                                className="personal-page-article"
                            >
                                <div className="personal-page-article-main">

                                    <h3>
                                        <Link to={getArticlePath(article)}>
                                            {article.title}
                                        </Link>
                                    </h3>

                                    {readingMark !== null && (
                                        <p className="personal-page-time">
                                            Đã đánh dấu chỗ đọc
                                            {' · '}
                                            <Link to={getArticlePath(article, true)}>
                                                Đọc tiếp
                                            </Link>
                                        </p>
                                    )}

                                    {article.description !== '' ? (
                                        <p className="personal-page-description">
                                            {article.description}
                                        </p>
                                    ) : null}

                                    <p className="personal-page-time">
                                        {activeTab === 'saved'
                                            ? 'Đã lưu lúc: '
                                            : 'Xem gần nhất: '}

                                        <time
                                            dateTime={
                                                new Date(article.timestamp)
                                                    .toISOString()
                                            }
                                        >
                                            {getTimeLabel(article.timestamp)}
                                        </time>
                                    </p>
                                </div>

                                {activeTab === 'saved' ? (
                                    <button
                                        type="button"
                                        className="personal-page-remove"
                                        onClick={() => {
                                            handleRemoveSavedArticle(
                                                article.sourceUrl
                                            )
                                        }}
                                    >
                                        <Trash2
                                            size={17}
                                            aria-hidden="true"
                                        />

                                        Bỏ lưu
                                    </button>
                                ) : null}
                            </article>
                            )
                        })}
                    </div>
                )}
            </div>

        </section>
    )
}
