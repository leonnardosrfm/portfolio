let pdfModulePromise = null

async function getPdfModule() {
    if (!pdfModulePromise) {
        pdfModulePromise = Promise.all([
            import("pdfjs-dist"),
            import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        ]).then(([pdfModule, workerModule]) => {
            pdfModule.GlobalWorkerOptions.workerSrc = workerModule.default
            return pdfModule
        })
    }

    return pdfModulePromise
}

function flushTextLine(lines, buffer) {
    if (!buffer.length) {
        return
    }

    lines.push(buffer.join(" ").replace(/\s+/g, " ").trim())
    buffer.length = 0
}

export function isPdfFile(file) {
    if (!file) {
        return false
    }

    return file.type === "application/pdf" || /\.pdf$/i.test(file.name)
}

export async function loadPdfDocument(file) {
    const pdfModule = await getPdfModule()
    const data = new Uint8Array(await file.arrayBuffer())
    const task = pdfModule.getDocument({ data })
    const pdf = await task.promise

    return { pdf }
}

export async function extractPageText(page) {
    const textContent = await page.getTextContent()
    const lines = []
    const buffer = []
    let lastY = null

    for (const item of textContent.items) {
        if (!("str" in item)) {
            continue
        }

        const value = item.str.replace(/\s+/g, " ").trim()
        const currentY = Math.round(item.transform[5])

        if (lastY !== null && Math.abs(currentY - lastY) > 4) {
            flushTextLine(lines, buffer)
        }

        if (value) {
            buffer.push(value)
        }

        lastY = currentY

        if (item.hasEOL) {
            flushTextLine(lines, buffer)
        }
    }

    flushTextLine(lines, buffer)

    return lines.join("\n").trim()
}

export async function renderPdfPage(page, { scale = 1, background = "rgb(255, 255, 255)" } = {}) {
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d", { alpha: false })

    if (!context) {
        throw new Error("Canvas indisponível.")
    }

    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)

    await page.render({
        canvasContext: context,
        viewport,
        background,
    }).promise

    return {
        canvas,
        width: canvas.width,
        height: canvas.height,
    }
}

export function revokePagePreviews(pages) {
    pages.forEach((page) => {
        if (page.previewUrl) {
            URL.revokeObjectURL(page.previewUrl)
        }
    })
}

export function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}

export function buildWordDocumentHtml(fileName, pages) {
    const sections = pages
        .map((page) => {
            const content = page.text.trim()
                ? escapeHtml(page.text).replaceAll("\n", "<br />")
                : "<em>Sem texto extraível nesta página.</em>"

            return `
                <section class="page">
                    <h2>Pagina ${page.pageNumber}</h2>
                    <div class="content">${content}</div>
                </section>
            `
        })
        .join("")

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>${escapeHtml(fileName)}</title>
                <style>
                    body {
                        font-family: Calibri, Arial, sans-serif;
                        margin: 32px;
                        color: #1f2937;
                    }

                    h1 {
                        margin-bottom: 8px;
                        font-size: 24px;
                    }

                    p {
                        color: #475569;
                    }

                    .page {
                        margin-top: 28px;
                        padding-top: 20px;
                        border-top: 1px solid #cbd5e1;
                    }

                    .content {
                        margin-top: 14px;
                        line-height: 1.7;
                    }
                </style>
            </head>
            <body>
                <h1>${escapeHtml(fileName)}</h1>
                <p>
                    Arquivo Word compatível gerado a partir da extração de texto do PDF.
                </p>
                ${sections}
            </body>
        </html>
    `
}

export function buildExcelWorkbookHtml(fileName, rows) {
    const tableRows = rows
        .map(
            (row) => `
                <tr>
                    <td>${row.pageNumber}</td>
                    <td>${row.lineNumber}</td>
                    <td>${escapeHtml(row.content)}</td>
                </tr>
            `
        )
        .join("")

    return `
        <!doctype html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8" />
                <title>${escapeHtml(fileName)}</title>
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>PDF</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines />
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }

                    th, td {
                        border: 1px solid #cbd5e1;
                        padding: 8px;
                        text-align: left;
                        vertical-align: top;
                    }

                    th {
                        background: #e2e8f0;
                        font-weight: 700;
                    }

                    td {
                        mso-number-format: "\\@";
                    }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th>Pagina</th>
                            <th>Linha</th>
                            <th>Conteudo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
        </html>
    `
}
