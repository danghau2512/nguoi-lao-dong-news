
import { useEffect, useRef, useState } from 'react'

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false)

    const recorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const chunksRef = useRef<Blob[]>([])

    function releaseStream() {
        streamRef.current?.getTracks().forEach((track) => {
            track.stop()
        })

        streamRef.current = null
        recorderRef.current = null
    }

    async function startRecording() {
        if (!navigator.mediaDevices?.getUserMedia ||
            typeof MediaRecorder === 'undefined') {
            throw new Error('Trình duyệt không hỗ trợ ghi âm.')
        }

        if (recorderRef.current?.state === 'recording') {
            return
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        })

        try {
            const recorder = new MediaRecorder(stream)

            streamRef.current = stream
            recorderRef.current = recorder
            chunksRef.current = []

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data)
                }
            }

            recorder.start()
            setIsRecording(true)
        } catch (error) {
            stream.getTracks().forEach((track) => track.stop())
            throw error
        }
    }

    function stopRecording(): Promise<Blob> {
        const recorder = recorderRef.current

        if (!recorder || recorder.state !== 'recording') {
            return Promise.reject(
                new Error('Không có bản ghi âm đang hoạt động.')
            )
        }

        return new Promise((resolve, reject) => {
            recorder.onstop = () => {
                const audio = new Blob(chunksRef.current, {
                    type: recorder.mimeType || 'audio/webm'
                })

                releaseStream()

                if (audio.size === 0) {
                    reject(new Error('Không thu được âm thanh.'))
                    return
                }

                resolve(audio)
            }

            recorder.onerror = () => {
                releaseStream()
                reject(new Error('Có lỗi khi ghi âm.'))
            }

            recorder.stop()
            setIsRecording(false)
        })
    }

    useEffect(() => {
        return () => {
            const recorder = recorderRef.current

            if (recorder?.state === 'recording') {
                recorder.stop()
            }

            releaseStream()
        }
    }, [])

    return {
        isRecording,
        startRecording,
        stopRecording
    }
}
