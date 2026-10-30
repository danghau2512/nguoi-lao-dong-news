
import { Link } from 'react-router-dom'
import logoLaoDong from '../assets/logo/ldo_red.png'
import './Footer.css'

const sitemapColumns = [
    [
        {
            title: 'MẶT TRẬN',
            url: 'https://laodong.vn/mat-tran',
            children: [
                'Hoạt động Mặt trận',
                'Công đoàn',
                'Dân tộc Tôn giáo',
                'Người Việt tử tế',
                'Tấm Lòng Vàng'
            ]
        },
        {
            title: 'KINH DOANH',
            url: 'https://laodong.vn/kinh-doanh',
            children: [
                'Tiền tệ & Đầu tư',
                'Thị trường',
                'Doanh nghiệp',
                'Doanh nhân'
            ]
        },
        {
            title: 'CÔNG ĐOÀN',
            url: 'https://laodong.vn/cong-doan',
            children: [
                'Cách làm hay từ cơ sở',
                'Vì lợi ích đoàn viên'
            ]
        },
        {
            title: 'THẾ GIỚI',
            url: 'https://laodong.vn/the-gioi',
            children: ['Tư liệu']
        },
        {
            title: 'BẠN ĐỌC',
            url: 'https://laodong.vn/ban-doc',
            children: [
                'Điều tra theo đơn thư',
                'Chính sách',
                'Ý kiến - Hỏi đáp'
            ]
        },
        {
            title: 'CÔNG NGHỆ',
            url: 'https://laodong.vn/cong-nghe',
            children: [
                'Thế giới số',
                'Vũ khí - Quân sự'
            ]
        },
        {
            title: 'ĐÍNH CHÍNH',
            url: 'https://www.google.com/search?q=site%3Alaodong.vn+%22%C4%91%C3%ADnh+ch%C3%ADnh%22',
            children: []
        }
    ],
    [
        {
            title: 'XÃ HỘI',
            url: 'https://laodong.vn/xa-hoi',
            children: [
                'Môi trường',
                'Giao thông'
            ]
        },
        {
            title: 'PHÁP LUẬT',
            url: 'https://laodong.vn/phap-luat',
            children: [
                'Tư vấn pháp luật',
                'An ninh hình sự'
            ]
        },
        {
            title: 'SỨC KHỎE',
            url: 'https://laodong.vn/suc-khoe',
            children: [
                'Y tế',
                'Dinh dưỡng - Ẩm thực',
                'Làm đẹp',
                'Các loại bệnh'
            ]
        },
        {
            title: 'VĂN HÓA - GIẢI TRÍ',
            url: 'https://laodong.vn/van-hoa-giai-tri',
            children: [
                'Văn hóa',
                'Giải trí',
                'Thời trang',
                'Sách hay'
            ]
        },
        {
            title: 'GIÁO DỤC',
            url: 'https://laodong.vn/giao-duc',
            children: [
                'Chính sách giáo dục',
                'Tuyển sinh'
            ]
        },
        {
            title: 'XE',
            url: 'https://laodong.vn/xe',
            children: [
                'Thị trường xe',
                'Lái xe an toàn'
            ]
        }
    ],
    [
        {
            title: 'MEDIA',
            url: 'https://laodong.vn/media',
            children: [
                'Lao Động TV',
                'Hypertext',
                'Photo',
                'Podcast'
            ]
        },
        {
            title: 'THỜI SỰ',
            url: 'https://laodong.vn/thoi-su',
            children: ['Sự kiện bình luận']
        },
        {
            title: 'THỂ THAO',
            url: 'https://laodong.vn/the-thao',
            children: [
                'Bóng chuyền',
                'Bóng đá Việt Nam',
                'Bóng đá quốc tế',
                'Lịch thi đấu',
                'Golf',
                'Tennis'
            ]
        },
        {
            title: 'BẤT ĐỘNG SẢN',
            url: 'https://laodong.vn/bat-dong-san',
            children: [
                'Nhà đẹp',
                'Quy hoạch'
            ]
        },
        {
            title: 'HÔN NHÂN GIA ĐÌNH',
            url: 'https://laodong.vn/hon-nhan-gia-dinh',
            children: [
                'Chuyện nhà mình',
                'Yêu 360',
                'Nuôi con'
            ]
        },
        {
            title: 'TIN TỨC VIỆC LÀM',
            url: 'https://laodong.vn/viec-lam',
            children: [
                'Tư vấn lao động',
                'Xuất khẩu lao động'
            ]
        }
    ]
]

