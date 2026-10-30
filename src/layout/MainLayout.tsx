import { Link, Outlet } from 'react-router-dom'

export default function MainLayout() {
    return (
        <div className="app-layout">
            <header className="site-header">
                <div className="container">
                    <h1>NGƯỜI LAO ĐỘNG</h1>

                    <nav>
                        <Link to="/">Trang chủ</Link>
                    </nav>
                </div>
            </header>

            <main className="container page-content">
                <Outlet />
            </main>

            <footer className="site-footer">
                <p>Lập trình Frontend </p>
            </footer>
        </div>
    )
}