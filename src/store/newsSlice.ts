import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import type { NewsArticle } from '../types/news'
import {getNewsByCategory} from "../services/rssService.ts";

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
export const fetchNewsByCategory = createAsyncThunk<
    NewsArticle[],
    string,
    { state: { news: NewsState } }>(
    'news/fetchByCategory',
    (categorySlug) => getNewsByCategory(categorySlug),
    {
        condition(categorySlug, { getState }) {
            const category = getState().news.byCategory[categorySlug]
            return category?.status !== 'loading'
        },
    },
)

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchNewsByCategory.pending, (state, action) => {
                const slug = action.meta.arg

                state.byCategory[slug] = {
                    articles: state.byCategory[slug]?.articles ?? [],
                    status: 'loading',
                    error: null,
                }
            })
            .addCase(fetchNewsByCategory.fulfilled, (state, action) => {
                const slug = action.meta.arg

                state.byCategory[slug] = {
                    articles: action.payload,
                    status: 'succeeded',
                    error: null,
                }
            })
            .addCase(fetchNewsByCategory.rejected, (state, action) => {
                const slug = action.meta.arg

                state.byCategory[slug] = {
                    articles: state.byCategory[slug]?.articles ?? [],
                    status: 'failed',
                    error: action.error.message ?? 'Không tải được tin tức',
                }
            })
    },
})

export default newsSlice.reducer