export default function Footer() {
    return (
        <footer className="border-t border-[color:var(--line)] px-5 py-8 text-sm text-[color:var(--muted)] md:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Leonnardo Serafim.</p>
                <p>Portfolio em React + Tailwind.</p>
            </div>
        </footer>
    )
}
