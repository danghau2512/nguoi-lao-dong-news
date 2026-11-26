import { useEffect, useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import {
    addArticleComment,
    loadArticleComments,
    type ArticleComment,
} from '../store/commentsSlice'
import type { AppDispatch, RootState } from '../store/store'
import './ArticleComments.css'

const emptyComments: ArticleComment[] = []

function getCommentAvatar(name: string): string {
    if (name === 'Ẩn danh') {
        return '?'
    }

    const parts = name.trim().split(/\s+/).filter(Boolean)
    const lastWord = parts[parts.length - 1] ?? ''
    return lastWord.charAt(0).toUpperCase() || 'U'
}

export default function ArticleComments({ sourceUrl }: { sourceUrl: string }) {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.auth.user)
    const comments = useSelector(
        (state: RootState) => state.comments.byArticle[sourceUrl] ?? emptyComments
    )

    const [isAnonymous, setIsAnonymous] = useState(false)
    const [content, setContent] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        dispatch(loadArticleComments(sourceUrl))
    }, [dispatch, sourceUrl])

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const text = content.trim()

        if (text === '') {
            setError('Bạn hãy nhập nội dung bình luận.')
            return
        }

        if (text.length < 3) {
            setError('Nội dung bình luận phải có ít nhất 3 ký tự.')
            return
        }

        if (text.length > 500) {
            setError('Nội dung bình luận không được vượt quá 500 ký tự.')
            return
        }

        const displayAuthor =
            user !== null && isAnonymous === false
                ? user.name
                : 'Ẩn danh'

        const comment: ArticleComment = {
            id: crypto.randomUUID(),
            author: displayAuthor,
            content: text,
            createdAt: new Date().toISOString(),
        }

        try {
            dispatch(
                addArticleComment({
                    sourceUrl,
                    comment,
                })
            )
        } catch {
            setError('Không lưu được bình luận trên trình duyệt này.')
            return
        }

        setContent('')
        setError('')
    }

    return (
        <section className="article-comments" aria-labelledby="article-comments-title">
            <h2 id="article-comments-title" className="article-comments__title">
                <MessageCircle size={23} aria-hidden="true" />
                Bình luận ({comments.length})
            </h2>

            <form className="article-comments__form" onSubmit={handleSubmit} noValidate>
                {user === null ? (
                    <div className="article-comments__identity">
                        <span>
                            Chế độ bình luận: <strong>Ẩn danh</strong>
                        </span>

                        <Link to="/dang-nhap">
                            Đăng nhập để hiển thị tên
                        </Link>
                    </div>
                ) : (
                    <div className="article-comments__identity">
                        <span>
                            Bình luận với tư cách:{' '}
                            <strong>{isAnonymous ? 'Ẩn danh' : user.name}</strong>
                        </span>

                        <div className="article-comments__toggle-wrap">
                            <span id="anonymous-switch-label">Ẩn danh</span>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={isAnonymous}
                                aria-labelledby="anonymous-switch-label"
                                className={
                                    isAnonymous
                                        ? 'article-comments__switch is-active'
                                        : 'article-comments__switch'
                                }
                                onClick={() => setIsAnonymous((prev) => !prev)}
                            >
                                <span className="article-comments__switch-thumb" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="article-comments__field">
                    <label htmlFor="article-comment-content">Nội dung bình luận</label>
                    <textarea
                        id="article-comment-content"
                        value={content}
                        placeholder="Viết bình luận của bạn..."
                        rows={4}
                        maxLength={500}
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>

                {error !== '' && <p className="article-comments__error" role="alert">{error}</p>}

                <div className="article-comments__actions">
                    <button type="submit">Gửi bình luận</button>
                </div>
            </form>

            {comments.length === 0 ? (
                <p className="article-comments__empty">Chưa có bình luận.</p>
            ) : (
                <ul className="article-comments__list">
                    {comments.map((comment) => (
                        <li key={comment.id} className="article-comments__item">
                            <span className="article-comments__avatar" aria-hidden="true">
                                {getCommentAvatar(comment.author)}
                            </span>

                            <div className="article-comments__body">
                                <div className="article-comments__meta">
                                    <strong>{comment.author}</strong>
                                    <time dateTime={comment.createdAt}>
                                        {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })}
                                    </time>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
