import Header from "./components/Header"
import Footer from "./components/Footer"
import UtilitiesSection from "./components/UtilitiesSection"
import useTheme from "./hooks/useTheme"

export default function UtilitiesApp() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen text-[color:var(--text)] transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} page="utilities" />

            <main className="mx-auto max-w-7xl px-5 md:px-8">
                <section className="section-shell pt-16 text-center md:pt-20">
                    <h1 className="section-kicker mx-auto max-w-3xl">
                        Ferramentas úteis no dia a dia.
                    </h1>
                </section>

                <UtilitiesSection standalone />
            </main>

            <Footer />
        </div>
    )
}
