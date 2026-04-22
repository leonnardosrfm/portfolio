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
                    <span className="section-kicker">Workspace</span>
                    <h1 className="section-title mx-auto max-w-3xl">
                        Um conjunto enxuto de utilidades para arquivos do dia a dia.
                    </h1>
                    <p className="section-lead mx-auto mt-6">
                        Conversão, edição leve e manipulação de PDF e imagem no próprio
                        navegador, com uma interface mais organizada e direta.
                    </p>
                </section>

                <UtilitiesSection standalone />
            </main>

            <Footer />
        </div>
    )
}
