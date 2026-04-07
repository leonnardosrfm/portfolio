import { useEffect, useState } from "react"
import {
    extractPageText,
    isPdfFile,
    loadPdfDocument,
    renderPdfPage,
    revokePagePreviews,
} from "../lib/pdf-utils"

function cleanupDocument(documentState) {
    if (!documentState) {
        return
    }

    revokePagePreviews(documentState.pages)
    documentState.pdf?.destroy?.()
}

export default function usePdfDocument() {
    const [documentState, setDocumentState] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [warning, setWarning] = useState("")

    useEffect(() => () => cleanupDocument(documentState), [documentState])

    async function prepareFile(file) {
        if (!file) {
            return
        }

        if (!isPdfFile(file)) {
            setError("Envie um arquivo PDF válido.")
            return
        }

        setIsLoading(true)
        setError("")
        setWarning("")

        try {
            const loaded = await loadPdfDocument(file)
            const pages = []

            for (let pageNumber = 1; pageNumber <= loaded.pdf.numPages; pageNumber += 1) {
                const page = await loaded.pdf.getPage(pageNumber)
                const preview = await renderPdfPage(page, { scale: 0.45 })
                const text = await extractPageText(page)
                const previewBlob = await new Promise((resolve, reject) => {
                    preview.canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob)
                                return
                            }

                            reject(new Error("Falha ao gerar preview."))
                        },
                        "image/png",
                        0.92
                    )
                })

                pages.push({
                    pageNumber,
                    width: preview.width,
                    height: preview.height,
                    text,
                    previewUrl: URL.createObjectURL(previewBlob),
                })
            }

            setWarning(
                pages.some((page) => page.text.trim())
                    ? ""
                    : "Este PDF parece ser escaneado ou baseado em imagem. As conversões para Word e Excel funcionam melhor em PDFs com texto selecionável."
            )

            setDocumentState({
                file,
                pdf: loaded.pdf,
                pages,
            })
        } catch {
            setDocumentState(null)
            setError("Não foi possível ler este PDF. Tente outro arquivo.")
        } finally {
            setIsLoading(false)
        }
    }

    function clearDocument() {
        setDocumentState(null)
        setIsLoading(false)
        setError("")
        setWarning("")
    }

    return {
        file: documentState?.file ?? null,
        pages: documentState?.pages ?? [],
        pdf: documentState?.pdf ?? null,
        pageCount: documentState?.pages.length ?? 0,
        isLoading,
        error,
        warning,
        setError,
        prepareFile,
        clearDocument,
    }
}
