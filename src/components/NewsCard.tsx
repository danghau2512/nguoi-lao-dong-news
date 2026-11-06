
import { Link } from 'react-router-dom'
import { categories } from '../constants/categories'
import './NewsCard.css'
type NewsCardProps = {
    id: string
    title: string
    description: string
    imageUrl?: string
    categorySlug: string
    sourceUrl?: string
}

export default function NewsCard(props: NewsCardProps) {
    let categoryName = 'Tin tức'

    for (const category of categories) {
        if (category.slug === props.categorySlug) {
            categoryName = category.name
            break
        }
    }

    const articlePath = '/bai-viet/' + encodeURIComponent(props.id)

    return (
        <article className="news-card">

            <Link
                to={articlePath}
                className="news-card-image-link"
            >
                {props.imageUrl !== undefined && props.imageUrl !== '' ? (
                    <img
                        src={props.imageUrl}
                        alt={props.title}
                        className="news-card-image"
                        loading="lazy"
                    />
                ) : (
                    <div className="news-card-no-image">
                        <i className="fa-regular fa-image"></i>
                    </div>
                )}
            </Link>

            <div className="news-card-content">

                <span className="news-card-category">
                    {categoryName}
                </span>

                <h3 className="news-card-title">
                    <Link to={articlePath}>
                        {props.title}
                    </Link>
                </h3>

                <p className="news-card-description">
                    {props.description}
                </p>

                {props.sourceUrl !== undefined && props.sourceUrl !== '' && (
                    <a
                        href={props.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-card-source"
                    >
                        Xem bài viết gốc
                    </a>
                )}

            </div>

        </article>
    )
}
