import {
    FaGitAlt,
    FaPython,
    FaCode,
    FaDatabase,
    FaAws,
    FaLeaf,
    FaBrain,
    FaFileExcel,
    FaChartBar,
    FaServer,
    FaRocket,
} from "react-icons/fa"
import { skillCategories } from "../data/site"

const iconMap = {
    git: FaGitAlt,
    python: FaPython,
    c: FaCode,
    cpp: FaCode,
    mysql: FaDatabase,
    django: FaServer,
    fastapi: FaRocket,
    mongodb: FaLeaf,
    aws: FaAws,
    ml: FaBrain,
    excel: FaFileExcel,
    powerbi: FaChartBar,
}

const iconColorMap = {
    git: "text-[#F05032]",
    python: "text-[#3776AB]",
    c: "text-[#A8B9CC]",
    cpp: "text-[#00599C]",
    mysql: "text-[#4479A1]",
    django: "text-[#092E20] dark:text-[#44B78B]",
    fastapi: "text-[#009688]",
    mongodb: "text-[#47A248]",
    aws: "text-[#FF9900]",
    ml: "text-[#F7931E]",
    excel: "text-[#217346]",
    powerbi: "text-[#F2C811]",
}

const categoryStyles = {
    blue: {
        badge: "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200",
        card: "hover:border-black/15 hover:bg-zinc-50/60 dark:hover:border-white/15 dark:hover:bg-zinc-900",
    },
    emerald: {
        badge: "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200",
        card: "hover:border-black/15 hover:bg-zinc-50/60 dark:hover:border-white/15 dark:hover:bg-zinc-900",
    },
    amber: {
        badge: "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200",
        card: "hover:border-black/15 hover:bg-zinc-50/60 dark:hover:border-white/15 dark:hover:bg-zinc-900",
    },
    violet: {
        badge: "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200",
        card: "hover:border-black/15 hover:bg-zinc-50/60 dark:hover:border-white/15 dark:hover:bg-zinc-900",
    },
    rose: {
        badge: "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200",
        card: "hover:border-black/15 hover:bg-zinc-50/60 dark:hover:border-white/15 dark:hover:bg-zinc-900",
    },
}

function CategoryBlock({ category, wide = false }) {
    const style = categoryStyles[category.color]

    return (
        <div>
            <div className="mb-5 flex items-center gap-3">
        <span
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${style.badge}`}
        >
          {category.title}
        </span>
            </div>

            <div
                className={`grid gap-4 ${
                    wide ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
                }`}
            >
                {category.skills.map((skill) => {
                    const Icon = iconMap[skill.icon]
                    const iconColor = iconColorMap[skill.icon] ?? "text-slate-700 dark:text-zinc-200"

                    return (
                        <div
                            key={skill.name}
                            className={`group rounded-2xl border border-black/10 bg-white px-5 py-6 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:border-white/10 dark:bg-zinc-900 ${style.card}`}
                        >
                            <div
                                className={`mb-4 flex justify-center transition duration-300 group-hover:scale-110 ${iconColor}`}
                            >
                                <Icon size={28} />
                            </div>

                            <p className="text-center text-sm font-medium text-slate-800 transition duration-300 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                                {skill.name}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function SkillsSection() {
    const [languages, backend, database, cloud, dataBi] = skillCategories

    return (
        <section id="skills" className="pb-24">
            <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <h2 className="font-skills text-center text-5xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
                    Skills
                </h2>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-10">
                    <CategoryBlock category={languages} />
                    <CategoryBlock category={backend} />
                </div>

                <div className="space-y-10">
                    <CategoryBlock category={database} />
                    <CategoryBlock category={cloud} />
                </div>

                <div className="lg:col-span-2">
                    <CategoryBlock category={dataBi} wide />
                </div>
            </div>
        </section>
    )
}