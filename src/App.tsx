
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import { mockNews } from './data/mockNews'

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
                    element={<SearchPage articles={mockNews} />}
                />
                <Route
                    path="bai-viet/:id"
                    element={<ArticlePage />}
                />

                <Route
                    path="*"
                    element={<h2>Không tìm thấy trang</h2>}
                />

            </Route>
        </Routes>
    )
}
