import { useState, type FormEvent } from 'react'
import {MessageCircle} from "lucide-react";
import './ArticleComments.css'
type Comment = {
    id: string
    author: string
    content: string
    createdAt: string
}

export default function ArticleComments({ sourceUrl }: { sourceUrl: string }) {
    const storageKey = `goctin:comments:${sourceUrl}`

    const [comments, setComments] = useState<Comment[]>(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const text = content.trim()
        if (!text) {
            setError('Bạn hãy nhập nội dung bình luận.')
            return
        }

        const comment: Comment = {
            id: crypto.randomUUID(),
            author: author.trim() || 'Khách',
            content: text,
            createdAt: new Date().toISOString(),
        }

        const nextComments = [comment, ...comments]

        try {
            localStorage.setItem(storageKey, JSON.stringify(nextComments))
        } catch {
            setError('Không lưu được bình luận trên trình duyệt này.')
            return
        }

        setComments(nextComments)
        setContent('')
        setError('')
    }

    return (
        <section className="article-comments" aria-labelledby="article-comments-title">
            <h2 id="article-comments-title" className="article-comments__title">
                <MessageCircle size={23} aria-hidden="true" />
                Bình luận ({comments.length})
            </h2>

            <form className="article-comments__form" onSubmit={handleSubmit}>
                <div className="article-comments__field article-comments__name">
                    <label htmlFor="comment-author">Tên hiển thị (tùy chọn)</label>
                    <input
                        id="comment-author"
                        value={author}
                        placeholder="Ví dụ Nguyễn Văn A"
                        maxLength={50}
                        onChange={(event) => setAuthor(event.target.value)}
                    />
                </div>

                <div className="article-comments__field">
                    <label htmlFor="article-comment-content">Nội dung bình luận</label>
                    <textarea
                        id="article-comment-content"
                        value={content}
                        placeholder="Viết bình luận của bạn..."
                        rows={4}
                        maxLength={500}
                        required
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>

                {error && <p className="article-comments__error" role="alert">{error}</p>}

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
                            {comment.author.charAt(0).toUpperCase()}
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