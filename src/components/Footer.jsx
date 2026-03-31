export default function Footer() {
    return (
        <footer className="border-t border-black/10 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-zinc-400">
            <p>© {new Date().getFullYear()} por Leonnardo Serafim. Site feito em React + Tailwind.</p>
        </footer>
    )
}