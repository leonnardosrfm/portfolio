import { useState } from "react"
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa"

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
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navItems = navItemsByPage[page] ?? navItemsByPage.home

    return (
        <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--header-bg)]/92 backdrop-blur">
            <div className="mx-auto max-w-6xl px-5 py-3.5 md:px-8">
                <div className="flex items-center justify-between gap-6">
                    <a href={page === "home" ? "#home" : "/"} className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                            Portfolio
                        </p>
                        <p className="mt-0.5 flex items-center gap-2 truncate text-[15px] font-semibold text-[color:var(--text)]">
                            <span className="font-mono text-[13px] text-[color:var(--accent)]">&lt;/&gt;</span>
                            <span>Leonnardo Serafim</span>
                        </p>
                    </a>

                    <nav className="hidden items-center gap-5 lg:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-medium transition ${
                                    item.current
                                        ? "text-[color:var(--text)]"
                                        : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Alternar tema"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--text)] transition hover:bg-black/5 dark:hover:bg-white/6"
                        >
                            {theme === "light" ? <FaMoon size={13} /> : <FaSun size={14} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-label="Abrir menu"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--text)] transition hover:bg-black/5 lg:hidden dark:hover:bg-white/6"
                        >
                            {isMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav className="mt-4 grid gap-2 border-t border-[color:var(--line)] pt-4 lg:hidden">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`rounded-lg px-2 py-2 text-sm font-medium transition ${
                                    item.current
                                        ? "text-[color:var(--text)]"
                                        : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    )
}
