import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <section>
            <h2>Tin mới nhất</h2>
            <p>Danh sách tin tức sẽ được hiển thị tại đây.</p>

            <Link to="/bai-viet/demo">
                Mở bài viết
            </Link>
        </section>
    )
}