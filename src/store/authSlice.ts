import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../services/authService'

const authKey = 'goc-tin-demo-user'

function readSavedUser(): AuthUser | null {
    try {
        const savedUser = localStorage.getItem(authKey)
        return savedUser ? JSON.parse(savedUser) : null
    } catch {
        return null
    }
}

interface AuthState {
    user: AuthUser | null
}

const initialState: AuthState = {
    user: readSavedUser(),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload
            localStorage.setItem(authKey, JSON.stringify(action.payload))
        },
        logoutUser(state) {
            state.user = null
            localStorage.removeItem(authKey)
        },
    },
})

export const { setUser, logoutUser } = authSlice.actions
export default authSlice.reducer
