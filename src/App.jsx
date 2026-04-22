import Header from "./components/Header"
import Hero from "./components/Hero"
import SkillsSection from "./components/SkillsSection"
import ProjectsSection from "./components/ProjectsSection"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"
import useTheme from "./hooks/useTheme"

export default function App() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen text-[color:var(--text)] transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} page="home" />

            <main className="mx-auto max-w-7xl px-5 md:px-8">
                <Hero />
                <SkillsSection />
                <ProjectsSection />
                <ContactSection />
            </main>

            <Footer />
        </div>
    )
}
