
export async function convertAudioToWav(audio: Blob): Promise<Blob> {
    const audioContext = new AudioContext()

    let decodedAudio: AudioBuffer

    try {
        const data = await audio.arrayBuffer()
        decodedAudio = await audioContext.decodeAudioData(data)
    } finally {
        await audioContext.close()
    }

    const sampleRate = 16000
    const frameCount = Math.max(
        1,
        Math.ceil(decodedAudio.duration * sampleRate)
    )

    const offlineContext = new OfflineAudioContext(
        1,
        frameCount,
        sampleRate
    )

    const source = offlineContext.createBufferSource()
    source.buffer = decodedAudio
    source.connect(offlineContext.destination)
    source.start()

    const renderedAudio = await offlineContext.startRendering()
    const samples = renderedAudio.getChannelData(0)

    const buffer = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(buffer)

    function writeText(offset: number, text: string) {
        for (let i = 0; i < text.length; i++) {
            view.setUint8(offset + i, text.charCodeAt(i))
        }
    }

    writeText(0, 'RIFF')
    view.setUint32(4, 36 + samples.length * 2, true)

    writeText(8, 'WAVE')
    writeText(12, 'fmt ')

    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)

    writeText(36, 'data')
    view.setUint32(40, samples.length * 2, true)

    for (let i = 0; i < samples.length; i++) {
        const sample = Math.max(-1, Math.min(1, samples[i]))

        const value = sample < 0
            ? sample * 32768
            : sample * 32767

        view.setInt16(44 + i * 2, value, true)
    }

    return new Blob([buffer], {
        type: 'audio/wav'
    })
}
