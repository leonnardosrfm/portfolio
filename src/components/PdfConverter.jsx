import { useEffect, useRef, useState } from "react"
import { jsPDF } from "jspdf"
import { FaDownload, FaFilePdf, FaImage, FaTrashAlt, FaUpload } from "react-icons/fa"

const acceptedTypes = new Set(["image/png", "image/jpeg", "image/webp"])

function formatBytes(value) {
    if (!value) {
        return "0 KB"
    }

    const units = ["B", "KB", "MB", "GB"]
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
    const amount = value / 1024 ** index

    return `${amount.toFixed(amount >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

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

function downloadFile(url, fileName) {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()
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

        setError("")
        setPdfFile(null)

        try {
            const preparedItems = await Promise.all(
                nextFiles.map(async (file) => {
                    const previewUrl = URL.createObjectURL(file)
                    const dataUrl = await readDataUrl(file)
                    const image = await loadImage(previewUrl)

                    return {
                        file,
                        previewUrl,
                        dataUrl,
                        width: image.naturalWidth,
                        height: image.naturalHeight,
                    }
                })
            )

            setItems((current) => {
                current.forEach((item) => URL.revokeObjectURL(item.previewUrl))
                return preparedItems
            })
        } catch {
            setError("Não foi possível preparar os arquivos selecionados.")
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
        items.forEach((item) => URL.revokeObjectURL(item.previewUrl))
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
        <div className="rounded-[2rem] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-stretch">
                <div className="flex h-full flex-col gap-5">
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
                        className={`flex min-h-72 w-full flex-1 flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition ${
                            isDragging
                                ? "border-slate-900 bg-stone-100 dark:border-zinc-100 dark:bg-zinc-950"
                                : "border-black/10 bg-stone-50 hover:bg-stone-100 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        }`}
                    >
                        {items.length ? (
                            <div className="w-full">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.file.name}-${item.file.size}`}
                                            className="overflow-hidden rounded-[1.25rem] border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900"
                                        >
                                            <img
                                                src={item.previewUrl}
                                                alt={item.file.name}
                                                className="h-40 w-full object-contain"
                                            />
                                            <div className="border-t border-black/10 px-4 py-3 text-left text-sm text-slate-600 dark:border-white/10 dark:text-zinc-300">
                                                <p className="truncate font-medium text-slate-900 dark:text-zinc-100">
                                                    {item.file.name}
                                                </p>
                                                <p className="mt-1">
                                                    {item.width} x {item.height} •{" "}
                                                    {formatBytes(item.file.size)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                                    <FaUpload size={20} />
                                </div>
                                <p className="mt-5 text-lg font-semibold text-slate-900 dark:text-zinc-50">
                                    Arraste imagens aqui
                                </p>
                                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-zinc-400">
                                    Ou clique para escolher uma ou mais imagens PNG, JPG ou WebP.
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
                            Escolher arquivos
                        </button>

                        <button
                            type="button"
                            onClick={clearAll}
                            disabled={!items.length && !pdfFile}
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100 dark:border-white/10 dark:hover:bg-zinc-950"
                        >
                            <FaTrashAlt size={13} />
                            Limpar
                        </button>
                    </div>
                </div>

                <div className="flex h-full flex-col gap-6 rounded-[1.75rem] border border-black/10 bg-stone-50 p-6 dark:border-white/10 dark:bg-zinc-950">
                    <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            Arquivos
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                            {items.length ? `${items.length} imagem(ns)` : "Nenhum arquivo"}
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleGeneratePdf}
                        disabled={!items.length || isGenerating}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaFilePdf size={14} />
                        {isGenerating ? "Gerando PDF..." : "Gerar PDF"}
                    </button>

                    <div className="mt-auto rounded-[1.5rem] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
                                <FaImage size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                    PDF gerado
                                </p>
                                <p className="text-sm text-slate-600 dark:text-zinc-400">
                                    {pdfFile
                                        ? `${pdfFile.pages} página(s) • ${formatBytes(pdfFile.size)}`
                                        : "Gere um PDF para liberar o download."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => pdfFile && downloadFile(pdfFile.url, pdfFile.name)}
                            disabled={!pdfFile}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100 dark:border-white/10 dark:hover:bg-zinc-800"
                        >
                            <FaDownload size={13} />
                            Baixar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
