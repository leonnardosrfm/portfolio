import { FaFilePdf, FaUpload } from "react-icons/fa"
import { formatBytes } from "../lib/file-utils"

export default function PdfDropzone({
    inputRef,
    isDragging,
    isLoading,
    file,
    pages,
    onOpenPicker,
    onInputChange,
    onDragEnter,
    onDragLeave,
    onDrop,
}) {
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={onInputChange}
                className="hidden"
            />

            <button
                type="button"
                onClick={onOpenPicker}
                onDragOver={(event) => event.preventDefault()}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex min-h-72 w-full flex-1 flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition ${
                    isDragging
                        ? "border-slate-900 bg-stone-100 dark:border-zinc-100 dark:bg-zinc-950"
                        : "border-black/10 bg-stone-50 hover:bg-stone-100 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                }`}
            >
                {pages.length ? (
                    <div className="w-full">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {pages.map((page) => (
                                <div
                                    key={page.pageNumber}
                                    className="overflow-hidden rounded-[1.25rem] border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900"
                                >
                                    <img
                                        src={page.previewUrl}
                                        alt={`Prévia da página ${page.pageNumber}`}
                                        className="h-40 w-full object-contain"
                                    />
                                    <div className="border-t border-black/10 px-4 py-3 text-left text-sm text-slate-600 dark:border-white/10 dark:text-zinc-300">
                                        <p className="font-medium text-slate-900 dark:text-zinc-100">
                                            Pagina {page.pageNumber}
                                        </p>
                                        <p className="mt-1">
                                            {page.width} x {page.height}
                                        </p>
                                        <p className="mt-1 truncate">
                                            {page.text.trim()
                                                ? `${page.text.slice(0, 72)}${
                                                      page.text.length > 72 ? "..." : ""
                                                  }`
                                                : "Sem texto extraível"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                            {isLoading ? <FaFilePdf size={20} /> : <FaUpload size={20} />}
                        </div>
                        <p className="mt-5 text-lg font-semibold text-slate-900 dark:text-zinc-50">
                            {isLoading ? "Lendo PDF..." : "Arraste seu PDF aqui"}
                        </p>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-zinc-400">
                            {isLoading
                                ? "Estou renderizando as páginas e extraindo o texto do arquivo."
                                : "Ou clique para escolher um arquivo PDF do seu dispositivo."}
                        </p>
                    </>
                )}
            </button>

            {file && (
                <div className="rounded-[1.5rem] border border-black/10 bg-stone-50 px-4 py-3 text-left text-sm text-slate-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300">
                    <p className="font-medium text-slate-900 dark:text-zinc-100">{file.name}</p>
                    <p className="mt-1">
                        {pages.length} página(s) • {formatBytes(file.size)}
                    </p>
                </div>
            )}
        </>
    )
}
