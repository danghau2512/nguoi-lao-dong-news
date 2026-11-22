
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Leaf, Mic, MicOff, Moon, Sun, UserRound } from 'lucide-react'
import { categories } from '../constants/categories'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import { transcribeWithViettel } from '../services/viettelSttService'
import './Header.css'
import './HeaderProfile.css'

const languages = [
    {
        name: 'English',
        flag: 'gb',
        url: 'https://news.laodong.vn/'
    },
    {
        name: 'Korean',
        flag: 'kr',
        url: 'https://ko.laodong.vn/'
    },
    {
        name: 'French',
        flag: 'fr',
        url: 'https://fr.laodong.vn/'
    },
    {
        name: 'Spanish',
        flag: 'es',
        url: 'https://es.laodong.vn/'
    },
    {
        name: 'Japanese',
        flag: 'jp',
        url: 'https://ja.laodong.vn/'
    },
    {
        name: 'Chinese',
        flag: 'cn',
        url: 'https://zh.laodong.vn/'
    }
]

type Theme = 'light' | 'dark' | 'sepia'

function getSavedTheme(): Theme {
    const savedTheme = localStorage.getItem('goc-tin-theme')

    if (savedTheme === 'dark' || savedTheme === 'sepia') {
        return savedTheme
    }

    return 'light'
}

