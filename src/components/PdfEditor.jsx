import { useEffect, useRef, useState } from "react"
import { jsPDF } from "jspdf"
import { FaDownload, FaFilePdf, FaTrashAlt, FaWrench } from "react-icons/fa"
import PdfDropzone from "./PdfDropzone"
import usePdfDocument from "../hooks/usePdfDocument"
import { buildFileName, downloadUrl, formatBytes } from "../lib/file-utils"
import { renderPdfPage } from "../lib/pdf-utils"

const rotations = [
    { label: "0°", value: 0 },
    { label: "90°", value: 90 },
    { label: "180°", value: 180 },
    { label: "270°", value: 270 },
]

function drawRotatedPage(context, sourceCanvas, rotation) {
    const { width, height } = sourceCanvas

    context.save()

    if (rotation === 90) {
        context.translate(height, 0)
        context.rotate(Math.PI / 2)
    } else if (rotation === 180) {
        context.translate(width, height)
        context.rotate(Math.PI)
    } else if (rotation === 270) {
        context.translate(0, width)
        context.rotate(-Math.PI / 2)
    }

    context.drawImage(sourceCanvas, 0, 0)
    context.restore()
}

export default function PdfEditor() {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [watermark, setWatermark] = useState("")
    const [footerNote, setFooterNote] = useState("")
    const [showPageNumbers, setShowPageNumbers] = useState(true)
    const [grayscale, setGrayscale] = useState(false)
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
            let output = null

            for (let index = 0; index < pageCount; index += 1) {
                const page = await pdf.getPage(index + 1)
                const rendered = await renderPdfPage(page, { scale: 1.7 })
                const sourceCanvas = rendered.canvas
                const outputCanvas = document.createElement("canvas")
                const shouldSwapSides = rotation === 90 || rotation === 270

                outputCanvas.width = shouldSwapSides ? sourceCanvas.height : sourceCanvas.width
                outputCanvas.height = shouldSwapSides ? sourceCanvas.width : sourceCanvas.height

                const context = outputCanvas.getContext("2d")

                if (!context) {
                    throw new Error("Canvas indisponível.")
                }

                context.fillStyle = "#ffffff"
                context.fillRect(0, 0, outputCanvas.width, outputCanvas.height)
                context.filter = grayscale ? "grayscale(1)" : "none"
                drawRotatedPage(context, sourceCanvas, rotation)
                context.filter = "none"

                if (watermark.trim()) {
                    context.save()
                    context.translate(outputCanvas.width / 2, outputCanvas.height / 2)
                    context.rotate(-Math.PI / 4)
                    context.textAlign = "center"
                    context.fillStyle = "rgba(15, 23, 42, 0.14)"
                    context.font = `${Math.max(
                        28,
                        Math.round(Math.min(outputCanvas.width, outputCanvas.height) / 10)
                    )}px serif`
                    context.fillText(watermark.trim(), 0, 0)
                    context.restore()
                }

                if (footerNote.trim() || showPageNumbers) {
                    context.fillStyle = "rgba(255, 255, 255, 0.86)"
                    context.fillRect(0, outputCanvas.height - 48, outputCanvas.width, 48)
                    context.fillStyle = "#0f172a"
                    context.font = "16px sans-serif"
                    context.textBaseline = "middle"

                    if (footerNote.trim()) {
                        context.textAlign = "left"
                        context.fillText(footerNote.trim(), 20, outputCanvas.height - 24)
                    }

                    if (showPageNumbers) {
                        context.textAlign = "right"
                        context.fillText(
                            `Página ${index + 1} de ${pageCount}`,
                            outputCanvas.width - 20,
                            outputCanvas.height - 24
                        )
                    }
                }

                const imageData = outputCanvas.toDataURL("image/jpeg", 0.92)
                const orientation =
                    outputCanvas.width > outputCanvas.height ? "landscape" : "portrait"

                if (!output) {
                    output = new jsPDF({
                        orientation,
                        unit: "px",
                        format: [outputCanvas.width, outputCanvas.height],
                    })
                } else {
                    output.addPage([outputCanvas.width, outputCanvas.height], orientation)
                }

                output.addImage(
                    imageData,
                    "JPEG",
                    0,
                    0,
                    outputCanvas.width,
                    outputCanvas.height,
                    undefined,
                    "FAST"
                )
            }

            const blob = output.output("blob")

            setResult({
                name: buildFileName(file.name, "editado.pdf"),
                size: blob.size,
                url: URL.createObjectURL(blob),
            })
        } catch {
            setError("Não foi possível editar este PDF.")
        } finally {
            setIsExporting(false)
        }
    }

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

                <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                        Rotação
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {rotations.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setRotation(option.value)}
                                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                    rotation === option.value
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                                        : "border-black/10 bg-white text-slate-700 hover:bg-stone-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                            Marca d&apos;água
                        </label>
                        <input
                            type="text"
                            value={watermark}
                            onChange={(event) => setWatermark(event.target.value)}
                            placeholder="Ex.: CONFIDENCIAL"
                            className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                            Rodapé
                        </label>
                        <input
                            type="text"
                            value={footerNote}
                            onChange={(event) => setFooterNote(event.target.value)}
                            placeholder="Texto do rodapé"
                            className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-5 text-sm text-slate-700 dark:text-zinc-300">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showPageNumbers}
                            onChange={(event) => setShowPageNumbers(event.target.checked)}
                            className="h-4 w-4 rounded border-black/20"
                        />
                        Mostrar páginas
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={grayscale}
                            onChange={(event) => setGrayscale(event.target.checked)}
                            className="h-4 w-4 rounded border-black/20"
                        />
                        Escala de cinza
                    </label>
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
                        <FaWrench size={13} />
                        {isExporting ? "Aplicando edições..." : "Gerar PDF editado"}
                    </button>

                    <button
                        type="button"
                        onClick={() => result && downloadUrl(result.url, result.name)}
                        disabled={!result}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaDownload size={13} />
                        Baixar PDF
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
                        PDF pronto: {pageCount} página(s) • {formatBytes(result.size)}
                    </p>
                )}
            </div>
        </div>
    )
}
