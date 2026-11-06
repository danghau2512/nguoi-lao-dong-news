interface MockArticleContentProps {
    articleId: string
}
export default function MockArticleContent({
                                               articleId,
                                           }: MockArticleContentProps) {
    if (articleId === 'demo-1') {
        return (
            <div className="article-page__content">
                <p>
                    Những mảng xanh tại khu dân cư góp phần tạo không gian
                    sinh hoạt chung, giúp người dân có thêm nơi nghỉ ngơi
                    và vận động mỗi ngày.
                </p>

                <h2>Thêm không gian xanh cho khu dân cư</h2>

                <p>
                    Việc trồng cây cần phù hợp với diện tích và điều kiện
                    của từng khu vực. Bên cạnh cây bóng mát, các bồn hoa
                    nhỏ có thể được bố trí dọc lối đi để cải thiện cảnh quan.
                </p>

                <p>
                    Công tác chăm sóc cần được duy trì thường xuyên,
                    từ tưới nước, cắt tỉa đến thu gom rác, bảo đảm không gian
                    chung luôn sạch sẽ và thuận tiện cho người sử dụng.
                </p>

                <h2>Duy trì từ những việc nhỏ</h2>

                <p>
                    Giữ gìn cây xanh, bỏ rác đúng nơi quy định và sử dụng
                    tiết kiệm nước là những việc mỗi người có thể thực hiện
                    để bảo vệ môi trường sống.
                </p>
            </div>
        )
    }

    if (articleId === 'demo-2') {
        return (
            <div className="article-page__content">
                <p>
                    Bên cạnh giờ học trên lớp, việc tự học giúp sinh viên
                    củng cố kiến thức và chủ động giải quyết những nội dung
                    còn chưa hiểu.
                </p>

                <h2>Xây dựng kế hoạch học tập phù hợp</h2>

                <p>
                    Thay vì dồn nhiều nội dung vào cuối tuần, sinh viên
                    có thể chia bài học thành từng phần nhỏ và dành thời gian
                    ôn tập sau mỗi buổi học.
                </p>

                <ul>
                    <li>Xác định nội dung cần hoàn thành trong ngày.</li>
                    <li>Ưu tiên những phần kiến thức còn chưa nắm vững.</li>
                    <li>Kết hợp đọc tài liệu với bài tập thực hành.</li>
                </ul>

                <h2>Chủ động trao đổi khi gặp khó khăn</h2>

                <p>
                    Những vấn đề chưa giải quyết được nên được ghi lại
                    để trao đổi với giảng viên hoặc bạn học. Việc trình bày
                    rõ câu hỏi cũng giúp người học nhìn lại cách hiểu
                    của mình.
                </p>
            </div>
        )
    }

    return <p>Chưa có nội dung cho bài viết này.</p>
}