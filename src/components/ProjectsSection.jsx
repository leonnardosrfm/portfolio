import { FaGithub, FaExternalLinkAlt } from "react-icons/fa"
import { projects } from "../data/site"

export default function ProjectsSection() {
    return (
        <section id="projetos" className="pb-24">
            <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <h2 className="font-skills text-center text-5xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                    Projects
                </h2>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <div className="grid gap-10 md:grid-cols-2">
                {projects.map((project) => (
                    <article key={project.title}>
                        <div className="mb-5 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                            <img
                                src={project.image}
                                alt={project.title}
                                className={`h-72 w-full ${project.imageClassName ?? "object-cover"}`}
                            />
                        </div>

                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-zinc-100">
                            {project.title}
                        </h3>

                        <p className="mt-3 text-base leading-7 text-slate-700 dark:text-zinc-300">
                            {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-black/10 px-3 py-1 text-sm text-slate-600 dark:border-white/10 dark:text-zinc-300"
                                >
                  {tag}
                </span>
                            ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-white dark:border-white/10 dark:hover:bg-zinc-900"
                            >
                                <FaGithub size={14} />
                                GitHub
                            </a>

                            {project.demo && (
                                <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-white dark:border-white/10 dark:hover:bg-zinc-900"
                                >
                                    <FaExternalLinkAlt size={12} />
                                    Ver projeto
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
