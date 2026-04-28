export const profile = {
    name: "Leonnardo Serafim",
    tagline: "Estudante de Ciência da Computação buscando o primeiro estágio em tecnologia.",
    about:
        "Tenho focado meus estudos em dados, SQL, Python e automação, com interesse também em backend e desenvolvimento web. Gosto de criar projetos que organizam informações, conectam APIs e resolvem problemas de forma simples.",
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
        slug: "portfolio-pessoal",
        title: "Portfólio Pessoal",
        description: "Site pessoal para mostrar meus projetos e habilidades.",
        detailedDescription:
            "Projeto criado para organizar minha apresentação profissional, destacar estudos, habilidades e projetos em uma experiência simples de navegar.",
        role: "Desenvolvimento da interface, organização do conteúdo e publicação do site.",
        highlights: [
            "Estrutura em React com componentes reutilizáveis.",
            "Tema claro/escuro com preferências salvas no navegador.",
            "Seções pensadas para leitura rápida por recrutadores.",
        ],
        tags: ["React", "Tailwind", "JavaScript", "UI"],
        image: "/Portfolio.png",
        imageClassName: "object-cover",
        github: "https://github.com/leonnardosrfm/portfolio",
    },
    {
        slug: "pokedata-api",
        title: "PokeData API",
        description:
            "API em FastAPI para carregar, consultar e analisar dados de Pokémon em PostgreSQL.",
        detailedDescription:
            "Projeto backend criado para praticar organização de dados, consumo de API externa e consultas estruturadas. A PokeData API permite cadastrar Pokémon manualmente, carregar informações da PokéAPI, salvar os dados em PostgreSQL e consultar estatísticas úteis por tipo, atributos e composição de times.",
        role: "Estruturei o projeto pensando em um fluxo completo de dados: buscar informações na PokéAPI, tratar os campos mais importantes, salvar tudo no PostgreSQL e expor endpoints para consulta e análise. Também organizei rotas para listar Pokémon com filtros, buscar registros específicos, carregar dados externos ,gerar estatísticas simples de Pokémons e times. E na última atualização, a API suporta todas as gerações de Pokémon.",
        highlights: [
            "Carga individual ou em lote de Pokémon a partir da PokéAPI.",
            "Consultas para listar, filtrar e buscar Pokémon por ID.",
            "Endpoints de estatísticas para top ataque, top velocidade, médias por tipo e resumo geral.",
            "Análise de times para comparar atributos e entender pontos fortes da composição.",
        ],
        examples: [
            {
                title: "Carregar dados externos",
                endpoint: "POST /pokemon/load/{name}",
                description:
                    "Busca um Pokémon pelo nome na PokéAPI, trata os dados principais e salva o registro no banco.",
            },
            {
                title: "Consultar estatísticas",
                endpoint: "GET /stats/by-type",
                description:
                    "Agrupa os Pokémon por tipo principal e retorna médias de atributos, útil para comparar padrões.",
            },
            {
                title: "Analisar um time",
                endpoint: "POST /teams/analyze",
                description:
                    "Recebe uma lista de Pokémon e retorna uma visão geral dos atributos do time.",
            },
        ],
        gallery: [
            {
                src: "/pokedata-api-overview.png",
                alt: "Tela inicial da documentação da PokeData API",
            },
            {
                src: "/pokedata-api-endpoints.png",
                alt: "Lista de endpoints da PokeData API",
            },
        ],
        tags: ["Python", "FastAPI", "PostgreSQL"],
        image: "/PokedataAPI.png",
        imageClassName: "object-cover object-center",
        github: "https://github.com/leonnardosrfm/pokedata-api",
    },
    {
        slug: "bot-discord",
        title: "Bot Discord",
        description:
            "Bot público em PT-BR com comandos utilitários, clima, música, TTS e leitura automática de mensagens.",
        detailedDescription:
            "Bot criado para automatizar interações em servidores Discord, reunindo comandos utilitários e integrações externas em uma experiência simples para o usuário.",
        role: "Desenvolvimento dos comandos, integração com APIs externas e organização dos fluxos do bot. A idéia de criação desse bot foi principalmente para comandos utilitários no geral, mas coincidentemente no mesmo momento surgiu a necessidade de uma pessoa sem microfone precisar se comunicar, foi aí que eu implementei o TTS automático, assim que uma mensagem de um usuário é enviado em um canal específico, o bot lê automaticamente.",
        highlights: [
            "Automação de tarefas dentro do Discord.",
            "Uso de APIs externas para recursos como clima e utilidades.",
            "Prática com eventos, comandos e tratamento de mensagens em Python.",
            "Leitura automática de mensagens em TTS.",
        ],
        tags: ["Python", "discord.py", "TTS", "Slash Commands"],
        image: "/DiscordBot.svg",
        imageClassName: "object-cover",
        github: "https://github.com/leonnardosrfm/bot-discord",
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
            { name: "n8n", icon: "n8n" },
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
