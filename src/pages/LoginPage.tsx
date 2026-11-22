import './LoginPage.css'
import { useState, type FormEvent } from 'react'
import { login } from '../services/authService'

export default function LoginPage() {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isLoading) return

        const formData = new FormData(event.currentTarget)
        const email = String(formData.get('email') ?? '')
        const password = String(formData.get('password') ?? '')

        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const loggedInUser = await login(email, password)
            setSuccess(`Đăng nhập thành công. Xin chào, ${loggedInUser.name}!`)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Đăng nhập thất bại.')
        } finally {
            setIsLoading(false)
        }
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
                {success && <p role="status">{success}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </button>
            </form>
        </section>
    )
}