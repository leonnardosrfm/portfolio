import { FaArrowLeft, FaGithub } from "react-icons/fa"
import Header from "./components/Header"
import Footer from "./components/Footer"
import useTheme from "./hooks/useTheme"

export default function ProjectDetailPage({ project }) {
    const { theme, toggleTheme } = useTheme()

    if (!project) {
        return (
            <div className="min-h-screen text-[color:var(--text)] transition-colors duration-300">
                <Header theme={theme} toggleTheme={toggleTheme} page="project" />

                <main className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
                    <p className="section-kicker">Projeto</p>
                    <h1 className="section-title mt-4">Projeto não encontrado.</h1>
                    <a href="/#projetos" className="pill-button pill-primary mt-8">
                        <FaArrowLeft size={13} />
                        Voltar aos projetos
                    </a>
                </main>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen text-[color:var(--text)] transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} page="project" />

            <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
                <a
                    href="/#projetos"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                >
                    <FaArrowLeft size={13} />
                    Voltar aos projetos
                </a>

                <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                    <div>
                        <h1 className="section-title mt-4">{project.title}</h1>
                        <p className="section-lead mt-6 max-w-3xl">
                            {project.detailedDescription}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pill-button pill-primary"
                            >
                                <FaGithub size={15} />
                                Ver no GitHub
                            </a>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.2rem] border border-[color:var(--line)]">
                        <img
                            src={project.image}
                            alt={project.title}
                            className={`h-64 w-full ${project.imageClassName ?? "object-cover"}`}
                        />
                    </div>
                </section>

                <section className="mt-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[1.1rem] border border-[color:var(--line)] p-5">
                        <h2 className="text-lg font-semibold text-[color:var(--text)]">
                            Implementação
                        </h2>
                        <p className="mt-3 leading-7 text-[color:var(--muted)]">
                            {project.role}
                        </p>
                    </div>

                    <div className="rounded-[1.1rem] border border-[color:var(--line)] p-5">
                        <h2 className="text-lg font-semibold text-[color:var(--text)]">
                            Destaques
                        </h2>
                        <ul className="mt-4 space-y-3 text-[color:var(--muted)]">
                            {project.highlights.map((highlight) => (
                                <li key={highlight} className="flex gap-3 leading-7">
                                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {project.examples && (
                    <section className="mt-12">
                        <h2 className="text-lg font-semibold text-[color:var(--text)]">
                            Exemplos
                        </h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            {project.examples.map((example) => (
                                <article
                                    key={example.endpoint}
                                    className="rounded-[1.1rem] border border-[color:var(--line)] p-5"
                                >
                                    <p className="text-sm font-semibold text-[color:var(--text)]">
                                        {example.title}
                                    </p>
                                    <code className="mt-3 block rounded-lg border border-[color:var(--line)] px-3 py-2 text-xs font-semibold text-[color:var(--muted)]">
                                        {example.endpoint}
                                    </code>
                                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                                        {example.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {project.gallery && (
                    <section className="mt-12">
                        <h2 className="text-lg font-semibold text-[color:var(--text)]">
                            Imagens do projeto
                        </h2>
                        <div className="mt-4 grid gap-5 md:grid-cols-2">
                            {project.gallery.map((image) => (
                                <figure
                                    key={image.src}
                                    className="overflow-hidden rounded-[1.1rem] border border-[color:var(--line)]"
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full bg-white object-cover"
                                    />
                                </figure>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    )
}
