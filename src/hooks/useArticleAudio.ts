import { useEffect, useRef, useState } from 'react'

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
        if (requestRef.current) return

        const content = text.trim()
        setAudioError('')

        if (!content || content.length > 3000) {
            setAudioError('Bản hiện tại hỗ trợ đoạn đọc từ 1 đến 3.000 ký tự.')
            return
        }

        const controller = new AbortController()
        requestRef.current = controller

        try {
            let audio = audioRef.current

            if (!audio) {
                setIsAudioLoading(true)

                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: content }),
                    signal: controller.signal,
                })

                if (!response.ok) {
                    const data = await response.json().catch(() => null)
                    throw new Error(data?.message || `Không tạo được giọng đọc (HTTP ${response.status}).`)
                }

                const mp3 = await response.blob()
                if (controller.signal.aborted) return

                audio = new Audio(URL.createObjectURL(mp3))
                audioRef.current = audio
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