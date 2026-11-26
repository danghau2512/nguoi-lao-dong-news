import { configureStore } from '@reduxjs/toolkit'
import newsReducer from './newsSlice'
import authReducer from './authSlice'
import savedArticlesReducer from './savedArticlesSlice'

export const store = configureStore({
    reducer: {
        news: newsReducer,
        auth: authReducer,
        savedArticles: savedArticlesReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
