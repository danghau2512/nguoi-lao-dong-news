import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function MainLayout() {
    return (
        <div className="app-layout">
            <Header />

            <main className="container page-content">
                <Outlet />
            </main>

            <footer className="site-footer">
                <p>Lập trình Frontend </p>
            </footer>
        </div>
    )
}