import { configureStore } from '@reduxjs/toolkit'
import newsReducer from './newsSlice'
import authReducer from './authSlice'

export const store = configureStore({
    reducer: {
        news: newsReducer,
        auth: authReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
