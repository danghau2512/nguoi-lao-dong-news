import {
    Bookmark, CalendarDays, Clock, MessageCircle,
    Printer, Settings, User, Volume2,
} from 'lucide-react'
import './ArticleToolbar.css'

type ArticleToolbarProps = {
    author?: string
    publishedAt?: string
    readingMinutes?: number
    isSaved?: boolean
    onListen?: () => void
    onAudioSettings?: () => void
    onToggleSave?: () => void
    onFeedback?: () => void
    onPrint?: () => void
    onFontSizeChange?: (size: number) => void
}

const fontSizes = [
    { label: 'A−', size: 16 },
    { label: 'A', size: 18 },
    { label: 'A+', size: 20 },
    { label: 'A++', size: 22 },
]

export default function ArticleToolbar({author, publishedAt, readingMinutes, isSaved = false, onListen, onAudioSettings,
                                           onToggleSave, onFeedback, onPrint, onFontSizeChange,}: ArticleToolbarProps) {
    const publishedLabel = publishedAt
        ? new Date(publishedAt).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
        })
        : ''

    return (
        <div className="article-toolbar">
            <div className="article-toolbar__meta">
                {author && <span><User size={16} aria-hidden="true" /> <strong>{author}</strong></span>}
                {publishedAt && (
                    <span>
                        <CalendarDays size={16} aria-hidden="true" />
                        <time dateTime={publishedAt}>{publishedLabel}</time>
                    </span>
                )}
                {readingMinutes !== undefined && (
                    <span><Clock size={16} aria-hidden="true" /> {readingMinutes} phút đọc</span>
                )}
            </div>

            <div className="article-toolbar__actions" role="group" aria-label="Công cụ bài viết">
                <button type="button" onClick={onListen} disabled={!onListen}>
                    <Volume2 size={18} aria-hidden="true" /> Đọc bài
                </button>
                <button
                    type="button"
                    aria-label="Cài đặt giọng đọc"
                    onClick={onAudioSettings}
                    disabled={!onAudioSettings}
                >
                    <Settings size={18} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={onToggleSave}
                    disabled={!onToggleSave}
                    aria-pressed={isSaved}
                >
                    <Bookmark size={18} aria-hidden="true" /> {isSaved ? 'Đã lưu' : 'Lưu bài'}
                </button>
                <button type="button" onClick={onFeedback} disabled={!onFeedback}>
                    <MessageCircle size={18} aria-hidden="true" /> Bình luận
                </button>
                <button type="button" onClick={onPrint} disabled={!onPrint}>
                    <Printer size={18} aria-hidden="true" /> In bài
                </button>

                <div className="article-toolbar__sizes" role="group" aria-label="Cỡ chữ bài viết">
                    {fontSizes.map(({ label, size }) => (
                        <button
                            key={size}
                            type="button"
                            aria-label={`Cỡ chữ ${size} pixel`}
                            onClick={() => onFontSizeChange?.(size)}
                            disabled={!onFontSizeChange}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}