import { useEffect, useRef, useState } from 'react'


function splitArticleText(text: string): string[] {
    const content = text.replace(/\s+/g, ' ').trim()
    const chunks = content.match(/.{1,3000}(?=\s|$)|.{1,3000}/gu) ?? []

    return chunks.map((chunk) => chunk.trim()).filter(Boolean)
}
export function useArticleAudio() {
    const [isAudioLoading, setIsAudioLoading] = useState(false)
    const [audioError, setAudioError] = useState('')
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const requestRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => {
            requestRef.current?.abort()

            const audio = audioRef.current
            if (audio) {
                audio.pause()
                URL.revokeObjectURL(audio.src)
                audioRef.current = null
            }
        }
    }, [])

    async function playArticle(text: string) {
        const chunks = splitArticleText(text)

        if (chunks.length === 0) {
            setAudioError('Bài viết chưa có nội dung để đọc.')
            return
        }

        void playChunk(chunks, 0)
    }

    async function playChunk(chunks: string[], index: number) {
        if (requestRef.current) return

        setAudioError('')


        const controller = new AbortController()
        requestRef.current = controller

        try {
            let audio = audioRef.current

            if (!audio) {
                setIsAudioLoading(true)

                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: chunks[index] }),
                    signal: controller.signal,
                })

                if (!response.ok) {
                    const data = await response.json().catch(() => null)
                    throw new Error(data?.message || `Không tạo được giọng đọc (HTTP ${response.status}).`)
                }

                const mp3 = await response.blob()
                if (controller.signal.aborted) return

                const player = new Audio(URL.createObjectURL(mp3))
                audioRef.current = player
                audio = player

                player.onended = () => {
                    if (audioRef.current !== player) return

                    URL.revokeObjectURL(player.src)
                    audioRef.current = null

                    if (index + 1 < chunks.length) {
                        void playChunk(chunks, index + 1)
                    }
                }
            }

            await audio.play()
        } catch (error) {
            if (controller.signal.aborted) return

            if (error instanceof DOMException && error.name === 'NotAllowedError') {
                setAudioError('Âm thanh đã sẵn sàng. Bạn hãy bấm Đọc bài lần nữa.')
            } else {
                setAudioError(error instanceof Error ? error.message : 'Không thể đọc bài.')
            }
        } finally {
            requestRef.current = null
            if (!controller.signal.aborted) setIsAudioLoading(false)
        }
    }

    return { playArticle, isAudioLoading, audioError }
}