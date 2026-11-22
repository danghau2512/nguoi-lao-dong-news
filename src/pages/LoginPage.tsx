import './LoginPage.css'

export default function LoginPage() {
    return (
        <section className="login-page">
            <h1>Đăng nhập</h1>

            <form onSubmit={(event) => event.preventDefault()}>
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

                <button type="submit">Đăng nhập</button>
            </form>
        </section>
    )
}