import {
    FaAws,
    FaBrain,
    FaChartBar,
    FaCloud,
    FaCode,
    FaDatabase,
    FaFileExcel,
    FaGitAlt,
    FaMobileAlt,
    FaPython,
    FaReact,
    FaServer,
} from "react-icons/fa"
import {
    SiCss,
    SiDjango,
    SiFigma,
    SiHtml5,
    SiJavascript,
    SiMongodb,
    SiPostgresql,
    SiTailwindcss,
} from "react-icons/si"

const skillGroups = [
    {
        title: "Backend",
        skills: [
            { name: "Python", icon: FaPython, color: "#3776AB" },
            { name: "C", icon: FaCode, color: "#5C6BC0" },
            { name: "FastAPI", icon: FaServer, color: "#009688" },
            { name: "Django", icon: SiDjango, color: "#0C4B33" },
            { name: "APIs REST", icon: FaServer, color: "#4F46E5" },
        ],
    },
    {
        title: "Banco de dados",
        skills: [
            { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
            { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
        ],
    },
    {
        title: "Ferramentas",
        skills: [
            { name: "Git", icon: FaGitAlt, color: "#F05032" },
            { name: "AWS", icon: FaAws, color: "#FF9900" },
            { name: "Oracle", icon: FaCloud, color: "#F80000" },
            { name: "Figma", icon: SiFigma, color: "#A259FF" },
        ],
    },
    {
        title: "Frontend",
        skills: [
            { name: "React", icon: FaReact, color: "#61DAFB" },
            { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
            { name: "HTML", icon: SiHtml5, color: "#E34F26" },
            { name: "CSS", icon: SiCss, color: "#1572B6" },
            { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
        ],
    },
]

const secondarySkillGroups = [
    {
        title: "No/Low Code",
        skills: [
            { name: "Xano", icon: FaServer, color: "#2C6BED" },
            { name: "FlutterFlow", icon: FaMobileAlt, color: "#005DF2" },
        ],
    },
    {
        title: "Data & BI",
        skills: [
            { name: "Machine Learning", icon: FaBrain, color: "#8B5CF6" },
            { name: "Excel", icon: FaFileExcel, color: "#217346" },
            { name: "Power BI", icon: FaChartBar, color: "#F2C811" },
        ],
    },
]

export default function SkillsSection() {
    return (
        <section id="skills" className="section-shell">
            <div className="text-center">
                <p className="section-kicker">Habilidades</p>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl gap-3 md:grid-cols-2">
                {skillGroups.map((group) => (
                    <article
                        key={group.title}
                        className="rounded-[1.15rem] border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-5 py-5 text-left"
                    >
                        <h3 className="text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text)] md:text-[1.08rem]">
                            {group.title}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {group.skills.map((skill) => {
                                const Icon = skill.icon

                                return (
                                    <div
                                        key={skill.name}
                                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3 py-1.5 text-[13px] font-medium text-[color:var(--text)]"
                                    >
                                        <Icon size={14} style={{ color: skill.color }} />
                                        <span>{skill.name}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </article>
                ))}
            </div>

            <div className="mx-auto mt-8 max-w-4xl border-t border-[color:var(--line)] pt-6">
                <div className="text-center">
                    <p className="section-kicker">Secundárias</p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {secondarySkillGroups.map((group) => (
                        <article
                            key={group.title}
                            className="rounded-[1rem] border border-[color:var(--line)] px-4 py-4 text-left"
                        >
                            <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[color:var(--text)]">
                                {group.title}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {group.skills.map((skill) => {
                                    const Icon = skill.icon

                                    return (
                                        <div
                                            key={skill.name}
                                            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--text)]"
                                        >
                                            <Icon size={13} style={{ color: skill.color }} />
                                            <span>{skill.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
