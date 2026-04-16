import Header from "./components/Header"
import Footer from "./components/Footer"
import UtilitiesSection from "./components/UtilitiesSection"
import useTheme from "./hooks/useTheme"

export default function UtilitiesApp() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="min-h-screen bg-stone-50 text-slate-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
                <Header theme={theme} toggleTheme={toggleTheme} page="utilities" />

                <main className="mx-auto max-w-6xl px-6">
                    <section className="py-16">
                        <h1 className="font-serif text-4xl leading-tight text-slate-900 md:text-5xl dark:text-zinc-50">
                            Utilidades
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-zinc-400">
                            Ferramentas simples para conversão e edição de arquivos.
                        </p>
                    </section>

                    <UtilitiesSection standalone />
                </main>

                <Footer />
            </div>
        </div>
    )
}
