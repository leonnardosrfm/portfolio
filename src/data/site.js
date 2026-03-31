export const profile = {
    name: "Leonnardo Serafim",
    tagline: "Desenvolvedor em formação - Atualmente cursando Ciência da Computação.",
    about:
        "Bem-vindo, meu nome é Leonnardo! Esse portfólio reúne meus projetos, habilidades, estudos e minha evolução como desenvolvedor.",
    email: "leonnardo.serafim@proton.me",
    linkedin: "https://linkedin.com/in/leonnardo-serafim/",
    github: "https://github.com/leonnardosrfm",
}

export const socialLinks = [
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/leonnardo-serafim",
        external: true,
        hoverLabel: "Ver LinkedIn",
    },
    {
        label: "GitHub",
        href: "https://github.com/leonnardosrfm",
        external: true,
        hoverLabel: "Ver GitHub",
    },
    {
        label: "Email",
        href: "mailto:leonnardo.serafim@proton.me",
        external: false,
        hoverLabel: "Enviar email",
    },
    {
        label: "Currículo",
        href: "/curriculo.pdf",
        download: true,
        external: false,
        hoverLabel: "Baixar currículo",
    },
]

export const projects = [
    {
        title: "Projeto 1",
        description:
            "Landing page moderna com foco em performance, responsividade e clareza visual.",
        tags: ["React", "Tailwind", "UI"],
        imageClass: "from-slate-200 via-white to-slate-100",
        link: "#",
    },
    {
        title: "Projeto 2",
        description:
            "Aplicação com consumo de API e interface limpa, pensada para boa experiência de uso.",
        tags: ["JavaScript", "API", "Frontend"],
        imageClass: "from-blue-100 via-slate-50 to-slate-200",
        link: "#",
    },
]

export const skillCategories = [
    {
        title: "Linguagens",
        color: "blue",
        skills: [
            { name: "Python", icon: "python" },
            { name: "C", icon: "c" },
        ],
    },
    {
        title: "Frameworks",
        color: "emerald",
        skills: [
            { name: "Django", icon: "django" },
            { name: "FastAPI", icon: "fastapi" },
        ],
    },
    {
        title: "Banco de Dados",
        color: "amber",
        skills: [
            { name: "MongoDB", icon: "mongodb" },
            { name: "MySQL", icon: "mysql" },
        ],
    },
    {
        title: "Cloud & Ferramentas",
        color: "violet",
        skills: [
            { name: "Git", icon: "git" },
            { name: "AWS", icon: "aws" },
        ],
    },
    {
        title: "Data & BI",
        color: "rose",
        skills: [
            { name: "Machine Learning", icon: "ml" },
            { name: "Excel", icon: "excel" },
            { name: "Power BI", icon: "powerbi" },
        ],
    },
]