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
        <section id="home" className="py-18 md:py-28">
            <div className="mx-auto max-w-6xl">
                <div className="max-w-4xl text-left">
                    <h1 className="font-serif text-[clamp(3.1rem,5.8vw,5rem)] leading-[1.03] tracking-[-0.03em] text-[color:var(--text)]">
                        {profile.name}
                    </h1>

                    <p className="mt-4 max-w-3xl text-[clamp(1.16rem,2.4vw,1.6rem)] leading-[1.5] text-[color:var(--text)]">
                        {profile.tagline}
                    </p>

                    <p
                        id="sobre"
                        className="mt-10 max-w-3xl text-base leading-8 text-[color:var(--muted)] md:text-[1.02rem]"
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
                                    className="inline-flex min-h-12 items-center gap-2 rounded-[0.95rem] border border-[color:var(--line)] px-4.5 text-sm font-medium text-[color:var(--muted)] transition hover:border-[color:var(--line-strong)] hover:text-[color:var(--text)] hover:bg-black/3 dark:hover:bg-white/3"
                                >
                                    <Icon size={17} />
                                    <span>{item.hoverLabel}</span>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
