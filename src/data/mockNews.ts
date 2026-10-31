import type { NewsArticle } from '../types/news'

export const mockNews: NewsArticle[] = [
    {
        id: 'demo-1',
        title: 'Tạo thêm không gian xanh trong khu dân cư',
        description: 'Những mảng xanh được chăm sóc thường xuyên góp phần cải thiện cảnh quan và không gian sinh hoạt chung..',
        sourceUrl: '',
        categorySlug: 'thoi-su',
    },
    {
        id: 'demo-2',
        title: 'Rèn thói quen tự học từ những mục tiêu nhỏ',
        description: 'Chia nhỏ nội dung, duy trì ôn tập và chủ động trao đổi giúp sinh viên xây dựng thói quen tự học.',
        sourceUrl: '',
        categorySlug: 'giao-duc',
    },
]