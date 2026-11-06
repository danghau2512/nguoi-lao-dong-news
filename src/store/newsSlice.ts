import { createSlice } from '@reduxjs/toolkit'
import type { NewsArticle } from '../types/news'

interface CategoryNews {
    articles: NewsArticle[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

interface NewsState {
    byCategory: Partial<Record<string, CategoryNews>>
}

const initialState: NewsState = {
    byCategory: {},
}

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
})

export default newsSlice.reducer