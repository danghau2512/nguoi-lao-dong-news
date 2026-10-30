import { Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

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