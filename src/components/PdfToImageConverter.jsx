import { useEffect, useRef, useState } from "react"
import JSZip from "jszip"
import {
    FaDownload,
    FaFileArchive,
    FaImage,
    FaImages,
    FaTrashAlt,
    FaUpload,
} from "react-icons/fa"
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
    { label: "Padrao", value: 1.5 },
    { label: "Alta", value: 2 },
    { label: "Maxima", value: 2.5 },
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
        <div className="rounded-[2rem] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-stretch">
                <div className="flex h-full flex-col gap-5">
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

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={openPicker}
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-stone-100 dark:border-white/10 dark:hover:bg-zinc-950"
                        >
                            <FaUpload size={13} />
                            Escolher PDF
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={!file && !result}
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
                            {imageFormats.map((format) => (
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

                    <div className="rounded-[1.5rem] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <label className="block text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            Páginas para exportar
                        </label>
                        <select
                            value={selectedPage}
                            onChange={(event) => setSelectedPage(event.target.value)}
                            disabled={!file}
                            className="mt-2 w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-40 focus:border-slate-400 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-400"
                        >
                            <option value="all">Todas as páginas</option>
                            {pages.map((page) => (
                                <option key={page.pageNumber} value={page.pageNumber}>
                                    Página {page.pageNumber}
                                </option>
                            ))}
                        </select>

                        <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            Qualidade
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {qualityOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setScale(option.value)}
                                    disabled={!file}
                                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                        scale === option.value
                                            ? "border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                                            : "border-black/10 bg-stone-50 text-slate-700 hover:bg-stone-100 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={!file || !pdf || !pages.length || isLoading || isExporting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaImages size={14} />
                        {isExporting ? "Gerando imagens..." : `Converter para ${targetFormat.label}`}
                    </button>

                    <div className="mt-auto rounded-[1.5rem] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
                                {selectedPage === "all" && pageCount > 1 ? (
                                    <FaFileArchive size={16} />
                                ) : (
                                    <FaImage size={16} />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                    Arquivo de saída
                                </p>
                                <p className="text-sm text-slate-600 dark:text-zinc-400">
                                    {result
                                        ? `${formatBytes(result.size)}`
                                        : "Converta o PDF para liberar o download."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => result && downloadUrl(result.url, result.name)}
                            disabled={!result}
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
