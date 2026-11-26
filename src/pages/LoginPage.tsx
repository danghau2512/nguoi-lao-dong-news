import './LoginPage.css'
import { useEffect, useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { setUser } from '../store/authSlice'
import type { AppDispatch, RootState } from '../store/store'

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>()
    const user = useSelector((state: RootState) => state.auth.user)
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user !== null) {
            navigate('/ca-nhan', { replace: true })
        }
    }, [user, navigate])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (isLoading) return

        const trimmedEmail = email.trim()

        if (trimmedEmail === '') {
            setError('Vui lòng nhập email.')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Email không đúng định dạng.')
            return
        }

        if (password === '') {
            setError('Vui lòng nhập mật khẩu.')
            return
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            const loggedInUser = await login(trimmedEmail, password)
            dispatch(setUser(loggedInUser))
            navigate('/ca-nhan')
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : 'Đăng nhập thất bại.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="login-page">
            <h1>Đăng nhập</h1>

            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <label htmlFor="login-password">Mật khẩu</label>
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                {error !== '' && <p role="alert">{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </button>
            </form>
        </section>
    )
}
