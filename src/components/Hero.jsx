import { FaLinkedinIn, FaGithub, FaEnvelope, FaFileAlt } from "react-icons/fa"
import { profile, socialLinks } from "../data/site"

const iconMap = {
    LinkedIn: FaLinkedinIn,
    GitHub: FaGithub,
    Email: FaEnvelope,
    Currículo: FaFileAlt,
}

export default function Hero() {
    return (
        <section id="home" className="py-24 text-center">
            <h1 className="font-serif text-5xl leading-tight text-slate-900 md:text-7xl dark:text-zinc-50">
                {profile.name}
            </h1>

            <p className="mt-3 font-serif text-xl text-slate-700 md:text-2xl dark:text-zinc-400">
                {profile.tagline}
            </p>

            <div id="sobre" className="mx-auto mt-12 max-w-3xl">
                <p className="font-clean text-lg leading-8 text-slate-700 dark:text-zinc-300">
                    {profile.about}
                </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {socialLinks.map((item) => {
                    const Icon = iconMap[item.label]

                    if (!Icon) return null

                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            aria-label={item.label}
                            title={item.hoverLabel}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            download={item.download ? true : undefined}
                            className="group flex h-11 w-11 items-center justify-start overflow-hidden rounded-full border border-black/10 bg-white/70 px-3 text-slate-700 transition-all duration-300 hover:w-[170px] hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
              <span className="flex min-w-[18px] items-center justify-center">
                <Icon size={17} />
              </span>

                            <span className="ml-0 w-0 overflow-hidden whitespace-nowrap text-left text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:w-[110px] group-hover:opacity-100">
                {item.hoverLabel}
              </span>
                        </a>
                    )
                })}
            </div>
        </section>
    )
}