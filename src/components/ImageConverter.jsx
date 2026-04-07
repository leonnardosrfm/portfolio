import { useEffect, useRef, useState } from "react"
import { FaDownload, FaExchangeAlt, FaImage, FaTrashAlt, FaUpload } from "react-icons/fa"

const formats = [
    { label: "PNG", extension: "png", mime: "image/png" },
    { label: "JPG", extension: "jpg", mime: "image/jpeg" },
    { label: "WebP", extension: "webp", mime: "image/webp" },
]

const supportedTypes = new Set(formats.map((format) => format.mime))

function getFormatByMime(mime) {
    return formats.find((format) => format.mime === mime) ?? formats[0]
}

function getNextFormat(mime) {
    const currentIndex = formats.findIndex((format) => format.mime === mime)

    if (currentIndex === -1) {
        return formats[0]
    }

    return formats[(currentIndex + 1) % formats.length]
}

function formatBytes(value) {
    if (!value) {
        return "0 KB"
    }

    const units = ["B", "KB", "MB", "GB"]
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
    const amount = value / 1024 ** index

    return `${amount.toFixed(amount >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

function buildFileName(fileName, extension) {
    const baseName = fileName.replace(/\.[^/.]+$/, "")
    return `${baseName}.${extension}`
}

function loadImage(source) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error("Não foi possível carregar a imagem."))
        image.src = source
    })
}

function downloadFile(url, fileName) {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
}

export default function ImageConverter({ showTitle = true }) {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState("")
    const [file, setFile] = useState(null)
    const [sourceUrl, setSourceUrl] = useState("")
    const [sourceInfo, setSourceInfo] = useState(null)
    const [targetMime, setTargetMime] = useState(formats[1].mime)
    const [converted, setConverted] = useState(null)

    useEffect(() => {
        if (!sourceUrl) {
            return undefined
        }

        return () => {
            URL.revokeObjectURL(sourceUrl)
        }
    }, [sourceUrl])

    useEffect(() => {
        if (!converted?.url) {
            return undefined
        }

        return () => {
            URL.revokeObjectURL(converted.url)
        }
    }, [converted])

    function openPicker() {
        if (!inputRef.current) {
            return
        }

        inputRef.current.value = ""
        inputRef.current.click()
    }

    async function prepareFile(nextFile) {
        if (!nextFile) {
            return
        }

        if (!supportedTypes.has(nextFile.type)) {
            setError("Envie uma imagem PNG, JPG ou WebP.")
            return
        }

        const previewUrl = URL.createObjectURL(nextFile)

        setError("")
        setFile(nextFile)
        setSourceUrl(previewUrl)
        setConverted(null)

        try {
            const image = await loadImage(previewUrl)
            const inputFormat = getFormatByMime(nextFile.type)

            setSourceInfo({
                width: image.naturalWidth,
                height: image.naturalHeight,
                format: inputFormat.label,
                mime: inputFormat.mime,
                size: nextFile.size,
                name: nextFile.name,
            })
            setTargetMime(getNextFormat(inputFormat.mime).mime)
        } catch {
            setError("Não foi possível ler esta imagem. Tente outro arquivo.")
            setFile(null)
            setSourceUrl("")
            setSourceInfo(null)
        }
    }

    function handleInputChange(event) {
        const nextFile = event.target.files?.[0]
        void prepareFile(nextFile)
    }

    function handleDrop(event) {
        event.preventDefault()
        setIsDragging(false)

        const nextFile = event.dataTransfer.files?.[0]
        void prepareFile(nextFile)
    }

    function clearAll() {
        setError("")
        setFile(null)
        setSourceUrl("")
        setSourceInfo(null)
        setConverted(null)
        setTargetMime(formats[1].mime)
    }

    async function handleConvert() {
        if (!file || !sourceUrl || !sourceInfo) {
            return
        }

        setIsConverting(true)
        setError("")
        setConverted(null)

        try {
            const image = await loadImage(sourceUrl)
            const canvas = document.createElement("canvas")
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight

            const context = canvas.getContext("2d")

            if (!context) {
                throw new Error("Canvas indisponível.")
            }

            if (targetMime === "image/jpeg") {
                context.fillStyle = "#ffffff"
                context.fillRect(0, 0, canvas.width, canvas.height)
            }

            context.drawImage(image, 0, 0)

            const blob = await new Promise((resolve, reject) => {
                const qualityValue = targetMime === "image/png" ? undefined : 0.92

                canvas.toBlob(
                    (result) => {
                        if (result) {
                            resolve(result)
                            return
                        }

                        reject(new Error("Falha ao gerar o arquivo convertido."))
                    },
                    targetMime,
                    qualityValue
                )
            })

            const outputFormat = getFormatByMime(targetMime)

            setConverted({
                name: buildFileName(file.name, outputFormat.extension),
                size: blob.size,
                url: URL.createObjectURL(blob),
                format: outputFormat.label,
            })
        } catch {
            setError("A conversão falhou. Tente novamente com outra imagem.")
        } finally {
            setIsConverting(false)
        }
    }

    const targetFormat = getFormatByMime(targetMime)

    return (
        <div className="rounded-[2rem] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
            {showTitle && (
                <h3 className="text-3xl font-semibold text-slate-900 dark:text-zinc-50">
                    Converter imagem
                </h3>
            )}

            <div
                className={`grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-stretch ${
                    showTitle ? "mt-8" : ""
                }`}
            >
                <div className="flex h-full flex-col gap-5">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={openPicker}
                        onDragOver={(event) => event.preventDefault()}
                        onDragEnter={() => setIsDragging(true)}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex min-h-72 w-full flex-1 flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition ${
                            isDragging
                                ? "border-slate-900 bg-stone-100 dark:border-zinc-100 dark:bg-zinc-950"
                                : "border-black/10 bg-stone-50 hover:bg-stone-100 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        }`}
                    >
                        {sourceUrl ? (
                            <div className="w-full">
                                <div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900">
                                    <img
                                        src={sourceUrl}
                                        alt="Prévia da imagem original"
                                        className="h-72 w-full object-contain"
                                    />
                                </div>

                                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                    <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:text-zinc-300">
                                        {sourceInfo?.format}
                                    </span>
                                    <span className="text-sm text-slate-600 dark:text-zinc-400">
                                        {sourceInfo?.width} x {sourceInfo?.height}
                                    </span>
                                    <span className="text-sm text-slate-600 dark:text-zinc-400">
                                        {sourceInfo ? formatBytes(sourceInfo.size) : ""}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                                    <FaUpload size={20} />
                                </div>
                                <p className="mt-5 text-lg font-semibold text-slate-900 dark:text-zinc-50">
                                    Arraste sua imagem aqui
                                </p>
                                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-zinc-400">
                                    Ou clique para escolher um arquivo PNG, JPG ou WebP.
                                </p>
                            </>
                        )}
                    </button>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={openPicker}
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-stone-100 dark:border-white/10 dark:hover:bg-zinc-950"
                        >
                            <FaUpload size={13} />
                            Escolher arquivo
                        </button>

                        <button
                            type="button"
                            onClick={clearAll}
                            disabled={!file && !converted}
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100 dark:border-white/10 dark:hover:bg-zinc-950"
                        >
                            <FaTrashAlt size={13} />
                            Limpar
                        </button>
                    </div>
                </div>

                <div className="flex h-full flex-col gap-6 rounded-[1.75rem] border border-black/10 bg-stone-50 p-6 dark:border-white/10 dark:bg-zinc-950">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">
                            Formato de saída
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            {formats.map((format) => (
                                <button
                                    key={format.mime}
                                    type="button"
                                    onClick={() => setTargetMime(format.mime)}
                                    disabled={!file}
                                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                        targetMime === format.mime
                                            ? "border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                                            : "border-black/10 bg-white text-slate-700 hover:bg-stone-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                    }`}
                                >
                                    {format.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {targetMime === "image/jpeg" && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                            Areas transparentes serao preenchidas com branco ao converter para JPG.
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleConvert}
                        disabled={!file || isConverting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaExchangeAlt size={13} />
                        {isConverting ? "Convertendo..." : `Converter para ${targetFormat.label}`}
                    </button>

                    <div className="mt-auto rounded-[1.5rem] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
                                <FaImage size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                    Arquivo convertido
                                </p>
                                <p className="text-sm text-slate-600 dark:text-zinc-400">
                                    {converted
                                        ? `${converted.format} • ${formatBytes(converted.size)}`
                                        : "Converta um arquivo para liberar o download."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-black/10 bg-stone-50 dark:border-white/10 dark:bg-zinc-950">
                            {converted ? (
                                <img
                                    src={converted.url}
                                    alt="Preview da imagem convertida"
                                    className="h-56 w-full object-contain"
                                />
                            ) : (
                                <div className="flex h-56 items-center justify-center px-6 text-center text-sm leading-6 text-slate-500 dark:text-zinc-400">
                                    A prévia do arquivo convertido aparece aqui depois da
                                    conversão.
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => converted && downloadFile(converted.url, converted.name)}
                            disabled={!converted}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100 dark:border-white/10 dark:hover:bg-zinc-800"
                        >
                            <FaDownload size={13} />
                            Baixar arquivo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
