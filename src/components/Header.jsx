import { FaMoon, FaSun } from "react-icons/fa"
import { profile } from "../data/site"

export default function Header({ theme, toggleTheme }) {
    const circularText = `• Leonnardo • Leonnardo `

    return (
        <header className="border-b border-black/10 dark:border-white/10">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                <div className="relative h-14 w-14">
                    <svg
                        viewBox="0 0 120 120"
                        className="spin-slow h-full w-full text-slate-700 dark:text-zinc-300"
                        aria-hidden="true"
                    >
                        <defs>
                            <path
                                id="circlePath"
                                d="
                  M 60,60
                  m -42,0
                  a 42,42 0 1,1 84,0
                  a 42,42 0 1,1 -84,0
                "
                            />
                        </defs>

                        <text
                            fill="currentColor"
                            className="text-[13.5px] tracking-[3px] uppercase"
                        >
                            <textPath href="#circlePath" startOffset="0%">
                                {circularText}
                            </textPath>
                        </text>
                    </svg>

                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden gap-10 text-sm font-medium md:flex">
                        <a href="#home" className="transition hover:opacity-60">
                            Home
                        </a>
                        <a href="#sobre" className="transition hover:opacity-60">
                            About
                        </a>
                        <a href="#skills" className="transition hover:opacity-60">
                            Skills
                        </a>
                        <a href="#projetos" className="transition hover:opacity-60">
                            Projects
                        </a>
                        <a href="#contato" className="transition hover:opacity-60">
                            Contact
                        </a>
                    </nav>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Alternar tema"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                        {theme === "light" ? <FaMoon size={12} /> : <FaSun size={14} />}
                    </button>
                </div>
            </div>
        </header>
    )
}