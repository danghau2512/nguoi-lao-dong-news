export function getArticleSpeechText(title: string, contentHtml: string) {
    const doc = new DOMParser().parseFromString(contentHtml, 'text/html')

    doc.body.querySelectorAll('p, h2, h3, li, blockquote, figcaption, br').forEach((element) => {
        element.after(doc.createTextNode('\n'))
    })

    const body = doc.body.textContent ?? ''
    return `${title}\n${body}`.trim()
}