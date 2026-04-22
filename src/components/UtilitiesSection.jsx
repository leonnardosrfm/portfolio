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
        <div className="rounded-[1rem] border border-[color:var(--line)] p-5">
            <div className="flex min-h-64 flex-col justify-center rounded-[0.85rem] border border-dashed border-[color:var(--line)] px-6 py-10 text-center">
                <p className="text-lg font-semibold text-[color:var(--text)]">
                    Carregando utilitário...
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
        <section id="utilidades" className={standalone ? "pb-24" : "section-shell"}>
            {!standalone && (
                <>
                    <span className="section-kicker">Utilidades</span>
                    <h2 className="section-title mt-4 max-w-3xl">
                        Ferramentas úteis, acessíveis e prontas para uso direto no navegador.
                    </h2>
                    <p className="section-lead mt-6">
                        Mantive a ideia original das utilities, mas trouxe uma organização mais
                        clara para facilitar descoberta e uso.
                    </p>
                </>
            )}

            <div className={`grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start ${standalone ? "" : "mt-10"}`}>
                <div className="rounded-[1rem] border border-[color:var(--line)] p-4">
                    <div className="mb-4 px-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                            Ferramentas
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            Selecione um fluxo para abrir o painel principal.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {utilities.map((utility) => (
                            <button
                                key={utility.id}
                                type="button"
                                onClick={() => setSelectedId(utility.id)}
                                className={`w-full rounded-[0.85rem] border px-3.5 py-3.5 text-left transition ${
                                    selectedUtility.id === utility.id
                                        ? "border-[color:var(--line-strong)] bg-[color:var(--accent-soft)] text-[color:var(--text)]"
                                        : "border-[color:var(--line)] text-[color:var(--text)] hover:bg-black/3 dark:hover:bg-white/3"
                                }`}
                            >
                                <p className="text-sm font-semibold">{utility.title}</p>
                                <p className="mt-2 text-xs text-[color:var(--muted)]">
                                    {utility.supportedFormats.join(" • ")}
                                </p>
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
