import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ArticleComment {
    id: string
    author: string
    content: string
    createdAt: string
}

interface CommentsState {
    byArticle: Partial<Record<string, ArticleComment[]>>
}

const initialState: CommentsState = {
    byArticle: {},
}

function getStorageKey(sourceUrl: string): string {
    return `goctin:comments:${sourceUrl}`
}

function readSavedComments(sourceUrl: string): ArticleComment[] {
    try {
        const saved = localStorage.getItem(getStorageKey(sourceUrl))
        if (!saved) return []

        const parsed: unknown = JSON.parse(saved)
        return Array.isArray(parsed) ? (parsed as ArticleComment[]) : []
    } catch {
        return []
    }
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        loadArticleComments(state, action: PayloadAction<string>) {
            const sourceUrl = action.payload

            if (state.byArticle[sourceUrl] === undefined) {
                state.byArticle[sourceUrl] = readSavedComments(sourceUrl)
            }
        },
        addArticleComment(
            state,
            action: PayloadAction<{ sourceUrl: string; comment: ArticleComment }>
        ) {
            const { sourceUrl, comment } = action.payload
            const currentComments =
                state.byArticle[sourceUrl] ?? readSavedComments(sourceUrl)
            const nextComments = [comment, ...currentComments]

            localStorage.setItem(
                getStorageKey(sourceUrl),
                JSON.stringify(nextComments)
            )
            state.byArticle[sourceUrl] = nextComments
        },
    },
})

export const { loadArticleComments, addArticleComment } = commentsSlice.actions
export default commentsSlice.reducer
