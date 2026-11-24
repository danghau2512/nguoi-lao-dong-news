export type AuthUser = {
    id: number
    name: string
    email: string
}

export async function login(email: string, password: string): Promise<AuthUser> {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Không nhận được phản hồi từ API đăng nhập.')
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message ?? 'Đăng nhập thất bại.')
    }

    return data
}