import { useEffect, useState } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import SkillsSection from "./components/SkillsSection"
import ProjectsSection from "./components/ProjectsSection"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"

export default function App() {
    const [theme, setTheme] = useState("light")

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return (
        <div className={theme === "dark" ? "dark" : ""}>
            <div className="min-h-screen bg-stone-50 text-slate-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
                <Header theme={theme} toggleTheme={toggleTheme} />

                <main className="mx-auto max-w-6xl px-6">
                    <Hero />
                    <SkillsSection />
                    <ProjectsSection />
                    <ContactSection />
                </main>

                <Footer />
            </div>
        </div>
    )
}