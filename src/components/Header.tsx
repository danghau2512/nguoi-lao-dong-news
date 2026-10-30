import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
    return (
        <header className="news-header">
            <div className="news-header-container">
                <h1 className="news-header-title">
                    <Link to="/" className="news-header-logo">
                        NGƯỜI LAO ĐỘNG
                    </Link>
                </h1>
                <nav className="news-header-nav" aria-label="Điều hướng chính">
                    <Link to="/" className="news-header-link">
                        Trang chủ
                    </Link>
                </nav>

            </div>
        </header>
    )
}