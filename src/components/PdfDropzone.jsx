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
                {file ? (
                    <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
                            <FaFilePdf size={20} />
                        </div>
                        <p className="mt-5 text-lg font-semibold text-slate-900 dark:text-zinc-50">
                            {file.name}
                        </p>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-zinc-400">
                            {pages.length} página(s) • {formatBytes(file.size)}
                        </p>
                    </>
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
        </>
    )
}
