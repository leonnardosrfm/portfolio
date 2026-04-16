export const profile = {
    name: "Leonnardo Serafim",
    tagline: "Desenvolvedor focado em backend, APIs e organização de dados.",
    about:
        "Sou estudante de Ciência da Computação e venho desenvolvendo projetos com foco em backend e integração de dados. Gosto de criar soluções que sejam realmente úteis e impactantes na vida do usuário. Atualmente, estou em busca de uma oportunidade de estágio para evoluir na prática e contribuir com projetos reais.",
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
        href: "/Resume - Leonnardo Serafim.pdf",
        download: true,
        external: false,
        hoverLabel: "Baixar currículo",
    },
]

export const projects = [
    {
        title: "Portfólio Pessoal",
        description: "Site pessoal para mostrar meus projetos e habilidades.",
        tags: ["React", "Tailwind","JavaScript","UI"],
        image: "/Portfolio.png",
        imageClassName: "object-cover",
        github: "https://github.com/leonnardosrfm/portfolio",
    },
    {
        title: "PokeData API",
        description: "API para consultar e organizar dados de Pokémon.",
        tags: ["Python", "FastAPI", "PostgreSQL"],
        image: "/PokedataAPI.png",
        imageClassName: "object-cover object-center",
        github: "https://github.com/leonnardosrfm/pokedata-api",
    },
]

export const utilities = [
    {
        id: "image-converter",
        title: "Conversor de Imagens",
        supportedFormats: ["PNG", "JPG", "WebP"],
    },
    {
        id: "pdf-converter",
        title: "Imagem para PDF",
        supportedFormats: ["PNG", "JPG", "WebP", "PDF"],
    },
    {
        id: "pdf-to-word",
        title: "PDF para Word",
        supportedFormats: ["PDF", "DOC"],
    },
    {
        id: "pdf-to-excel",
        title: "PDF para Excel",
        supportedFormats: ["PDF", "XLS"],
    },
    {
        id: "pdf-editor",
        title: "Editar PDF",
        supportedFormats: ["PDF"],
    },
    {
        id: "pdf-to-image",
        title: "PDF para Imagem",
        supportedFormats: ["PDF", "PNG", "JPG", "WebP"],
    },
]

export const skillCategories = [
    {
        title: "Linguagens",
        color: "blue",
        skills: [
            { name: "Python", icon: "python" },
            { name: "C", icon: "c" },
            { name: "JavaScript", icon: "javascript" },
            { name: "HTML", icon: "html" },
            { name: "CSS", icon: "css" },
        ],
    },
    {
        title: "Frameworks",
        color: "emerald",
        skills: [
            { name: "Django", icon: "django" },
            { name: "FastAPI", icon: "fastapi" },
            { name: "React", icon: "react" },
            { name: "Tailwind CSS", icon: "tailwind" },
        ],
    },
    {
        title: "Cloud & Ferramentas",
        color: "violet",
        skills: [
            { name: "Git", icon: "git" },
            { name: "AWS", icon: "aws" },
            { name: "Oracle", icon: "oracle" },
            { name: "Figma", icon: "figma" },
        ],
    },
    {
        title: "Banco de Dados",
        color: "amber",
        skills: [
            { name: "MongoDB", icon: "mongodb" },
            { name: "PostgreSQL", icon: "postgresql" },
        ],
    },
    {
        title: "No/Low Code",
        color: "teal",
        skills: [
            { name: "Xano", icon: "xano" },
            { name: "FlutterFlow", icon: "flutterflow" },
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
