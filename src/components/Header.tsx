
import { useState } from 'react'
import { Link } from 'react-router-dom'

import logoLaoDong from '../assets/logo/ldo_red.png'
import logoTV from '../assets/logo/laodongtv.png'
import logoDuLich from '../assets/logo/dulich.png'
import logoCongDoan from '../assets/logo/congdoan.png'
import logoDanTocTonGiao from '../assets/logo/dantoc-tongiao.png'
import logoLaoDongTre from '../assets/logo/laodongtre.png'
import logoCongDoanVN from '../assets/logo/congdoanvn.png'

import './Header.css'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    function toggleMenu() {
        if (menuOpen === true) {
            setMenuOpen(false)
        } else {
            setMenuOpen(true)
        }
    }

    return (
        <header className="news-header">
            <div className="news-header-top">
                <div className="news-header-container news-header-top-inner">
                    <Link
                        to="/"
                        className="news-header-logo"
                        aria-label="Trang chủ Báo Lao Động"
                    >
                        <img src={logoLaoDong} alt="Báo Lao Động" />
                    </Link>

                    <div className="news-header-top-right">
                        <div
                            className="news-header-languages"
                            aria-label="Các phiên bản ngôn ngữ"
                        >
                            <a href="https://news.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-gb" aria-hidden="true"></span>
                                <span>English</span>
                            </a>

                            <span className="news-header-separator">-</span>

                            <a href="https://ko.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-kr" aria-hidden="true"></span>
                                <span>Korean</span>
                            </a>

                            <span className="news-header-separator">-</span>

                            <a href="https://fr.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-fr" aria-hidden="true"></span>
                                <span>French</span>
                            </a>

                            <span className="news-header-separator">-</span>

                            <a href="https://es.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-es" aria-hidden="true"></span>
                                <span>Spanish</span>
                            </a>

                            <span className="news-header-separator">-</span>

                            <a href="https://ja.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-jp" aria-hidden="true"></span>
                                <span>Japanese</span>
                            </a>

                            <span className="news-header-separator">-</span>

                            <a href="https://ja.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-ru" aria-hidden="true"></span>
                                <span>Russian</span>
                            </a>

                            <span className="news-header-separator">-</span>

                            <a href="https://zh.laodong.vn/" target="_blank" rel="noopener noreferrer" className="news-header-language-link">
                                <span className="fi fi-cn" aria-hidden="true"></span>
                                <span>Chinese</span>
                            </a>
                        </div>

                        <div
                            className="news-header-channels"
                            aria-label="Các chuyên trang và đơn vị liên kết"
                        >
                            <a
                                href="https://laodong.vn/video/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-header-channel-link news-header-tv"
                                title="Lao Động TV"
                            >
                                <img src={logoTV} alt="Lao Động TV" />
                            </a>

                            <a
                                href="https://dulich.laodong.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-header-channel-link news-header-travel"
                                title="Du lịch"
                            >
                                <img src={logoDuLich} alt="Du lịch" />
                            </a>

                            <a
                                href="https://laodong.vn/cong-doan/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-header-channel-link news-header-union"
                                title="Công đoàn"
                            >
                                <img src={logoCongDoan} alt="Công đoàn" />
                            </a>

                            <a
                                href="https://laodong.vn/dttg/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-header-channel-link news-header-religion"
                                title="Dân tộc - Tôn giáo"
                            >
                                <img src={logoDanTocTonGiao} alt="Dân tộc - Tôn giáo" />
                            </a>

                            <a
                                href="https://laodongtre.laodong.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-header-channel-link news-header-young"
                                title="Lao Động Trẻ"
                            >
                                <img src={logoLaoDongTre} alt="Lao Động Trẻ" />
                            </a>

                            <a
                                href="https://congdoanvietnam.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-header-channel-link news-header-vietnam-union"
                                title="Công đoàn Việt Nam"
                            >
                                <img src={logoCongDoanVN} alt="Công đoàn Việt Nam" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="news-header-bottom">
                <nav
                    className="news-header-container news-header-nav"
                    aria-label="Điều hướng chính"
                >
                    <Link
                        to="/"
                        className="news-header-home"
                        aria-label="Trang chủ"
                        title="Trang chủ"
                    >
                        <i className="fa fa-home" aria-hidden="true"></i>
                    </Link>

                    <button
                        type="button"
                        className="news-header-menu-button"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-controls="news-header-categories"
                    >
                        <i className="fa-solid fa-bars" aria-hidden="true"></i>
                        <span>Chuyên mục</span>
                    </button>

                    <div
                        id="news-header-categories"
                        className={
                            menuOpen === true
                                ? 'news-header-categories is-open'
                                : 'news-header-categories'
                        }
                    >
                        <span>Mặt trận</span>
                        <span>Xã hội</span>
                        <span>Media</span>
                        <span>Kinh doanh</span>
                        <span>Pháp luật</span>
                        <span>Thời sự</span>
                        <span>Công đoàn</span>
                        <span>Sức khỏe</span>
                        <span>Thể thao</span>
                        <span>...</span>
                    </div>

                    <div className="news-header-tools">
                        <span className="news-header-tool-podcast">
                            <i className="fa-solid fa-podcast" aria-hidden="true"></i>
                        </span>

                        <span className="news-header-live">59s</span>

                        <span className="news-header-tool-quiz">
                            Trắc nghiệm
                            <i className="fa-regular fa-square-check" aria-hidden="true"></i>
                        </span>

                        <span className="news-header-tool-latest">
                            Tin mới
                            <i className="fa-regular fa-bell news-header-bell" aria-hidden="true"></i>
                        </span>

                        <span className="news-header-tool-search">
                            Tìm kiếm
                            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        </span>

                        <span className="news-header-tool-login">
                            Đăng nhập
                            <i className="fa-solid fa-user" aria-hidden="true"></i>
                        </span>
                    </div>
                </nav>
            </div>
        </header>
    )
}