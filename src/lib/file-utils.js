export function formatBytes(value) {
    if (!value) {
        return "0 KB"
    }

    const units = ["B", "KB", "MB", "GB"]
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
    const amount = value / 1024 ** index

    return `${amount.toFixed(amount >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

export function buildFileName(fileName, extension) {
    const baseName = fileName.replace(/\.[^/.]+$/, "")
    return `${baseName}.${extension}`
}

export function downloadUrl(url, fileName) {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
}

export function canvasToBlob(canvas, mime, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) {
                    resolve(result)
                    return
                }

                reject(new Error("Não foi possível gerar o arquivo."))
            },
            mime,
            quality
        )
    })
}