export default function Header() {
    const [searchKeyword, setSearchKeyword] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    const {
        isRecording,
        startRecording,
        stopRecording
    } = useVoiceRecorder()

    const [isVoiceLoading, setIsVoiceLoading] = useState(false)
    const [voiceMessage, setVoiceMessage] = useState('')
    const [voiceHasError, setVoiceHasError] = useState(false)

    const [theme, setTheme] = useState<Theme>(getSavedTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem('goc-tin-theme', theme)
    }, [theme])

    const mainCategories = categories.slice(0, 7)

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const keyword = searchKeyword.trim()

        if (keyword !== '') {
            navigate('/tim-kiem?q=' + encodeURIComponent(keyword))
            setSearchKeyword('')
            setIsMenuOpen(false)
        }
    }

    async function handleVoiceSearch() {
        if (isVoiceLoading) {
            return
        }

        setVoiceMessage('')
        setVoiceHasError(false)

        if (!isRecording) {
            try {
                await startRecording()

                setVoiceMessage(
                    'Đang ghi âm. Nhấn micro lần nữa để tìm kiếm.'
                )
            } catch (error) {
                setVoiceHasError(true)

                if (
                    error instanceof DOMException &&
                    error.name === 'NotAllowedError'
                ) {
                    setVoiceMessage(
                        'Bạn chưa cấp quyền sử dụng micro.'
                    )
                } else {
                    setVoiceMessage(
                        error instanceof Error
                            ? error.message
                            : 'Không thể bật micro.'
                    )
                }
            }

            return
        }

        setIsVoiceLoading(true)
        setVoiceMessage(
            'Đang nhận dạng giọng nói bằng Viettel AI...'
        )

        try {
            const audio = await stopRecording()

            const keyword = await transcribeWithViettel(audio)

            if (keyword !== '') {
                setSearchKeyword('')
                setIsMenuOpen(false)
                setVoiceMessage('')

                navigate(
                    '/tim-kiem?q=' + encodeURIComponent(keyword)
                )
            }
        } catch (error) {
            setVoiceHasError(true)

            setVoiceMessage(
                error instanceof Error
                    ? error.message
                    : 'Không thể nhận dạng giọng nói.'
            )
        } finally {
            setIsVoiceLoading(false)
        }
    }

    return (
        <>
            <header className="news-header">
                <div className="news-header-topline">
                    <div className="news-header-container news-header-topline-inner">
                        <span className="news-header-topline-title">
                            Tin tức Việt Nam và thế giới
                        </span>

                        <div
                            className="news-header-languages"
                            aria-label="Các phiên bản ngôn ngữ của báo nguồn"
                        >
                            <span className="news-header-language-heading">
                                Ngôn ngữ:
                            </span>

                            <Link
                                to="/"
                                className="news-header-language-link is-current"
                                aria-label="Tiếng Việt - Trang chủ"
                            >
                                <span
                                    className="fi fi-vn"
                                    aria-hidden="true"
                                ></span>

                                <span>Tiếng Việt</span>
                            </Link>

                            {languages.map((language) => (
                                <a
                                    key={language.name}
                                    href={language.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-header-language-link"
                                    title={
                                        'Mở phiên bản ' +
                                        language.name +
                                        ' của Báo Lao Động'
                                    }
                                    aria-label={
                                        'Mở phiên bản ' +
                                        language.name +
                                        ' của Báo Lao Động'
                                    }
                                >
                                    <span
                                        className={'fi fi-' + language.flag}
                                        aria-hidden="true"
                                    ></span>

                                    <span>{language.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="news-header-main">
                    <div className="news-header-container news-header-main-inner">
                        <Link
                            to="/"
                            className="news-header-brand"
                            aria-label="Góc Tin - Trang chủ"
                        >
                            <span className="news-header-brand-icon">
                                <i
                                    className="fa-regular fa-newspaper"
                                    aria-hidden="true"
                                ></i>
                            </span>

                            <span className="news-header-brand-text">
                                <strong>GÓC TIN</strong>
                                <small>Tin tức mỗi ngày</small>
                            </span>
                        </Link>

                        <div className="news-header-controls">
                            <form
                                className="news-header-search"
                                onSubmit={handleSearch}
                                role="search"
                            >
                                <label
                                    htmlFor="news-header-search-input"
                                    className="news-header-visually-hidden"
                                >
                                    Tìm kiếm bài viết
                                </label>

                                <i
                                    className="fa-solid fa-magnifying-glass"
                                    aria-hidden="true"
                                ></i>

                                <input
                                    id="news-header-search-input"
                                    type="search"
                                    placeholder={
                                        isRecording
                                            ? 'Đang ghi âm...'
                                            : isVoiceLoading
                                                ? 'Đang xử lý giọng nói...'
                                                : 'Tìm kiếm tin tức...'
                                    }
                                    value={searchKeyword}
                                    onChange={(event) => {
                                        setSearchKeyword(event.target.value)
                                    }}
                                />

                                <button
                                    type="button"
                                    className={
                                        isRecording
                                            ? 'news-header-voice-button is-recording'
                                            : 'news-header-voice-button'
                                    }
                                    title={
                                        isRecording
                                            ? 'Dừng ghi âm và tìm kiếm'
                                            : 'Tìm kiếm bằng giọng nói'
                                    }
                                    aria-label={
                                        isRecording
                                            ? 'Dừng ghi âm và tìm kiếm'
                                            : 'Tìm kiếm bằng giọng nói'
                                    }
                                    aria-pressed={isRecording}
                                    disabled={isVoiceLoading}
                                    onClick={() => {
                                        void handleVoiceSearch()
                                    }}
                                >
                                    {isRecording ? (
                                        <MicOff
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Mic
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>

                                <button
                                    type="submit"
                                    aria-label="Tìm kiếm"
                                >
                                    <span>Tìm kiếm</span>

                                    <i
                                        className="fa-solid fa-magnifying-glass"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </form>

                            {voiceMessage !== '' ? (
                                <p
                                    className={
                                        voiceHasError
                                            ? 'news-header-voice-message is-error'
                                            : 'news-header-voice-message'
                                    }
                                    role={voiceHasError ? 'alert' : 'status'}
                                >
                                    {voiceMessage}
                                </p>
                            ) : null}

                            <NavLink
                                to="/ca-nhan"
                                className="news-header-profile-link"
                                aria-label="Trang cá nhân"
                                title="Bài viết đã lưu và lịch sử đọc"
                                onClick={() => {
                                    setIsMenuOpen(false)
                                }}
                            >
                                <UserRound
                                    size={22}
                                    aria-hidden="true"
                                />
                            </NavLink>
                        </div>

                        <div
                            className="news-header-theme"
                            role="group"
                            aria-label="Chế độ giao diện"
                        >
                            <button
                                type="button"
                                title="Sáng"
                                aria-label="Chế độ sáng"
                                aria-pressed={theme === 'light'}
                                onClick={() => setTheme('light')}
                            >
                                <Sun size={18} aria-hidden="true" />
                            </button>

                            <button
                                type="button"
                                title="Tối"
                                aria-label="Chế độ tối"
                                aria-pressed={theme === 'dark'}
                                onClick={() => setTheme('dark')}
                            >
                                <Moon size={18} aria-hidden="true" />
                            </button>

                            <button
                                type="button"
                                title="Dịu mắt"
                                aria-label="Chế độ dịu mắt"
                                aria-pressed={theme === 'sepia'}
                                onClick={() => setTheme('sepia')}
                            >
                                <Leaf size={18} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="news-header-navigation news-header">
                <nav
                    className="news-header-container news-header-nav"
                    aria-label="Điều hướng chính"
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            setIsMenuOpen(false)
                        }
                    }}
                >
                    <Link
                        to="/"
                        className="news-header-home"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <i
                            className="fa-solid fa-house"
                            aria-hidden="true"
                        ></i>

                        <span>Trang chủ</span>
                    </Link>

                    <div className="news-header-desktop-categories">
                        {mainCategories.map((category) => (
                            <NavLink
                                key={category.slug}
                                to={'/chuyen-muc/' + category.slug}
                                className="news-header-category-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.name}
                            </NavLink>
                        ))}
                    </div>

                    <div
                        className={
                            isMenuOpen
                                ? 'news-header-more is-open'
                                : 'news-header-more'
                        }
                    >
                        <button
                            type="button"
                            className="news-header-more-button"
                            aria-controls="news-header-all-categories"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span>Tất cả chuyên mục</span>

                            <i
                                className="fa-solid fa-chevron-down"
                                aria-hidden="true"
                            ></i>
                        </button>

                        <div
                            id="news-header-all-categories"
                            className="news-header-all-categories"
                        >
                            {categories.map((category) => (
                                <NavLink
                                    key={category.slug}
                                    to={'/chuyen-muc/' + category.slug}
                                    className="news-header-all-category-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {category.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}