function getSitemapChildUrl(name: string) {
    const sitemapChildUrls: Record<string, string> = {
        'Lao Động TV': 'https://laodong.vn/video/',
        'Photo': 'https://laodong.vn/photo/'
    }

    if (sitemapChildUrls[name]) {
        return sitemapChildUrls[name]
    } else {
        return 'https://www.google.com/search?q=' +
            encodeURIComponent('site:laodong.vn "' + name + '"')
    }
}

export default function Footer() {
    return (
        <footer className="news-footer">

            <div className="news-footer-sitemap">
                <div className="news-footer-sitemap-container">

                    <form
                        className="news-footer-search"
                        action="https://www.google.com/search"
                        method="get"
                        target="_blank"
                        role="search"
                    >
                        <i
                            className="fa-solid fa-magnifying-glass"
                            aria-hidden="true"
                        ></i>

                        <input
                            type="search"
                            name="q"
                            placeholder="Tìm kiếm trên Google"
                            aria-label="Tìm kiếm tin trên Báo Lao Động"
                            required
                        />

                        <input
                            type="hidden"
                            name="as_sitesearch"
                            value="laodong.vn"
                        />
                    </form>

                    <div className="news-footer-sitemap-grid">
                        {sitemapColumns.map((column, columnIndex) => (
                            <div
                                className="news-footer-sitemap-column"
                                key={columnIndex}
                            >
                                {column.map((section) => (
                                    <div
                                        className="news-footer-sitemap-group"
                                        key={section.title}
                                    >
                                        <a
                                            className="news-footer-sitemap-title"
                                            href={section.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {section.title}
                                        </a>

                                        <div className="news-footer-sitemap-links">
                                            {section.children.map((item) => (
                                                <a
                                                    key={item}
                                                    href={getSitemapChildUrl(item)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {item}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="news-footer-information">
                <div className="news-footer-container">

                    <div className="news-footer-social">
                        <a
                            href="https://www.facebook.com/laodongonline"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-social-facebook"
                            aria-label="Facebook Báo Lao Động"
                            title="Facebook"
                        >
                            <i
                                className="fa-brands fa-facebook-f"
                                aria-hidden="true"
                            ></i>
                        </a>

                        <a
                            href="https://zalo.me/1953123341318396123"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-social-zalo"
                            aria-label="Zalo Báo Lao Động"
                            title="Zalo"
                        >
                            Zalo
                        </a>

                        <a
                            href="https://news.google.com/search?q=site%3Alaodong.vn&hl=vi&gl=VN&ceid=VN%3Avi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-social-google"
                            aria-label="Google News Báo Lao Động"
                            title="Google News"
                        >
                            <i
                                className="fa-brands fa-google"
                                aria-hidden="true"
                            ></i>
                        </a>

                        <a
                            href="https://www.youtube.com/@laodongtvonline"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-social-youtube"
                            aria-label="YouTube Báo Lao Động"
                            title="YouTube"
                        >
                            <i
                                className="fa-brands fa-youtube"
                                aria-hidden="true"
                            ></i>
                        </a>

                        <a
                            href="mailto:toasoan@laodong.com.vn"
                            className="news-footer-social-email"
                            aria-label="Email Báo Lao Động"
                            title="Email"
                        >
                            <i
                                className="fa-solid fa-envelope"
                                aria-hidden="true"
                            ></i>
                        </a>

                        <a
                            href="https://news.google.com/rss/search?q=site%3Alaodong.vn&hl=vi&gl=VN&ceid=VN%3Avi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-social-rss"
                            aria-label="RSS tin Báo Lao Động qua Google News"
                            title="RSS qua Google News"
                        >
                            <i
                                className="fa-solid fa-rss"
                                aria-hidden="true"
                            ></i>
                        </a>
                    </div>

                    <div className="news-footer-information-grid">

                        <div className="news-footer-brand">
                            <Link
                                to="/"
                                aria-label="Về trang chủ"
                            >
                                <img
                                    src={logoLaoDong}
                                    alt="Báo Lao Động"
                                />
                            </Link>
                        </div>

                        <div className="news-footer-editorial">
                            <p>
                                Xuất bản số Báo Lao Động đầu tiên vào ngày 14.8.1929
                            </p>

                            <p className="news-footer-editorial-heading">
                                CƠ QUAN CỦA TỔNG LIÊN ĐOÀN LAO ĐỘNG VIỆT NAM
                            </p>

                            <p>
                                Giấy phép số 346/GP-BTTTT do Bộ TTTT cấp ngày 08.07.2022
                            </p>

                            <p>
                                Tổng Biên tập: Nguyễn Ngọc Hiển
                            </p>

                            <p className="news-footer-address-heading">
                                Địa chỉ liên hệ:
                            </p>

                            <p>
                                Số 6 Phạm Văn Bạch, phường Cầu Giấy,
                                Thành phố Hà Nội
                            </p>
                        </div>

                        <div className="news-footer-contact">
                            <h3>Thông tin liên hệ:</h3>

                            <div className="news-footer-contact-row">
                                <span>Tòa soạn:</span>

                                <div>
                                    <a href="tel:+842438252441">
                                        (+84 24) 38252441
                                    </a>

                                    {' - '}

                                    <a href="tel:+842435330305">
                                        35330305
                                    </a>
                                </div>
                            </div>

                            <div className="news-footer-contact-row">
                                <span>Báo điện tử:</span>

                                <div>
                                    <a href="tel:+842438303044">
                                        (+84 24) 38303044
                                    </a>

                                    <div>
                                        Email:
                                        {' '}
                                        <a href="mailto:toasoan@laodong.com.vn">
                                            toasoan@laodong.com.vn
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="news-footer-contact-row">
                                <span>Quảng cáo:</span>

                                <div>
                                    <div>
                                        <a href="tel:+842439232694">
                                            (+84 24) 39232694
                                        </a>
                                        {' (Báo in)'}
                                    </div>

                                    <div>
                                        <a href="tel:+842435335237">
                                            (+84 24) 35335237
                                        </a>
                                        {' (online)'}
                                    </div>
                                </div>
                            </div>

                            <p className="news-footer-hotline">
                                Đường dây nóng:
                                {' '}
                                <a href="tel:0968383388">
                                    096 8383388
                                </a>
                                {' '}
                                * Bạn đọc:
                                {' '}
                                <a href="tel:+842435335235">
                                    (+84 24) 35335235
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="news-footer-apps">

                        <a
                            href="https://play.google.com/store/apps/details?id=com.ninepoints.ldo.reader"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-app-badge"
                            aria-label="Tải ứng dụng Báo Lao Động trên Google Play"
                        >
                            <i
                                className="fa-brands fa-google-play"
                                aria-hidden="true"
                            ></i>

                            <div>
                                <small>GET IT ON</small>
                                <strong>Google Play</strong>
                            </div>
                        </a>

                        <a
                            href="https://apps.apple.com/vn/app/id1328195523"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-footer-app-badge"
                            aria-label="Tải ứng dụng Báo Lao Động trên App Store"
                        >
                            <i
                                className="fa-brands fa-apple"
                                aria-hidden="true"
                            ></i>

                            <div>
                                <small>Download on the</small>
                                <strong>App Store</strong>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className="news-footer-copyright">
                <p>
                    Nội dung và thương hiệu Báo Lao Động thuộc đơn vị sở hữu tương ứng.
                </p>
            </div>

        </footer>
    )
}
