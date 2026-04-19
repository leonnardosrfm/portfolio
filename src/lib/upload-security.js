import { formatBytes } from "./file-utils"

export const FILE_SECURITY_LIMITS = {
    maxPdfSizeBytes: 20 * 1024 * 1024,
    maxPdfPages: 60,
    maxImageSizeBytes: 15 * 1024 * 1024,
    maxImageCount: 12,
    maxTotalImageSizeBytes: 40 * 1024 * 1024,
    maxImageDimension: 8000,
    maxImagePixels: 32_000_000,
}

export function getPdfUploadHint() {
    return `PDF de até ${formatBytes(FILE_SECURITY_LIMITS.maxPdfSizeBytes)} e ${FILE_SECURITY_LIMITS.maxPdfPages} páginas.`
}

export function getImageUploadHint() {
    return `PNG, JPG ou WebP de até ${formatBytes(FILE_SECURITY_LIMITS.maxImageSizeBytes)} cada.`
}

export function getImageBatchHint() {
    return `Até ${FILE_SECURITY_LIMITS.maxImageCount} imagens por vez e ${formatBytes(FILE_SECURITY_LIMITS.maxTotalImageSizeBytes)} no total.`
}

export function validatePdfFile(file) {
    if (!file) {
        return "Selecione um arquivo PDF."
    }

    if (file.size > FILE_SECURITY_LIMITS.maxPdfSizeBytes) {
        return `O PDF excede o limite de ${formatBytes(FILE_SECURITY_LIMITS.maxPdfSizeBytes)}.`
    }

    return ""
}

export function validatePdfPageCount(pageCount) {
    if (pageCount > FILE_SECURITY_LIMITS.maxPdfPages) {
        return `O PDF tem ${pageCount} páginas. O limite é ${FILE_SECURITY_LIMITS.maxPdfPages} páginas por segurança e desempenho.`
    }

    return ""
}

export function validateImageFile(file) {
    if (!file) {
        return "Selecione uma imagem."
    }

    if (file.size > FILE_SECURITY_LIMITS.maxImageSizeBytes) {
        return `A imagem ${file.name} excede o limite de ${formatBytes(FILE_SECURITY_LIMITS.maxImageSizeBytes)}.`
    }

    return ""
}

export function validateImageBatch(files) {
    if (files.length > FILE_SECURITY_LIMITS.maxImageCount) {
        return `Selecione no máximo ${FILE_SECURITY_LIMITS.maxImageCount} imagens por vez.`
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > FILE_SECURITY_LIMITS.maxTotalImageSizeBytes) {
        return `O total das imagens excede ${formatBytes(FILE_SECURITY_LIMITS.maxTotalImageSizeBytes)}.`
    }

    return ""
}

export function validateImageDimensions(image, fileName = "imagem") {
    if (
        image.naturalWidth > FILE_SECURITY_LIMITS.maxImageDimension ||
        image.naturalHeight > FILE_SECURITY_LIMITS.maxImageDimension
    ) {
        return `${fileName} excede o limite de ${FILE_SECURITY_LIMITS.maxImageDimension}px por lado.`
    }

    if (image.naturalWidth * image.naturalHeight > FILE_SECURITY_LIMITS.maxImagePixels) {
        return `${fileName} excede o limite de ${Intl.NumberFormat("pt-BR").format(FILE_SECURITY_LIMITS.maxImagePixels)} pixels.`
    }

    return ""
}
