import { useState, type FormEvent } from 'react'

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
        <section className="article-comments">
            <h2>Bình luận ({comments.length})</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="comment-author">Tên hiển thị (tùy chọn)</label>
                    <input
                        id="comment-author"
                        value={author}
                        maxLength={50}
                        onChange={(event) => setAuthor(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="article-comment-content">Nội dung bình luận</label>
                    <textarea
                        id="article-comment-content"
                        value={content}
                        rows={4}
                        maxLength={500}
                        required
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>

                {error && <p role="alert">{error}</p>}
                <button type="submit">Gửi bình luận</button>
            </form>

            {comments.length === 0 && <p>Chưa có bình luận.</p>}

            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <strong>{comment.author}</strong>
                        {' · '}
                        <time dateTime={comment.createdAt}>
                            {new Date(comment.createdAt).toLocaleString('vi-VN')}
                        </time>
                        <p>{comment.content}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}