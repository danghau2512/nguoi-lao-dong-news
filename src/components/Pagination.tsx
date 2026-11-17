
import { Fragment } from 'react'
import './Pagination.css'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPageChange
                                   }: PaginationProps) {
    if (totalPages <= 1) {
        return null
    }

    const visiblePages: number[] = []

    for (let page = 1; page <= totalPages; page++) {
        const isFirstPage = page === 1
        const isLastPage = page === totalPages
        const isNearCurrentPage = Math.abs(page - currentPage) <= 1

        if (
            isFirstPage ||
            isLastPage ||
            isNearCurrentPage
        ) {
            visiblePages.push(page)
        }
    }

    return (
        <nav
            className="news-pagination"
            aria-label="Phân trang bài viết"
        >
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Trước
            </button>

            {visiblePages.map((page, index) => {
                const previousPage = visiblePages[index - 1]
                const hasGap =
                    previousPage !== undefined &&
                    page - previousPage > 1

                return (
                    <Fragment key={page}>
                        {hasGap === true ? (
                            <span
                                className="news-pagination-dots"
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        ) : null}

                        <button
                            type="button"
                            className={
                                page === currentPage
                                    ? 'news-pagination-active'
                                    : ''
                            }
                            aria-label={'Trang ' + page}
                            aria-current={
                                page === currentPage
                                    ? 'page'
                                    : undefined
                            }
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </Fragment>
                )
            })}

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Sau
            </button>
        </nav>
    )
}
