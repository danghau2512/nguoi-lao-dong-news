
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories } from '../constants/categories'
import './Footer.css'

const newsCategories = categories.slice(0, 6)
const lifeCategories = categories.slice(6, 11)
const otherCategories = categories.slice(11)

export default function Footer() {
    const [searchKeyword, setSearchKeyword] = useState('')
    const navigate = useNavigate()

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const keyword = searchKeyword.trim()

        if (keyword !== '') {
            navigate('/tim-kiem?q=' + encodeURIComponent(keyword))
            setSearchKeyword('')
        }
    }

    return (
        <footer className="news-footer">

            <section className="news-footer-sitemap">
                <div className="news-footer-container">

                    <div className="news-footer-sitemap-top">

                        <div className="news-footer-sitemap-intro">
                            <span className="news-footer-section-label">
                                DANH MỤC TIN TỨC
                            </span>

                            <h2>Các chuyên mục</h2>

                            <p>
                                Theo dõi tin tức theo từng lĩnh vực.
                            </p>
                        </div>

                        <form
                            className="news-footer-search"
                            onSubmit={handleSearch}
                            role="search"
                        >
                            <label
                                htmlFor="news-footer-search-input"
                                className="news-footer-visually-hidden"
                            >
                                Tìm kiếm bài viết
                            </label>

                            <input
                                id="news-footer-search-input"
                                type="search"
                                placeholder="Tìm kiếm tin tức..."
                                value={searchKeyword}
                                onChange={(event) => {
                                    setSearchKeyword(event.target.value)
                                }}
                            />

                            <button
                                type="submit"
                                aria-label="Tìm kiếm"
                            >
                                <i
                                    className="fa-solid fa-magnifying-glass"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </form>

                    </div>

                    <div className="news-footer-sitemap-grid">

                        <div className="news-footer-sitemap-column">
                            <h3>Tin tức</h3>

                            <div className="news-footer-sitemap-links">
                                <Link to="/">
                                    Trang chủ
                                </Link>

                                {newsCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        to={'/chuyen-muc/' + category.slug}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="news-footer-sitemap-column">
                            <h3>Đời sống và xã hội</h3>

                            <div className="news-footer-sitemap-links">
                                {lifeCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        to={'/chuyen-muc/' + category.slug}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="news-footer-sitemap-column">
                            <h3>Chuyên mục khác</h3>

                            <div className="news-footer-sitemap-links">
                                {otherCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        to={'/chuyen-muc/' + category.slug}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="news-footer-information">
                <div className="news-footer-container">

                    <div className="news-footer-information-grid">

                        <div className="news-footer-about">

                            <Link
                                to="/"
                                className="news-footer-brand"
                                aria-label="Góc Tin - Trang chủ"
                            >
                                <span className="news-footer-brand-icon">
                                    <i
                                        className="fa-regular fa-newspaper"
                                        aria-hidden="true"
                                    ></i>
                                </span>

                                <strong>GÓC TIN</strong>
                            </Link>

                            <p className="news-footer-description">
                                Góc Tin tổng hợp và cập nhật thông tin
                                về thời sự, kinh tế, lao động, giáo dục,
                                sức khỏe và các lĩnh vực được quan tâm.
                            </p>

                            <div className="news-footer-source">
                                <span>Nguồn tin tham khảo</span>

                                <a
                                    href="https://tuoitre.vn/nld/index.htm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Báo Người Lao Động
                                    <i
                                        className="fa-solid fa-arrow-up-right-from-square"
                                        aria-hidden="true"
                                    ></i>
                                </a>
                            </div>

                        </div>

                        <div className="news-footer-contact">
                            <h3>Thông tin nguồn báo</h3>

                            <p>
                                Thông tin và các kênh liên hệ của
                                Báo Người Lao Động.
                            </p>

                            <a
                                href="https://tuoitre.vn/nld/index.htm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i
                                    className="fa-solid fa-globe"
                                    aria-hidden="true"
                                ></i>
                                <span>Báo Người Lao Động</span>
                            </a>

                            <a
                                href="https://tuoitre.vn/nld/rss.htm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i
                                    className="fa-solid fa-rss"
                                    aria-hidden="true"
                                ></i>
                                <span>Danh sách RSS Người Lao Động</span>
                            </a>

                            <a href="mailto:online@nld.com.vn">
                                <i
                                    className="fa-regular fa-envelope"
                                    aria-hidden="true"
                                ></i>
                                <span>online@nld.com.vn</span>
                            </a>

                        </div>

                        <div className="news-footer-connect">
                            <h3>Kết nối</h3>

                            <p>
                                Theo dõi tin tức qua các kênh
                                của Báo Người Lao Động.
                            </p>

                            <div className="news-footer-social">

                                <a
                                    href="https://www.facebook.com/nguoilaodong"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-footer-social-facebook"
                                    aria-label="Facebook Báo Người Lao Động"
                                    title="Facebook"
                                >
                                    <i
                                        className="fa-brands fa-facebook-f"
                                        aria-hidden="true"
                                    ></i>
                                </a>

                                <a
                                    href="https://www.youtube.com/@NguoiLaoDongTV"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-footer-social-youtube"
                                    aria-label="YouTube Báo Người Lao Động"
                                    title="YouTube"
                                >
                                    <i
                                        className="fa-brands fa-youtube"
                                        aria-hidden="true"
                                    ></i>
                                </a>

                                <a
                                    href="https://www.tiktok.com/@baonguoilaodong"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-footer-social-tiktok"
                                    aria-label="TikTok Báo Người Lao Động"
                                    title="TikTok"
                                >
                                    <i
                                        className="fa-brands fa-tiktok"
                                        aria-hidden="true"
                                    ></i>
                                </a>

                                <a
                                    href="https://zalo.me/nguoilaodongonline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-footer-social-zalo"
                                    aria-label="Zalo Báo Người Lao Động"
                                    title="Zalo"
                                >
                                    Zalo
                                </a>

                                <a
                                    href="mailto:online@nld.com.vn"
                                    className="news-footer-social-email"
                                    aria-label="Email Báo Người Lao Động"
                                    title="Email"
                                >
                                    <i
                                        className="fa-regular fa-envelope"
                                        aria-hidden="true"
                                    ></i>
                                </a>

                                <a
                                    href="https://tuoitre.vn/nld/rss.htm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="news-footer-social-rss"
                                    aria-label="RSS Báo Người Lao Động"
                                    title="RSS"
                                >
                                    <i
                                        className="fa-solid fa-rss"
                                        aria-hidden="true"
                                    ></i>
                                </a>

                            </div>

                            <div className="news-footer-read-more">
                                <a
                                    href="https://tuoitre.vn/tto-nld.htm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Đọc thêm tin tức Người Lao Động
                                    <i
                                        className="fa-solid fa-arrow-up-right-from-square"
                                        aria-hidden="true"
                                    ></i>
                                </a>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            <div className="news-footer-bottom">
                <div className="news-footer-container news-footer-bottom-inner">
                    <p>
                        © Góc Tin. Tin tức được tổng hợp từ các nguồn công khai.
                    </p>

                    <p>
                        Nội dung và hình ảnh thuộc bản quyền
                        của đơn vị xuất bản tương ứng.
                    </p>
                </div>
            </div>

        </footer>
    )
}
