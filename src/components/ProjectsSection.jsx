import { FaExternalLinkAlt, FaGithub } from "react-icons/fa"
import { projects } from "../data/site"

export default function ProjectsSection() {
    return (
        <section id="projetos" className="section-shell">
            <div className="text-center">
                <p className="section-kicker">Projetos</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                    <article
                        key={project.title}
                        className="flex h-full flex-col rounded-[1.2rem] border border-[color:var(--line)]"
                    >
                        <div className="overflow-hidden rounded-t-[1.2rem]">
                            <img
                                src={project.image}
                                alt={project.title}
                                className={`h-52 w-full ${project.imageClassName ?? "object-cover"}`}
                            />
                        </div>

                        <div className="flex flex-1 flex-col p-5 text-center">
                            <h3 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[color:var(--text)]">
                                {project.title}
                            </h3>
                            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[color:var(--muted)] md:text-base">
                                {project.description}
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap justify-center gap-5 text-sm font-semibold">
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                                >
                                    <FaGithub size={14} />
                                    GitHub
                                </a>

                                {project.demo && (
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                                    >
                                        <FaExternalLinkAlt size={12} />
                                        Ver projeto
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
