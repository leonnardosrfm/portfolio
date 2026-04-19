import { useEffect, useState } from "react"
import { extractPageText, isPdfFile, loadPdfDocument } from "../lib/pdf-utils"
import { validatePdfFile } from "../lib/upload-security"

function cleanupDocument(documentState) {
    if (!documentState) {
        return
    }

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

        const validationMessage = validatePdfFile(file)

        if (validationMessage) {
            setError(validationMessage)
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
                const text = await extractPageText(page)

                pages.push({
                    pageNumber,
                    text,
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
        } catch (error) {
            setDocumentState(null)
            setError(
                error instanceof Error && error.message
                    ? error.message
                    : "Não foi possível ler este PDF. Tente outro arquivo."
            )
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
