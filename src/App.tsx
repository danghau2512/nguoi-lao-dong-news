
import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const PersonalPage = lazy(() => import('./pages/PersonalPage'))

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route
                    path="chuyen-muc/:slug"
                    element={<CategoryPage />}
                />

                <Route
                    path="tim-kiem"
                    element={<SearchPage />}
                />

                <Route
                    path="bai-viet/:id"
                    element={<ArticlePage />}
                />

                <Route
                    path="ca-nhan"
                    element={<PersonalPage />}
                />

                <Route
                    path="*"
                    element={<h2>Không tìm thấy trang</h2>}
                />
            </Route>
        </Routes>
    )
}
