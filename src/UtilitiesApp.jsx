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
                    <section className="py-24">
                        <h1 className="font-serif text-5xl leading-tight text-slate-900 md:text-7xl dark:text-zinc-50">
                            Utilities
                        </h1>
                    </section>

                    <UtilitiesSection standalone />
                </main>

                <Footer />
            </div>
        </div>
    )
}
