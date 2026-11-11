
import './NewsStatus.css'

type NewsStatusProps = {
    type: 'loading' | 'error' | 'empty'
    title?: string
    message?: string
}

export default function NewsStatus(props: NewsStatusProps) {

    if (props.type === 'loading') {
        return (
            <div className="news-status" role="status">
                <span
                    className="news-status-spinner"
                    aria-hidden="true"
                ></span>

                <p>Đang tải tin tức...</p>
            </div>
        )
    }

    if (props.type === 'error') {
        let errorMessage = 'Đã xảy ra lỗi khi tải dữ liệu.'

        if (
            props.message !== undefined &&
            props.message.trim() !== ''
        ) {
            errorMessage = props.message
        }

        return (
            <div className="news-status" role="alert">
                <i
                    className="fa-solid fa-circle-exclamation news-status-error-icon"
                    aria-hidden="true"
                ></i>

                <h3>Không thể tải tin tức</h3>

                <p>{errorMessage}</p>
            </div>
        )
    }

    let emptyTitle = 'Chưa có bài viết'
    let emptyMessage = 'Hiện tại chưa có tin tức để hiển thị.'

    if (
        props.title !== undefined &&
        props.title.trim() !== ''
    ) {
        emptyTitle = props.title
    }

    if (
        props.message !== undefined &&
        props.message.trim() !== ''
    ) {
        emptyMessage = props.message
    }

    return (
        <div className="news-status" role="status">
            <i
                className="fa-regular fa-folder-open news-status-empty-icon"
                aria-hidden="true"
            ></i>

            <h3>{emptyTitle}</h3>

            <p>{emptyMessage}</p>
        </div>
    )
}
