import { FaMoon, FaSun } from "react-icons/fa"

const navItemsByPage = {
    home: [
        { label: "Início", href: "#home" },
        { label: "Sobre", href: "#sobre" },
        { label: "Habilidades", href: "#skills" },
        { label: "Projetos", href: "#projetos" },
        { label: "Utilidades", href: "/utilities/" },
        { label: "Contato", href: "#contato" },
    ],
    utilities: [
        { label: "Início", href: "/" },
        { label: "Sobre", href: "/#sobre" },
        { label: "Habilidades", href: "/#skills" },
        { label: "Projetos", href: "/#projetos" },
        { label: "Utilidades", href: "/utilities/", current: true },
        { label: "Contato", href: "/#contato" },
    ],
}

export default function Header({ theme, toggleTheme, page = "home" }) {
    const circularText = `• Leonnardo • Leonnardo `
    const navItems = navItemsByPage[page] ?? navItemsByPage.home

    return (
        <header className="border-b border-black/10 dark:border-white/10">
            <div className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-5">
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

                <div className="flex flex-1 items-center justify-end">
                    <nav className="hidden items-center gap-10 text-sm font-medium md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`transition ${
                                    item.current
                                        ? "text-slate-950 dark:text-white"
                                        : "hover:opacity-60"
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Alternar tema"
                        className="ml-6 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-slate-700 transition hover:bg-zinc-100 md:ml-16 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                        {theme === "light" ? <FaMoon size={12} /> : <FaSun size={14} />}
                    </button>
                </div>
            </div>
        </header>
    )
}
