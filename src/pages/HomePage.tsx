import { Link } from 'react-router-dom'
import { mockNews } from '../data/mockNews'
export default function HomePage() {
    return (
        <section>
            <h2>Tin mới nhất</h2>
            <p>Danh sách tin tức sẽ được hiển thị tại đây.</p>

            {mockNews.map((article) => (
                <article key={article.id}>
                    <h3>
                        <Link to={`/bai-viet/${article.id}`}>
                            {article.title}
                        </Link>
                    </h3>

                    <p>{article.description}</p>
                </article>
            ))}
        </section>
    )
}