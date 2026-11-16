
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { MessageCircle, Send, Sparkles } from 'lucide-react'
import { askArticleAi } from '../services/aiService'
import type { ArticleAiMessage } from '../services/aiService'
import './ArticleAiAssistant.css'

type ArticleAiAssistantProps = {
    title: string
    contentHtml: string
}

export default function ArticleAiAssistant({
                                               title,
                                               contentHtml
                                           }: ArticleAiAssistantProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ArticleAiMessage[]>([])
    const [question, setQuestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const articleText = useMemo(() => {
        const document = new DOMParser().parseFromString(
            contentHtml,
            'text/html'
        )

        const paragraphs = document.body.querySelectorAll(
            'h2, h3, p, li, blockquote'
        )

        const lines: string[] = []

        paragraphs.forEach((paragraph) => {
            const text = paragraph.textContent?.trim() ?? ''

            if (text !== '') {
                lines.push(text)
            }
        })

        let result = ''

        if (lines.length > 0) {
            result = lines.join('\n')
        } else {
            result = document.body.textContent?.trim() ?? ''
        }

        return result.slice(0, 15000)
    }, [contentHtml])

    async function handleAsk(
        mode: 'summary' | 'question',
        askedQuestion: string = ''
    ) {
        if (isLoading === true) {
            return
        }

        if (articleText.length < 50) {
            setError('Bài báo chưa có đủ nội dung để tóm tắt.')
            return
        }

        let userText = 'Tóm tắt bài viết này'

        if (mode === 'question') {
            userText = askedQuestion.trim()
        }

        if (userText === '') {
            return
        }

        const currentHistory = messages.slice(-6).map((message) => {
            return {
                role: message.role,
                text: message.text.slice(0, 1500)
            }
        })

        setError('')
        setIsLoading(true)

        setMessages((previous) => [
            ...previous,
            {
                role: 'user',
                text: userText
            }
        ])

        if (mode === 'question') {
            setQuestion('')
        }

        try {
            const answer = await askArticleAi({
                mode: mode,
                title: title,
                articleText: articleText,
                question: askedQuestion,
                history: currentHistory
            })

            setMessages((previous) => [
                ...previous,
                {
                    role: 'assistant',
                    text: answer
                }
            ])
        } catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message)
            } else {
                setError('Không thể nhận câu trả lời từ AI.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        void handleAsk('question', question)
    }

    return (
        <section className="article-ai">
            <button
                type="button"
                className="article-ai-toggle"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Sparkles size={20} aria-hidden="true" />
                AI tóm tắt & hỏi đáp
            </button>

            {isOpen === true ? (
                <div className="article-ai-panel">
                    <div className="article-ai-title">
                        <MessageCircle
                            size={20}
                            aria-hidden="true"
                        />

                        <strong>Trợ lý đọc tin Góc Tin</strong>
                    </div>

                    <p className="article-ai-note">
                        AI trả lời dựa trên nội dung bài báo đang đọc.
                        Thông tin có thể chưa hoàn toàn chính xác.
                    </p>

                    <button
                        type="button"
                        className="article-ai-summary-button"
                        disabled={
                            isLoading === true ||
                            articleText.length < 50
                        }
                        onClick={() => {
                            void handleAsk('summary')
                        }}
                    >
                        <Sparkles size={16} aria-hidden="true" />
                        Tóm tắt bài viết
                    </button>

                    <div
                        className="article-ai-messages"
                        aria-live="polite"
                    >
                        {messages.length === 0 ? (
                            <p className="article-ai-empty">
                                Hãy bấm Tóm tắt bài viết hoặc
                                đặt câu hỏi về bài báo này.
                            </p>
                        ) : null}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={
                                    message.role === 'user'
                                        ? 'article-ai-message article-ai-message-user'
                                        : 'article-ai-message article-ai-message-assistant'
                                }
                            >
                                <strong>
                                    {message.role === 'user'
                                        ? 'Bạn'
                                        : 'Trợ lý AI'}
                                </strong>

                                <p>{message.text}</p>
                            </div>
                        ))}

                        {isLoading === true ? (
                            <p
                                className="article-ai-waiting"
                                role="status"
                            >
                                Gemini đang xử lý yêu cầu...
                            </p>
                        ) : null}
                    </div>

                    {error !== '' ? (
                        <p
                            className="article-ai-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    ) : null}

                    <form
                        className="article-ai-form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            aria-label="Câu hỏi về bài báo"
                            placeholder="Hỏi thêm về bài báo..."
                            value={question}
                            maxLength={400}
                            disabled={isLoading}
                            onChange={(event) => {
                                setQuestion(event.target.value)
                            }}
                        />

                        <button
                            type="submit"
                            aria-label="Gửi câu hỏi"
                            disabled={
                                isLoading === true ||
                                question.trim().length < 2
                            }
                        >
                            <Send
                                size={18}
                                aria-hidden="true"
                            />
                        </button>
                    </form>
                </div>
            ) : null}
        </section>
    )
}
