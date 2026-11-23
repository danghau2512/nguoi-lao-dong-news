import './LoginPage.css'
import { useState, type FormEvent } from 'react'
import { login } from '../services/authService'
import { Navigate, useOutletContext } from 'react-router-dom'
import type { AuthContext } from '../layout/MainLayout'

export default function LoginPage() {

    const { user, updateUser } = useOutletContext<AuthContext>()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isLoading) return

        const formData = new FormData(event.currentTarget)
        const email = String(formData.get('email') ?? '')
        const password = String(formData.get('password') ?? '')

        setError('')
        setIsLoading(true)

        try {
            const loggedInUser = await login(email, password)
            updateUser(loggedInUser)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Đăng nhập thất bại.')
        } finally {
            setIsLoading(false)
        }
    }

    if (user) {
        return <Navigate to="/ca-nhan" replace />
    }
    return (
        <section className="login-page">
            <h1>Đăng nhập</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                />

                <label htmlFor="login-password">Mật khẩu</label>
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                />

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </button>
            </form>
        </section>
    )
}