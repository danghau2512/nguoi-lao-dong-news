import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RouteLoading from '../components/RouteLoading'

export default function MainLayout() {
    return (
        <div className="app-layout">
            <Header />

            <main className="container page-content">
                <Suspense fallback={<RouteLoading />}>
                    <Outlet />
                </Suspense>
            </main>

            <Footer />
        </div>
    )
}
