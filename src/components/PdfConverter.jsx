import { useEffect, useRef, useState } from "react"
import { jsPDF } from "jspdf"
import { FaDownload, FaFilePdf, FaTrashAlt, FaUpload } from "react-icons/fa"
import { downloadUrl, formatBytes } from "../lib/file-utils"
import {
    getImageBatchHint,
    getImageUploadHint,
    validateImageBatch,
    validateImageDimensions,
    validateImageFile,
} from "../lib/upload-security"

const acceptedTypes = new Set(["image/png", "image/jpeg", "image/webp"])

function readDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."))
        reader.readAsDataURL(file)
    })
}

function loadImage(source) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error("Não foi possível carregar a imagem."))
        image.src = source
    })
}

function buildPdfName(files) {
    if (files.length === 1) {
        return `${files[0].name.replace(/\.[^/.]+$/, "")}.pdf`
    }

    return "imagens.pdf"
}

export default function PdfConverter() {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState("")
    const [items, setItems] = useState([])
    const [pdfFile, setPdfFile] = useState(null)

    useEffect(() => {
        if (!pdfFile?.url) {
            return undefined
        }

        return () => {
            URL.revokeObjectURL(pdfFile.url)
        }
    }, [pdfFile])

    function openPicker() {
        if (!inputRef.current) {
            return
        }

        inputRef.current.value = ""
        inputRef.current.click()
    }

    async function prepareFiles(fileList) {
        const nextFiles = Array.from(fileList ?? [])

        if (!nextFiles.length) {
            return
        }

        const invalidFile = nextFiles.find((file) => !acceptedTypes.has(file.type))

        if (invalidFile) {
            setError("Envie apenas imagens PNG, JPG ou WebP.")
            return
        }

        const batchValidationMessage = validateImageBatch(nextFiles)

        if (batchValidationMessage) {
            setError(batchValidationMessage)
            return
        }

        setError("")
        setPdfFile(null)

        try {
            const preparedItems = await Promise.all(
                nextFiles.map(async (file) => {
                    const fileValidationMessage = validateImageFile(file)

                    if (fileValidationMessage) {
                        throw new Error(fileValidationMessage)
                    }

                    const sourceUrl = URL.createObjectURL(file)

                    try {
                        const dataUrl = await readDataUrl(file)
                        const image = await loadImage(sourceUrl)
                        const dimensionsMessage = validateImageDimensions(image, file.name)

                        if (dimensionsMessage) {
                            throw new Error(dimensionsMessage)
                        }

                        return {
                            file,
                            dataUrl,
                            width: image.naturalWidth,
                            height: image.naturalHeight,
                        }
                    } finally {
                        URL.revokeObjectURL(sourceUrl)
                    }
                })
            )

            setItems(preparedItems)
        } catch (error) {
            setError(
                error instanceof Error && error.message
                    ? error.message
                    : "Não foi possível preparar os arquivos selecionados."
            )
        }
    }

    function handleInputChange(event) {
        void prepareFiles(event.target.files)
    }

    function handleDrop(event) {
        event.preventDefault()
        setIsDragging(false)
        void prepareFiles(event.dataTransfer.files)
    }

    function clearAll() {
        setItems([])
        setPdfFile(null)
        setError("")
    }

    async function handleGeneratePdf() {
        if (!items.length) {
            return
        }

        setIsGenerating(true)
        setError("")
        setPdfFile(null)

        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4",
            })

            for (const [index, item] of items.entries()) {
                if (index > 0) {
                    pdf.addPage()
                }

                const pageWidth = pdf.internal.pageSize.getWidth()
                const pageHeight = pdf.internal.pageSize.getHeight()
                const ratio = Math.min(pageWidth / item.width, pageHeight / item.height)
                const renderWidth = item.width * ratio
                const renderHeight = item.height * ratio
                const x = (pageWidth - renderWidth) / 2
                const y = (pageHeight - renderHeight) / 2
                const format = item.file.type === "image/png" ? "PNG" : "JPEG"

                pdf.addImage(item.dataUrl, format, x, y, renderWidth, renderHeight)
            }

            const blob = pdf.output("blob")

            setPdfFile({
                name: buildPdfName(items.map((item) => item.file)),
                size: blob.size,
                pages: items.length,
                url: URL.createObjectURL(blob),
            })
        } catch {
            setError("Não foi possível gerar o PDF.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
            <div className="space-y-5">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
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
                        {items.length ? <FaFilePdf size={18} /> : <FaUpload size={18} />}
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-900 dark:text-zinc-50">
                        {items.length
                            ? `${items.length} arquivo(s) selecionado(s)`
                            : "Selecione uma ou mais imagens"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                        {items.length
                            ? items.map((item) => item.file.name).join(", ")
                            : `${getImageUploadHint()} ${getImageBatchHint()} Clique ou arraste os arquivos.`}
                    </p>
                </button>

                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                        {error}
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleGeneratePdf}
                        disabled={!items.length || isGenerating}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaFilePdf size={14} />
                        {isGenerating ? "Gerando PDF..." : "Gerar PDF"}
                    </button>

                    <button
                        type="button"
                        onClick={() => pdfFile && downloadUrl(pdfFile.url, pdfFile.name)}
                        disabled={!pdfFile}
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaDownload size={13} />
                        Baixar PDF
                    </button>

                    <button
                        type="button"
                        onClick={clearAll}
                        disabled={!items.length && !pdfFile}
                        className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-zinc-800"
                    >
                        <FaTrashAlt size={13} />
                        Limpar
                    </button>
                </div>

                {pdfFile && (
                    <p className="text-sm text-slate-600 dark:text-zinc-400">
                        PDF pronto: {pdfFile.pages} página(s) • {formatBytes(pdfFile.size)}
                    </p>
                )}
            </div>
        </div>
    )
}
