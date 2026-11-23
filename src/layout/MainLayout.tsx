
import { Suspense, useState } from 'react'
import type { AuthUser } from '../services/authService'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RouteLoading from '../components/RouteLoading'

export type AuthContext = {
    user: AuthUser | null
    updateUser: (nextUser: AuthUser | null) => void
}

const authKey = 'goc-tin-demo-user'

function readUser(): AuthUser | null {
    try {
        const savedUser = localStorage.getItem(authKey)
        return savedUser ? JSON.parse(savedUser) : null
    } catch {
        return null
    }
}

export default function MainLayout() {
    const [user, setUser] = useState<AuthUser | null>(readUser)

    function updateUser(nextUser: AuthUser | null) {
        if (nextUser) {
            localStorage.setItem(authKey, JSON.stringify(nextUser))
        } else {
            localStorage.removeItem(authKey)
        }

        setUser(nextUser)
    }

    return (
        <div className="app-layout">
            <Header isLoggedIn={user !== null}/>

            <main className="container page-content">
                <Suspense fallback={<RouteLoading />}>
                    <Outlet context={{ user, updateUser }}  />
                </Suspense>
            </main>

            <Footer />
        </div>
    )
}
