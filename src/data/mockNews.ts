import type { NewsArticle } from '../types/news'

export const mockNews: NewsArticle[] = [
    {
        id: 'demo-1',
        title: 'Bài viết mẫu thuộc chuyên mục Thời sự',
        description: 'Dữ liệu thử nghiệm để xây dựng giao diện.',
        sourceUrl: '',
        categorySlug: 'thoi-su',
    },
    {
        id: 'demo-2',
        title: 'Bài viết mẫu thuộc chuyên mục Giáo dục',
        description: 'Bài viết thứ hai dùng để kiểm tra danh sách tin.',
        sourceUrl: '',
        categorySlug: 'giao-duc',
    },
]