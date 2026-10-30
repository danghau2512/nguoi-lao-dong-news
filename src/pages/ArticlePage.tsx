import { Link, useParams } from 'react-router-dom'

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>()

    return (
        <article>
            <h2>Chi tiết bài viết</h2>
            <p>Mã bài viết: {id}</p>
            <p>Nội dung bài báo sẽ được hiển thị tại đây.</p>

            <Link to="/">Quay lại trang chủ</Link>
        </article>
    )
}