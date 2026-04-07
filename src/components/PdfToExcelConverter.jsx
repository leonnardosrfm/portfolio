import { useEffect, useRef, useState } from "react"
import { FaDownload, FaFileExcel, FaTable, FaTrashAlt, FaUpload } from "react-icons/fa"
import PdfDropzone from "./PdfDropzone"
import usePdfDocument from "../hooks/usePdfDocument"
import { buildFileName, downloadUrl, formatBytes } from "../lib/file-utils"
import { buildExcelWorkbookHtml } from "../lib/pdf-utils"

function buildRowsFromPages(pages) {
    return pages.flatMap((page) => {
        const lines = page.text
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)

        if (!lines.length) {
            return [
                {
                    pageNumber: page.pageNumber,
                    lineNumber: 1,
                    content: "[Sem texto extraível]",
                },
            ]
        }

        return lines.map((line, index) => ({
            pageNumber: page.pageNumber,
            lineNumber: index + 1,
            content: line,
        }))
    })
}

export default function PdfToExcelConverter() {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [result, setResult] = useState(null)
    const { file, pages, pageCount, isLoading, error, warning, setError, prepareFile, clearDocument } =
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
        if (!file || !pages.length) {
            return
        }

        setIsExporting(true)
        setError("")

        try {
            const rows = buildRowsFromPages(pages)
            const workbook = buildExcelWorkbookHtml(file.name, rows)
            const blob = new Blob(["\ufeff", workbook], {
                type: "application/vnd.ms-excel",
            })

            setResult({
                name: buildFileName(file.name, "xls"),
                size: blob.size,
                rows: rows.length,
                url: URL.createObjectURL(blob),
            })
        } catch {
            setError("Não foi possível gerar o arquivo Excel.")
        } finally {
            setIsExporting(false)
        }
    }

    const rowsCount = buildRowsFromPages(pages).length

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
                    <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            Conversao
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                            Organiza o texto extraído do PDF em linhas compatíveis com Excel.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            Estrutura gerada
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                            {file
                                ? `${pageCount} página(s) • ${rowsCount} linha(s) exportadas`
                                : "Envie um PDF para preparar a planilha."}
                        </p>
                    </div>

                    {warning && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                            {warning}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={!file || !pages.length || isLoading || isExporting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        <FaTable size={14} />
                        {isExporting ? "Gerando XLS..." : "Gerar arquivo Excel"}
                    </button>

                    <div className="mt-auto rounded-[1.5rem] border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
                                <FaFileExcel size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                    Arquivo Excel
                                </p>
                                <p className="text-sm text-slate-600 dark:text-zinc-400">
                                    {result
                                        ? `XLS • ${result.rows} linha(s) • ${formatBytes(result.size)}`
                                        : "Gere o arquivo para liberar o download."}
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
                            Baixar Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
