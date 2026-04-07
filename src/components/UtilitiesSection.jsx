import { Suspense, lazy, useState } from "react"
import ImageConverter from "./ImageConverter"
import { utilities } from "../data/site"

const PdfConverter = lazy(() => import("./PdfConverter"))
const PdfEditor = lazy(() => import("./PdfEditor"))
const PdfToExcelConverter = lazy(() => import("./PdfToExcelConverter"))
const PdfToImageConverter = lazy(() => import("./PdfToImageConverter"))
const PdfToWordConverter = lazy(() => import("./PdfToWordConverter"))

function UtilityPanelFallback() {
    return (
        <div className="rounded-[2rem] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-900">
            <div className="flex min-h-[32rem] flex-col justify-center rounded-[1.75rem] border border-dashed border-black/10 bg-stone-50 px-6 py-10 text-center dark:border-white/10 dark:bg-zinc-950">
                <p className="text-lg font-semibold text-slate-900 dark:text-zinc-50">
                    Carregando utilitário...
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                    Os conversores PDF são carregados sob demanda para deixar a página mais leve.
                </p>
            </div>
        </div>
    )
}

export default function UtilitiesSection({ standalone = false }) {
    const [selectedId, setSelectedId] = useState(utilities[0]?.id ?? "")
    const selectedUtility = utilities.find((utility) => utility.id === selectedId) ?? utilities[0]

    const componentMap = {
        "image-converter": ImageConverter,
        "pdf-converter": PdfConverter,
        "pdf-to-word": PdfToWordConverter,
        "pdf-to-excel": PdfToExcelConverter,
        "pdf-editor": PdfEditor,
        "pdf-to-image": PdfToImageConverter,
    }

    const SelectedComponent = componentMap[selectedUtility.id] ?? ImageConverter

    return (
        <section id="utilidades" className="pb-24">
            {!standalone && (
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                    <h2 className="font-skills text-center text-5xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                        Utilities
                    </h2>
                    <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
                <div className="rounded-[2rem] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                    <div className="space-y-3">
                        {utilities.map((utility) => (
                            <button
                                key={utility.id}
                                type="button"
                                onClick={() => setSelectedId(utility.id)}
                                className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                                    selectedUtility.id === utility.id
                                        ? "border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                                        : "border-black/10 bg-white text-slate-900 hover:bg-stone-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                                <p className="text-lg font-semibold">{utility.title}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {utility.supportedFormats.map((format) => (
                                        <span
                                            key={format}
                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                                selectedUtility.id === utility.id
                                                    ? "border-white/20 text-white dark:border-zinc-950/20 dark:text-zinc-950"
                                                    : "border-black/10 text-slate-600 dark:border-white/10 dark:text-zinc-300"
                                            }`}
                                        >
                                            {format}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <Suspense fallback={<UtilityPanelFallback />}>
                    <SelectedComponent showTitle={false} />
                </Suspense>
            </div>
        </section>
    )
}
