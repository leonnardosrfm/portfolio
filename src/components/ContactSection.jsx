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
        <section id="contato" className="section-shell pb-16">
            <div className="mx-auto max-w-4xl text-center">
                <div>
                    <p className="section-kicker">Contato</p>
                    <p className="section-lead mx-auto mt-6">
                        Estou buscando uma oportunidade de estágio para continuar evoluindo na
                        prática com backend, APIs e organização de dados.
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <a href={`mailto:${profile.email}`} className="pill-button pill-primary">
                            Enviar email
                        </a>
                        <button
                            type="button"
                            onClick={handleCopyEmail}
                            className="pill-button pill-secondary"
                        >
                            <FaCopy size={12} />
                            {copied ? "Email copiado" : "Copiar email"}
                        </button>
                    </div>
                </div>

                <div className="mt-10 grid gap-5 text-sm sm:grid-cols-2">
                    <div className="text-center">
                        <p className="font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                            Email
                        </p>
                        <a href={`mailto:${profile.email}`} className="mt-2 block text-base text-[color:var(--text)] transition hover:text-[color:var(--accent)]">
                            {profile.email}
                        </a>
                    </div>

                    <div className="text-center">
                        <p className="font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                            LinkedIn
                        </p>
                        <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block text-base text-[color:var(--text)] transition hover:text-[color:var(--accent)]"
                        >
                            linkedin.com/in/leonnardo-serafim
                        </a>
                    </div>

                    <div className="text-center">
                        <p className="font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                            GitHub
                        </p>
                        <a
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block text-base text-[color:var(--text)] transition hover:text-[color:var(--accent)]"
                        >
                            github.com/leonnardosrfm
                        </a>
                    </div>

                    <div className="text-center">
                        <p className="font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                            Telefone
                        </p>
                        <a
                            href="tel:(11) 99309-5728"
                            className="mt-2 block text-base text-[color:var(--text)] transition hover:text-[color:var(--accent)]"
                        >
                            (11) 99309-5728
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
