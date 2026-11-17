
import './RouteLoading.css'

export default function RouteLoading() {
    return (
        <div className="route-loading" role="status">
            <div
                className="route-loading-spinner"
                aria-hidden="true"
            ></div>

            <h2>Đang mở trang...</h2>

            <p>
                Hệ thống đang chuẩn bị giao diện.
            </p>
        </div>
    )
}
