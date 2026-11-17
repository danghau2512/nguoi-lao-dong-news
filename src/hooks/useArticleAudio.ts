import { useEffect, useRef, useState } from 'react'

type AudioStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused'

function splitArticleText(text: string): string[] {
    const content = text.replace(/\s+/g, ' ').trim()
    const chunks: string[] = []
    const maxLength = 3000
    let start = 0

    while (content.length - start > maxLength) {
        const limit = start + maxLength
        const space = content.lastIndexOf(' ', limit)
        let end = space > start ? space : limit

        if ((content.codePointAt(end - 1) ?? 0) > 0xffff) end--

        chunks.push(content.slice(start, end))
        start = content[end] === ' ' ? end + 1 : end
    }

    if (start < content.length) chunks.push(content.slice(start))
    return chunks
}

function releaseAudio(audio: HTMLAudioElement | null) {
    if (!audio) return

    audio.onended = null
    audio.onerror = null
    audio.pause()
    URL.revokeObjectURL(audio.src)
}

export function useArticleAudio(playbackRate = 1) {
    const [status, setStatus] = useState<AudioStatus>('idle')
    const [audioError, setAudioError] = useState('')
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const requestRef = useRef<AbortController | null>(null)
    const playbackRateRef = useRef(playbackRate)

    useEffect(() => {
        playbackRateRef.current = playbackRate

        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate
        }
    }, [playbackRate])
    useEffect(() => {
        return () => {
            requestRef.current?.abort()
            requestRef.current = null
            releaseAudio(audioRef.current)
            audioRef.current = null
        }
    }, [])

    function playArticle(text: string) {
        if (requestRef.current || audioRef.current) return

        const chunks = splitArticleText(text)
        if (chunks.length === 0) {
            setAudioError('Bài viết chưa có nội dung để đọc.')
            return
        }

        void playChunk(chunks, 0)
    }

    function pauseArticle() {
        const audio = audioRef.current
        if (status !== 'playing' || !audio || audio.ended) return

        audio.pause()
        setStatus('paused')
    }

    function resumeArticle() {
        const audio = audioRef.current
        const canResume = status === 'paused' || status === 'ready'
        if (!canResume || !audio?.paused || audio.ended) return
        void playAudio(audio)
    }

    function stopArticle() {
        requestRef.current?.abort()
        requestRef.current = null
        releaseAudio(audioRef.current)
        audioRef.current = null
        setStatus('idle')
        setAudioError('')
    }

    function handlePlaybackError(audio: HTMLAudioElement, error: unknown) {
        if (audioRef.current !== audio) return

        if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setStatus('ready')
            setAudioError('Âm thanh đã sẵn sàng. Bạn hãy bấm Tiếp tục.')
            return
        }

        releaseAudio(audio)
        audioRef.current = null
        setStatus('idle')
        setAudioError(error instanceof Error ? error.message : 'Không thể phát âm thanh bài viết.')
    }

    async function playAudio(audio: HTMLAudioElement) {
        setAudioError('')

        try {
            await audio.play()
            if (audioRef.current === audio) setStatus('playing')
        } catch (error) {
            handlePlaybackError(audio, error)
        }
    }

    async function playChunk(chunks: string[], index: number) {
        const controller = new AbortController()
        requestRef.current = controller
        setStatus('loading')
        setAudioError('')

        let audio: HTMLAudioElement

        try {
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

            audio = new Audio(URL.createObjectURL(mp3))
            audio.playbackRate = playbackRateRef.current
            audioRef.current = audio
        } catch (error) {
            if (controller.signal.aborted) return

            setStatus('idle')
            setAudioError(error instanceof Error ? error.message : 'Không thể tạo giọng đọc.')
            return
        } finally {
            if (requestRef.current === controller) requestRef.current = null
        }

        audio.onended = () => {
            if (audioRef.current !== audio) return

            releaseAudio(audio)
            audioRef.current = null

            if (index + 1 < chunks.length) {
                void playChunk(chunks, index + 1)
            } else {
                setStatus('idle')
            }
        }
        audio.onerror = () => handlePlaybackError(audio, null)

        void playAudio(audio)
    }

    return { status, audioError, playArticle, pauseArticle, resumeArticle, stopArticle }
}
