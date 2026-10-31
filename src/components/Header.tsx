
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { categories } from '../constants/categories'
import './Header.css'

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

export default function Header() {
    const [searchKeyword, setSearchKeyword] = useState('')
    const navigate = useNavigate()

    const mainCategories = categories.slice(0, 7)

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const keyword = searchKeyword.trim()

        if (keyword !== '') {
            navigate('/tim-kiem?q=' + encodeURIComponent(keyword))
            setSearchKeyword('')
        }
    }

    return (
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
                                title={'Mở phiên bản ' + language.name + ' của Báo Lao Động'}
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
                            placeholder="Tìm kiếm tin tức..."
                            value={searchKeyword}
                            onChange={(event) => {
                                setSearchKeyword(event.target.value)
                            }}
                        />

                        <button type="submit">
                            Tìm kiếm
                        </button>
                    </form>

                </div>
            </div>

            <div className="news-header-navigation">
                <nav
                    className="news-header-container news-header-nav"
                    aria-label="Điều hướng chính"
                >
                    <Link
                        to="/"
                        className="news-header-home"
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
                            >
                                {category.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="news-header-more">
                        <button
                            type="button"
                            className="news-header-more-button"
                            aria-controls="news-header-all-categories"
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
                                >
                                    {category.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                </nav>
            </div>

        </header>
    )
}
