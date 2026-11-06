import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNewsByCategory } from '../store/newsSlice'
import type { AppDispatch, RootState } from '../store/store'
import type { NewsArticle } from '../types/news'

const emptyArticles: NewsArticle[] = []

export function useCategoryNews(categorySlug: string) {
    const dispatch = useDispatch<AppDispatch>()
    const category = useSelector(
        (state: RootState) => state.news.byCategory[categorySlug],
    )

    const status = category?.status ?? 'idle'

    useEffect(() => {
        if (status === 'idle') {
            void dispatch(fetchNewsByCategory(categorySlug))
        }
    }, [categorySlug, dispatch, status])

    function retry() {
        void dispatch(fetchNewsByCategory(categorySlug))
    }

    return {articles: category?.articles ?? emptyArticles, status, error: category?.error ?? null, retry,}
}