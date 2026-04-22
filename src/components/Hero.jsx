import { FaEnvelope, FaFileAlt, FaGithub, FaLinkedinIn } from "react-icons/fa"
import { profile, socialLinks } from "../data/site"

const iconMap = {
    LinkedIn: FaLinkedinIn,
    GitHub: FaGithub,
    Email: FaEnvelope,
    Currículo: FaFileAlt,
}

export default function Hero() {
    return (
        <section id="home" className="py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,0.82fr)_300px] xl:grid-cols-[minmax(0,0.84fr)_320px]">
                <div className="max-w-2xl text-left">
                    <h1 className="font-serif text-[clamp(2.8rem,5.4vw,4.5rem)] leading-[1.04] tracking-[-0.04em] text-[color:var(--text)]">
                        {profile.name}
                    </h1>

                    <p className="mt-4 max-w-2xl text-[clamp(1.05rem,2.2vw,1.45rem)] leading-[1.5] text-[color:var(--text)]">
                        {profile.tagline}
                    </p>

                    <p
                        id="sobre"
                        className="mt-10 max-w-2xl text-[15px] leading-8 text-[color:var(--muted)] md:text-[17px]"
                    >
                        {profile.about}
                    </p>

                    <div className="mt-10 flex flex-wrap justify-start gap-3">
                        {socialLinks.map((item) => {
                            const Icon = iconMap[item.label]

                            if (!Icon) return null

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    aria-label={item.hoverLabel}
                                    title={item.hoverLabel}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    download={item.download ? true : undefined}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-[0.9rem] border border-[color:var(--line)] px-4 text-sm font-medium text-[color:var(--muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--text)] hover:bg-black/3 dark:hover:bg-white/3"
                                >
                                    <Icon size={16} />
                                    <span>{item.hoverLabel}</span>
                                </a>
                            )
                        })}
                    </div>
                </div>

                <div className="mx-auto w-full max-w-[300px] lg:mx-0 lg:justify-self-end">
                    <div className="aspect-square overflow-hidden rounded-[1.8rem] border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-2.5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:shadow-none">
                        <img
                            src="/ProfileExample.png"
                            alt="Exemplo de foto para o portfólio"
                            className="h-full w-full rounded-[1.35rem] object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
