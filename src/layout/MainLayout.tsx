
import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RouteLoading from '../components/RouteLoading'
import type { RootState } from '../store/store'

export default function MainLayout() {
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <div className="app-layout">
            <Header isLoggedIn={user !== null} />

            <main className="container page-content">
                <Suspense fallback={<RouteLoading />}>
                    <Outlet />
                </Suspense>
            </main>

            <Footer />
        </div>
    )
}
