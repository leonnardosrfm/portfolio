import { useState } from "react"
import { FaCopy } from "react-icons/fa"
import { profile } from "../data/site"

export default function ContactSection() {
    const [copied, setCopied] = useState(false)

    async function handleCopyEmail() {
        try {
            await navigator.clipboard.writeText(profile.email)
            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (error) {
            console.error("Erro ao copiar email:", error)
        }
    }

    return (
        <section
            id="contato"
            className="border-t border-black/10 py-16 text-center dark:border-white/10"
        >
            <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <h2 className="font-skills text-center text-5xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                    Contact
                </h2>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <div className="mt-8 space-y-4 text-lg text-slate-700 dark:text-zinc-300">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="font-medium text-slate-900 dark:text-zinc-100">Email:</span>

                        <a
                            href={`mailto:${profile.email}`}
                            className="transition hover:text-slate-950 hover:underline dark:hover:text-white"
                        >
                            {profile.email}
                        </a>

                        <button
                            type="button"
                            onClick={handleCopyEmail}
                            aria-label="Copiar email"
                            title={copied ? "Copiado!" : "Copiar email"}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-sm text-slate-700 transition hover:bg-white hover:text-slate-950 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <FaCopy size={14} />
                        </button>
                    </div>

                    {copied && (
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Email copiado!</p>
                    )}
                </div>

                <p>
                    <span className="font-medium text-slate-900 dark:text-zinc-100">LinkedIn:</span>{" "}
                    <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-slate-950 hover:underline dark:hover:text-white"
                    >
                        linkedin.com/in/leonnardo-serafim
                    </a>
                </p>

                <p>
                    <span className="font-medium text-slate-900 dark:text-zinc-100">GitHub:</span>{" "}
                    <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-slate-950 hover:underline dark:hover:text-white"
                    >
                        github.com/leonnardosrfm
                    </a>
                </p>

                <p>
                    <span className="font-medium text-slate-900 dark:text-zinc-100">Telefone:</span>{" "}
                    <a
                        href="tel:(11) 99309-5728"
                        className="transition hover:text-slate-950 hover:underline dark:hover:text-white"
                    >
                        (11) 99309-5728
                    </a>
                </p>
            </div>
        </section>
    )
}