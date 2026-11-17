
import './ArticleLoading.css'

export default function ArticleLoading() {
    return (
        <section
            className="article-loading"
            role="status"
            aria-live="polite"
        >
            <div
                className="article-loading-icon"
                aria-hidden="true"
            >
                <span className="article-loading-piece piece-one"></span>
                <span className="article-loading-piece piece-two"></span>
                <span className="article-loading-piece piece-three"></span>
                <span className="article-loading-piece piece-four"></span>
            </div>

            <p>Đang tải bài viết...</p>
        </section>
    )
}
