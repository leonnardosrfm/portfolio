import { useEffect, useRef, useState } from "react"
import { FaDownload, FaExchangeAlt, FaImage, FaTrashAlt, FaUpload } from "react-icons/fa"
import {
    getImageUploadHint,
    validateImageDimensions,
    validateImageFile,
} from "../lib/upload-security"
import { downloadUrl, formatBytes } from "../lib/file-utils"

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

export default function ImageConverter({ showTitle = true }) {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState("")
    const [file, setFile] = useState(null)
    const [sourceUrl, setSourceUrl] = useState("")
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

        const validationMessage = validateImageFile(nextFile)

        if (validationMessage) {
            setError(validationMessage)
            return
        }

        const previewUrl = URL.createObjectURL(nextFile)

        setError("")
        setFile(nextFile)
        setSourceUrl(previewUrl)
        setConverted(null)
        setTargetMime(getNextFormat(nextFile.type).mime)

        try {
            const image = await loadImage(previewUrl)
            const dimensionsMessage = validateImageDimensions(image, nextFile.name)

            if (dimensionsMessage) {
                throw new Error(dimensionsMessage)
            }
        } catch (error) {
            setError(
                error instanceof Error && error.message
                    ? error.message
                    : "Não foi possível ler esta imagem. Tente outro arquivo."
            )
            setFile(null)
            setSourceUrl("")
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
        setConverted(null)
        setTargetMime(formats[1].mime)
    }

    async function handleConvert() {
        if (!file || !sourceUrl) {
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
                canvas.toBlob(
                    (result) => {
                        if (result) {
                            resolve(result)
                            return
                        }

                        reject(new Error("Falha ao gerar o arquivo convertido."))
                    },
                    targetMime,
                    targetMime === "image/png" ? undefined : 0.92
                )
            })

            const outputFormat = getFormatByMime(targetMime)

            setConverted({
                name: buildFileName(file.name, outputFormat.extension),
                size: blob.size,
                url: URL.createObjectURL(blob),
                format: outputFormat.label,
            })
        } catch (error) {
            setError(
                error instanceof Error && error.message
                    ? error.message
                    : "A conversão falhou. Tente novamente com outra imagem."
            )
        } finally {
            setIsConverting(false)
        }
    }

    const targetFormat = getFormatByMime(targetMime)

    return (
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            {showTitle && (
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">
                    Converter imagem
                </h3>
            )}

            <div className={`space-y-5 ${showTitle ? "mt-6" : ""}`}>
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
                    className={`flex min-h-52 w-full flex-col items-center justify-center rounded-[1rem] border-2 border-dashed px-6 py-10 text-center transition ${
                        isDragging
                            ? "border-slate-900 bg-stone-100 dark:border-zinc-100 dark:bg-zinc-950"
                            : "border-black/10 bg-stone-50 hover:bg-stone-100 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                    }`}
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                        {file ? <FaImage size={18} /> : <FaUpload size={18} />}
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-900 dark:text-zinc-50">
                        {file ? file.name : "Selecione uma imagem"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                        {file
                            ? formatBytes(file.size)
                            : `${getImageUploadHint()} Clique ou arraste o arquivo.`}
                    </p>
                </button>

                <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                        Formato de saída
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {formats.map((format) => (
                            <button
                                key={format.mime}
                                type="button"
                                onClick={() => setTargetMime(format.mime)}
                                disabled={!file}
                                className={`rounded-xl border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                    targetMime === format.mime
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                                        : "border-black/10 bg-white text-slate-700 hover:bg-stone-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {format.label}
                            </button>
                        ))}
                    </div>
                </div>

                {targetMime === "image/jpeg" && file && (
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                        Transparências serão preenchidas com branco ao converter para JPG.
                    </p>
                )}

                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                        {error}
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleConvert}
                        disabled={!file || isConverting}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaExchangeAlt size={13} />
                        {isConverting ? "Convertendo..." : `Converter para ${targetFormat.label}`}
                    </button>

                    <button
                        type="button"
                        onClick={() => converted && downloadUrl(converted.url, converted.name)}
                        disabled={!converted}
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaDownload size={13} />
                        {converted ? `Baixar ${converted.format}` : "Baixar arquivo"}
                    </button>

                    <button
                        type="button"
                        onClick={clearAll}
                        disabled={!file && !converted}
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaTrashAlt size={13} />
                        Limpar
                    </button>
                </div>

                {converted && (
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                        Arquivo pronto: {converted.format} • {formatBytes(converted.size)}
                    </p>
                )}
            </div>
        </div>
    )
}
