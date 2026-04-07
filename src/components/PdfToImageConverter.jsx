import { useEffect, useRef, useState } from "react"
import JSZip from "jszip"
import { FaDownload, FaImages, FaTrashAlt } from "react-icons/fa"
import PdfDropzone from "./PdfDropzone"
import usePdfDocument from "../hooks/usePdfDocument"
import { buildFileName, canvasToBlob, downloadUrl, formatBytes } from "../lib/file-utils"
import { renderPdfPage } from "../lib/pdf-utils"

const imageFormats = [
    { label: "PNG", mime: "image/png", extension: "png" },
    { label: "JPG", mime: "image/jpeg", extension: "jpg" },
    { label: "WebP", mime: "image/webp", extension: "webp" },
]

const qualityOptions = [
    { label: "Padrão", value: 1.5 },
    { label: "Alta", value: 2 },
    { label: "Máxima", value: 2.5 },
]

function buildPageName(fileName, pageNumber, extension) {
    const base = fileName.replace(/\.[^/.]+$/, "")
    return `${base}-página-${String(pageNumber).padStart(2, "0")}.${extension}`
}

export default function PdfToImageConverter() {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [selectedPage, setSelectedPage] = useState("all")
    const [targetMime, setTargetMime] = useState(imageFormats[0].mime)
    const [scale, setScale] = useState(qualityOptions[0].value)
    const [result, setResult] = useState(null)
    const { file, pages, pdf, pageCount, isLoading, error, setError, prepareFile, clearDocument } =
        usePdfDocument()

    useEffect(() => {
        if (!result?.url) {
            return undefined
        }

        return () => {
            URL.revokeObjectURL(result.url)
        }
    }, [result])

    useEffect(() => {
        setSelectedPage("all")
    }, [pageCount])

    function openPicker() {
        if (!inputRef.current) {
            return
        }

        inputRef.current.value = ""
        inputRef.current.click()
    }

    async function handleInputChange(event) {
        setResult(null)
        await prepareFile(event.target.files?.[0])
    }

    async function handleDrop(event) {
        event.preventDefault()
        setIsDragging(false)
        setResult(null)
        await prepareFile(event.dataTransfer.files?.[0])
    }

    function handleClear() {
        setResult(null)
        clearDocument()
    }

    async function handleExport() {
        if (!file || !pdf || !pages.length) {
            return
        }

        setIsExporting(true)
        setError("")

        try {
            const format = imageFormats.find((item) => item.mime === targetMime) ?? imageFormats[0]
            const pageNumbers =
                selectedPage === "all" ? pages.map((page) => page.pageNumber) : [Number(selectedPage)]

            if (pageNumbers.length === 1) {
                const page = await pdf.getPage(pageNumbers[0])
                const rendered = await renderPdfPage(page, { scale })
                const blob = await canvasToBlob(
                    rendered.canvas,
                    format.mime,
                    format.mime === "image/png" ? undefined : 0.92
                )

                setResult({
                    name: buildPageName(file.name, pageNumbers[0], format.extension),
                    size: blob.size,
                    url: URL.createObjectURL(blob),
                })
            } else {
                const zip = new JSZip()

                for (const pageNumber of pageNumbers) {
                    const page = await pdf.getPage(pageNumber)
                    const rendered = await renderPdfPage(page, { scale })
                    const blob = await canvasToBlob(
                        rendered.canvas,
                        format.mime,
                        format.mime === "image/png" ? undefined : 0.92
                    )

                    zip.file(buildPageName(file.name, pageNumber, format.extension), blob)
                }

                const zipBlob = await zip.generateAsync({ type: "blob" })

                setResult({
                    name: buildFileName(file.name, `${format.extension}.zip`),
                    size: zipBlob.size,
                    url: URL.createObjectURL(zipBlob),
                })
            }
        } catch {
            setError("Não foi possível converter este PDF em imagem.")
        } finally {
            setIsExporting(false)
        }
    }

    const targetFormat = imageFormats.find((item) => item.mime === targetMime) ?? imageFormats[0]

    return (
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            <div className="space-y-5">
                <PdfDropzone
                    inputRef={inputRef}
                    isDragging={isDragging}
                    isLoading={isLoading}
                    file={file}
                    pages={pages}
                    onOpenPicker={openPicker}
                    onInputChange={handleInputChange}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                            Formato
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {imageFormats.map((format) => (
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

                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                            Páginas
                        </label>
                        <select
                            value={selectedPage}
                            onChange={(event) => setSelectedPage(event.target.value)}
                            disabled={!file}
                            className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                        >
                            <option value="all">Todas as páginas</option>
                            {pages.map((page) => (
                                <option key={page.pageNumber} value={page.pageNumber}>
                                    Página {page.pageNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                        Qualidade
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {qualityOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setScale(option.value)}
                                disabled={!file}
                                className={`rounded-xl border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                    scale === option.value
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                                        : "border-black/10 bg-white text-slate-700 hover:bg-stone-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                        {error}
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={!file || !pdf || !pages.length || isLoading || isExporting}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaImages size={14} />
                        {isExporting ? "Gerando imagens..." : `Converter para ${targetFormat.label}`}
                    </button>

                    <button
                        type="button"
                        onClick={() => result && downloadUrl(result.url, result.name)}
                        disabled={!result}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaDownload size={13} />
                        Baixar arquivo
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={!file && !result}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaTrashAlt size={13} />
                        Limpar
                    </button>
                </div>

                {result && (
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                        Arquivo pronto: {formatBytes(result.size)}
                    </p>
                )}
            </div>
        </div>
    )
}
