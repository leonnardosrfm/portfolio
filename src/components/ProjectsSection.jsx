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
                        <div
                            className={`mb-5 h-72 rounded-2xl border border-black/10 bg-gradient-to-br ${project.imageClass} dark:border-white/10 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800`}
                        />

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

                        <a
                            href={project.link}
                            className="mt-5 inline-block text-sm font-semibold underline underline-offset-4 dark:text-zinc-100"
                        >
                            Ver projeto
                        </a>
                    </article>
                ))}
            </div>

            <div className="mt-14 text-center">
                <a
                    href="#"
                    className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-medium transition hover:bg-white dark:border-white/10 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                    Ver todos os projetos
                </a>
            </div>
        </section>
    )
}