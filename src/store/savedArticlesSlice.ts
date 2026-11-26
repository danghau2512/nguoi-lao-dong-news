import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
    getSavedArticles,
    removeSavedArticle,
    toggleSavedArticle,
} from '../services/personalStorage'
import type { PersonalArticle } from '../services/personalStorage'

type SavedArticleInput = {
    sourceUrl: string
    title: string
    description: string
}

interface SavedArticlesState {
    items: PersonalArticle[]
}

const initialState: SavedArticlesState = {
    items: getSavedArticles(),
}

const savedArticlesSlice = createSlice({
    name: 'savedArticles',
    initialState,
    reducers: {
        toggleSave(state, action: PayloadAction<SavedArticleInput>) {
            toggleSavedArticle(action.payload)
            state.items = getSavedArticles()
        },
        removeSaved(state, action: PayloadAction<string>) {
            removeSavedArticle(action.payload)
            state.items = getSavedArticles()
        },
    },
})

export const { toggleSave, removeSaved } = savedArticlesSlice.actions
export default savedArticlesSlice.reducer
