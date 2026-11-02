// ============================================================
// PedroOS - Central Data Store
// Centralized data for Pedro Henrique Lima Leal's Interactive Portfolio
// ============================================================

const PedroOSData = {
  system: {
    name: 'PedroOS',
    version: '2.6 LTS',
    kernel: '6.9.1-ph-custom',
    build: '2026.11-release',
    developer: 'Pedro Henrique Lima Leal',
    status: 'Online & Available',
    arch: 'x86_64 / WebAssembly Ready'
  },

  profile: {
    name: 'Pedro Henrique Lima Leal',
    shortName: 'Pedro Henrique',
    role: 'Engenheiro de Software & Desenvolvedor Full Stack',
    tagline: 'Criando soluções web de alta performance, portais corporativos e automações com IA.',
    email: 'phlimaleal2019@gmail.com',
    phone: '(69) 99210-2965',
    phoneClean: '5569992102965',
    location: 'Ariquemes - RO',
    availability: 'Disponível para oportunidades presenciais, remotas e mudança',
    englishLevel: 'B2 Intermediário (Certificado)',
    github: 'https://github.com/pedrohll4',
    githubUsername: 'pedrohll4',
    whatsapp: 'https://wa.me/5569992102965',
    avatar: './pedro.png',
    summary: 'Sou Pedro Henrique Lima Leal, graduando em Engenharia de Software pela Jala University, com formação técnica em Manutenção e Suporte em Informática pelo IFRO. Tenho experiência prática com desenvolvimento de sistemas, criação e manutenção de aplicações web, APIs, bancos de dados, automações, infraestrutura de TI e suporte técnico. Tenho interesse em tecnologia, desenvolvimento de software, resolução de problemas e criação de soluções que atendam a necessidades reais.',
    education: {
      higher: {
        institution: 'Jala University',
        degree: 'Bacharelado em Engenharia de Software',
        period: '2024 – Em Andamento',
        description: 'Formação internacional de alto rigor acadêmico com foco em excelência técnica, arquitetura de sistemas, estruturas de dados avançadas, padrões de projeto e resolução colaborativa de problemas complexos de software em padrão global.'
      },
      technical: {
        institution: 'IFRO (Instituto Federal de Rondônia)',
        degree: 'Técnico em Manutenção e Suporte em Informática',
        period: '2021 – 2023 (Formado)',
        description: 'Fundamentos sólidos de computação: arquitetura de hardware, infraestrutura de redes locais e roteamento, sistemas operacionais (Linux/Windows) e suporte corporativo de TI.'
      }
    }
  },

  projects: [
    {
      id: 'tratormag',
      name: 'Tratormag',
      badge: 'Destaque Corporativo | Gestão Ativa',
      isFeatured: true,
      category: 'corporate',
      icon: 'tractor',
      color: 'from-amber-500 to-cyan-500',
      shortDescription: 'Portal corporativo e catálogo comercial oficial desenvolvido e mantido ativamente.',
      fullDescription: 'Portal corporativo e catálogo comercial oficial desenvolvido e mantido ativamente até hoje. Apresentação completa de maquinários pesados, catálogo abrangente de peças agrícolas e industriais, canais de solicitação de orçamento e atendimento em tempo real.',
      objective: 'Fortalecer a presença digital da Tratormag, centralizar a vitrine de produtos e equipamentos pesados, facilitar orçamentos diretos para produtores rurais e clientes industriais, além de alcançar alto ranqueamento orgânico em buscas regionais.',
      participation: 'Responsável pelo desenvolvimento da interface e estrutura web, gerenciamento contínuo da aplicação, manutenção da integridade do catálogo, implementação de rotas e APIs, otimização técnica de SEO e monitoramento contínuo de disponibilidade e desempenho.',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'REST APIs', 'SEO Avançado', 'Gestão Contínua', 'Cloud Hosting'],
      url: 'https://tratormag.com.br/',
      displayUrl: 'tratormag.com.br',
      status: 'Online (Produção Ativa)'
    },
    {
      id: 'hora-do-rush',
      name: 'Hora do Rush Notícias',
      badge: 'Portal de Notícias | Alto Tráfego',
      isFeatured: true,
      category: 'news',
      icon: 'newspaper',
      color: 'from-rose-500 to-amber-500',
      shortDescription: 'Portal regional de notícias dinâmico com feed de reportagens em tempo real e alta velocidade.',
      fullDescription: 'Portal regional de notícias com feed editorial ágil, carregamento ultra-rápido, categorização intuitiva de notícias regionais e nacionais, otimização agressiva de SEO para ranqueamento no Google Notícias e layout responsivo para smartphones.',
      objective: 'Disponibilizar uma plataforma de mídia digital moderna, ágil e escalável para entrega diária de notícias à população de Rondônia e região, maximizando engajamento e retenção de leitores.',
      participation: 'Desenvolvimento do portal editorial responsivo, estruturação semântica para indexação de notícias em mecanismos de busca, testes de desempenho e otimização de layout para navegação fluida em dispositivos móveis.',
      technologies: ['Next.js', 'React', 'Tailwind CSS', 'REST API', 'SEO Editorial', 'Mobile First', 'Performance Optimization'],
      url: 'https://horadorushnoticias.com.br/',
      displayUrl: 'horadorushnoticias.com.br',
      status: 'Online (Produção Ativa)'
    },
    {
      id: 'yuri-almeida',
      name: 'Yuri Almeida Imóveis',
      badge: 'Real Estate | Plataforma Imobiliária',
      isFeatured: true,
      category: 'real-estate',
      icon: 'home',
      color: 'from-blue-600 to-indigo-400',
      shortDescription: 'Plataforma imobiliária completa com catálogo de imóveis e filtros inteligentes de busca.',
      fullDescription: 'Plataforma imobiliária completa com catálogo dinâmico de casas, apartamentos, terrenos e fazendas. Conta com filtros inteligentes por localização, faixa de valor e tipo de imóvel, além de canais diretos para agendamento de visitas e captação de leads.',
      objective: 'Digitalizar o inventário de imóveis da corretora, proporcionando uma experiência de busca amigável e moderna para compradores e investidores, acelerando o ciclo de negociação.',
      participation: 'Desenvolvimento da aplicação web interativa, implementação dos filtros combinados de pesquisa, integração com canais de atendimento imediato e modelagem da exibição de imóveis com galerias fotográficas organizadas.',
      technologies: ['React', 'JavaScript', 'CSS3 / Tailwind', 'REST Integration', 'Lead Capture Engine', 'Filtros Dinâmicos'],
      url: 'https://www.yurialmeidaimoveis.com.br/',
      displayUrl: 'yurialmeidaimoveis.com.br',
      status: 'Online (Produção Ativa)'
    },
    {
      id: 'las-chicas',
      name: 'Las Chicas Fitness',
      badge: 'E-Commerce | Moda Fitness',
      isFeatured: false,
      category: 'ecommerce',
      icon: 'shopping-bag',
      color: 'from-pink-500 to-purple-500',
      shortDescription: 'Catálogo virtual e e-commerce voltado à alta conversão de vendas e visual contemporâneo.',
      fullDescription: 'Vitrine virtual moderna e e-commerce de moda fitness feminina. O projeto destaca as coleções por categorias, apresenta fotografias dos produtos em alta definição com zoom interativo e direciona os clientes para checkout prático e humanizado.',
      objective: 'Apresentar as peças da marca com requinte visual e identidade jovem, estimulando a conversão de vendas diretas e ampliando o alcance do catálogo nas redes sociais.',
      participation: 'Criação e arquitetura da interface da loja virtual, organização dos catálogos de produtos e variações, design com foco em experiência mobile e publicação na infraestrutura Vercel com carregamento instantâneo.',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'UI/UX Conversão', 'Vercel Deployment', 'Catálogo de Produtos'],
      url: 'https://las-chicas-fitness.vercel.app/',
      displayUrl: 'las-chicas-fitness.vercel.app',
      status: 'Online (Produção Ativa)'
    },
    {
      id: 'el-shadday',
      name: 'El Shadday Ariquemes',
      badge: 'Portal Institucional & Comunitário',
      isFeatured: false,
      category: 'institutional',
      icon: 'users',
      color: 'from-cyan-500 to-blue-600',
      shortDescription: 'Portal institucional com agenda de eventos, galeria e canais comunitários.',
      fullDescription: 'Portal institucional e comunitário desenvolvido para concentrar comunicados oficiais, agenda dinâmica de encontros e eventos, galeria multimídia com fotos das celebrações e direcionamento para canais de acolhimento e suporte comunitário.',
      objective: 'Manter a comunidade informada, engajada e conectada com a programação local através de um canal oficial moderno, intuitivo e acessível para todas as faixas etárias.',
      participation: 'Planejamento e programação completa do site institucional, arquitetura do calendário de programações dinâmicas, galeria de imagens otimizadas e integração com redes sociais e canais de contato.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Agenda Dinâmica', 'Multimídia', 'Mobile First'],
      url: 'https://elshaddayariquemes.vercel.app/',
      displayUrl: 'elshaddayariquemes.vercel.app',
      status: 'Online (Produção Ativa)'
    },
    {
      id: 'araujo-instrutor',
      name: 'Araujo Instrutor Autônomo',
      badge: 'Landing Page | Alta Conversão',
      isFeatured: false,
      category: 'landing-page',
      icon: 'car',
      color: 'from-amber-400 to-orange-600',
      shortDescription: 'Landing page para instrutor de trânsito credenciado com agendamento instantâneo.',
      fullDescription: 'Landing page focada em conversão direta para instrutor de trânsito credenciado em Ariquemes e região. Estruturada com apresentação clara de planos e aulas práticas para habilitados e aprendizes, depoimentos de alunos aprovados e botão direto para agendamento via WhatsApp.',
      objective: 'Gerar autoridade profissional na internet para o instrutor e converter visitantes em alunos por meio de uma proposta de valor clara e contato imediato no WhatsApp.',
      participation: 'Criação do layout estratégico de vendas, redação direcionada para conversão, estilização responsiva moderna, otimização de velocidade e integração direta com a API do WhatsApp com mensagem personalizada.',
      technologies: ['HTML5 Semântico', 'Tailwind CSS', 'JavaScript', 'WhatsApp Click-to-Chat API', 'Copywriting & Conversão'],
      url: 'https://araujo-instrutor-autonomo.vercel.app/',
      displayUrl: 'araujo-instrutor-autonomo.vercel.app',
      status: 'Online (Produção Ativa)'
    }
  ],

  experiences: [
    {
      id: 'tratormag',
      company: 'Tratormag',
      role: 'Desenvolvimento de Sistemas, Portais Web & Infraestrutura de TI',
      period: 'Atuação Ativa (Presente)',
      isCurrent: true,
      badge: 'Experiência Corporativa Atual',
      location: 'Ariquemes - RO',
      website: 'https://tratormag.com.br/',
      activities: [
        'Criação e gerenciamento contínuo do site oficial corporativo (tratormag.com.br), responsável por estabilidade, atualizações de catálogo e canais de conversão.',
        'Desenvolvimento e integração de APIs RESTful e rotinas de automação para aumentar a produtividade e integração dos processos operacionais internos.',
        'Modelagem relacional de bancos de dados, manutenção de queries estruturadas e controle de versão rigoroso utilizando Git e GitHub.',
        'Gestão de infraestrutura tecnológica, garantindo disponibilidade de estações de trabalho, diagnóstico avançado de hardware e roteamento de redes corporativas.'
      ],
      skills: ['Next.js', 'React', 'APIs RESTful', 'Automações', 'Bancos de Dados', 'Git', 'Infraestrutura de TI', 'Redes & Hardware']
    },
    {
      id: 'dabliu',
      company: 'Dabliu Marketing',
      role: 'VideoMaker & Manutenção de Equipamentos de TI',
      period: 'Concluído',
      isCurrent: false,
      badge: 'Experiência Concluída',
      location: 'Ariquemes - RO',
      activities: [
        'Produção e edição profissional de vídeos institucionais e publicitários com softwares da suíte Adobe (Premiere Pro, Photoshop e After Effects).',
        'Planejamento de roteiros visuais dinâmicos para campanhas de mídias sociais e captação técnica de imagem e áudio.',
        'Manutenção preventiva e corretiva de computadores de alto desempenho, impressoras, câmeras e periféricos, reduzindo paradas técnicas.'
      ],
      skills: ['Adobe Premiere', 'Photoshop', 'After Effects', 'Hardware de Alta Performance', 'Manutenção Preventiva', 'Suporte Técnico']
    }
  ],

  skills: {
    frontend: [
      { name: 'HTML5 & Semântica', level: 'Avançado', icon: 'file-code-2' },
      { name: 'CSS3 & Flex/Grid', level: 'Avançado', icon: 'palette' },
      { name: 'JavaScript (ES6+)', level: 'Avançado', icon: 'zap' },
      { name: 'React', level: 'Avançado', icon: 'layers' },
      { name: 'Next.js', level: 'Intermediário / Avançado', icon: 'globe' },
      { name: 'Tailwind CSS', level: 'Avançado', icon: 'brush' },
      { name: 'UI / UX Design & Prototipagem', level: 'Intermediário', icon: 'layout' }
    ],
    backend: [
      { name: 'Python', level: 'Intermediário', icon: 'terminal' },
      { name: 'Java', level: 'Intermediário', icon: 'coffee' },
      { name: 'Linguagem C', level: 'Acadêmico / Fundamentos', icon: 'cpu' },
      { name: 'APIs RESTful & Endpoints', level: 'Avançado', icon: 'network' },
      { name: 'Integrações & Webhooks', level: 'Avançado', icon: 'workflow' },
      { name: 'Automações de Scripts', level: 'Avançado', icon: 'cog' }
    ],
    infra: [
      { name: 'Git & GitHub', level: 'Avançado', icon: 'git-branch' },
      { name: 'Linux (Bash / VPS)', level: 'Intermediário', icon: 'server' },
      { name: 'Bancos de Dados Relacionais', level: 'Intermediário', icon: 'database' },
      { name: 'Redes de Computadores & Roteamento', level: 'Avançado', icon: 'wifi' },
      { name: 'Hardware & Manutenção Técnica', level: 'Avançado (IFRO)', icon: 'wrench' }
    ],
    ai: [
      { name: 'Engenharia de Prompts', level: 'Avançado', icon: 'sparkles' },
      { name: 'Desenvolvimento de Aplicações com IA', level: 'Avançado', icon: 'bot' },
      { name: 'Utilização de Agentes de IA Autônomos', level: 'Avançado', icon: 'cpu' },
      { name: 'Prototipagem & Construção Acelerada', level: 'Avançado', icon: 'rocket' }
    ],
    languages: [
      { name: 'Português', level: 'Nativo', badge: 'Fluente', icon: 'flag' },
      { name: 'Inglês', level: 'B2 Intermediário', badge: 'Comunicação Global', icon: 'languages' }
    ]
  },

  // Virtual File System for "Meu Computador"
  virtualFileSystem: {
    root: {
      name: 'PedroOS',
      type: 'drive',
      children: [
        {
          id: 'drive-c',
          name: 'Disco Local (C:)',
          type: 'drive',
          meta: '256 GB livres de 512 GB (SSD NVMe)',
          icon: 'hard-drive',
          children: [
            {
              id: 'c-windows',
              name: 'PedroOS_System',
              type: 'folder',
              icon: 'folder',
              children: [
                { id: 'f-kernel', name: 'kernel.sys', type: 'file', ext: 'sys', icon: 'file-cog', content: 'PedroOS Core Kernel v2.6 - Build 2026.11' },
                { id: 'f-env', name: 'developer.env', type: 'file', ext: 'env', icon: 'file-text', content: 'DEV_NAME=Pedro Henrique Lima Leal\nDEV_ROLE=Full Stack Developer\nSTATUS=Available\nLOCATION=Ariquemes_RO' }
              ]
            },
            {
              id: 'c-users',
              name: 'Usuários',
              type: 'folder',
              icon: 'folder',
              children: [
                {
                  id: 'c-pedro',
                  name: 'pedro',
                  type: 'folder',
                  icon: 'folder',
                  children: [
                    { id: 'doc-folder', name: 'Documentos', type: 'folder', targetApp: 'explorer', folderPath: 'Documentos', icon: 'folder' },
                    { id: 'proj-folder', name: 'Projetos', type: 'folder', targetApp: 'projects', icon: 'folder-git' },
                    { id: 'photo-folder', name: 'Fotografias', type: 'folder', targetApp: 'explorer', folderPath: 'Fotografias', icon: 'folder-image' },
                    { id: 'skills-folder', name: 'Habilidades', type: 'folder', targetApp: 'skills', icon: 'folder-code' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'drive-d',
          name: 'Projetos (D:)',
          type: 'drive',
          meta: '1.2 TB livres de 2.0 TB',
          icon: 'hard-drive',
          children: [
            { id: 'proj-tratormag', name: 'tratormag.com.br', type: 'project-link', projectId: 'tratormag', icon: 'folder-git' },
            { id: 'proj-rush', name: 'horadorushnoticias.com.br', type: 'project-link', projectId: 'hora-do-rush', icon: 'folder-git' },
            { id: 'proj-yuri', name: 'yurialmeidaimoveis.com.br', type: 'project-link', projectId: 'yuri-almeida', icon: 'folder-git' },
            { id: 'proj-chicas', name: 'las-chicas-fitness', type: 'project-link', projectId: 'las-chicas', icon: 'folder-git' },
            { id: 'proj-shadday', name: 'elshaddayariquemes', type: 'project-link', projectId: 'el-shadday', icon: 'folder-git' },
            { id: 'proj-araujo', name: 'araujo-instrutor', type: 'project-link', projectId: 'araujo-instrutor', icon: 'folder-git' }
          ]
        }
      ]
    },
    folders: {
      'Documentos': [
        {
          id: 'doc-bio',
          name: 'apresentacao_profissional.txt',
          type: 'file',
          ext: 'txt',
          icon: 'file-text',
          size: '1.8 KB',
          date: '02/11/2026',
          content: `APRESENTAÇÃO PROFISSIONAL — PEDRO HENRIQUE LIMA LEAL
============================================================
Desenvolvedor Full Stack & Graduando em Engenharia de Software (Jala University).
Formação Técnica em Manutenção e Suporte em Informática (IFRO).
Inglês B2 Intermediário certificado.

Atuação profissional sólida na Tratormag com desenvolvimento de sistemas web,
criação e gestão contínua de portal corporativo de alto valor comercial,
APIs RESTful, bancos de dados relacionais e infraestrutura de TI.

Destaque no uso estratégico de Inteligência Artificial para prototipagem rápida,
criação acelerada de sistemas e automações robustas.

Disponível para contratação, projetos corporativos e atuação remota ou presencial.`
        },
        {
          id: 'doc-cv',
          name: 'Curriculo_Pedro_Henrique.pdf',
          type: 'app-link',
          targetApp: 'resume',
          icon: 'file-text',
          size: '142 KB',
          date: '02/11/2026'
        },
        {
          id: 'doc-ingles',
          name: 'certificacao_ingles_b2.txt',
          type: 'file',
          ext: 'txt',
          icon: 'file-check',
          size: '850 B',
          date: '15/08/2025',
          content: `NÍVEL DE IDIOMA: INGLÊS B2 (INTERMEDIÁRIO / INDEPENDENTE)
============================================================
Capacidade de comunicação clara e técnica em equipes globais e remotas.
Leitura e escrita técnica de documentações de software, arquiteturas de sistemas,
RFCs e colaboração em repositórios internacionais.`
        }
      ],
      'Fotografias': [
        {
          id: 'photo-pedro',
          name: 'pedro_henrique_perfil.png',
          type: 'image',
          src: './pedro.png',
          icon: 'image',
          size: '671 KB',
          date: '23/10/2026'
        }
      ]
    }
  },

  // Available Wallpapers
  wallpapers: [
    {
      id: 'cyber-deep',
      name: 'Cyber Deep (Padrão)',
      type: 'gradient-grid',
      bgClass: 'bg-[#090d16]',
      previewColor: '#0b0f19',
      style: `radial-gradient(circle at 20% 15%, rgba(139, 92, 246, 0.22) 0%, transparent 50%),
              radial-gradient(circle at 80% 75%, rgba(6, 182, 212, 0.18) 0%, transparent 50%),
              #090d16`
    },
    {
      id: 'nebula-violet',
      name: 'Nebula Violet',
      type: 'gradient',
      bgClass: 'bg-[#110e24]',
      previewColor: '#1e1145',
      style: `radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.28) 0%, transparent 60%),
              radial-gradient(circle at 80% 85%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
              #0f0b1e`
    },
    {
      id: 'aurora-ocean',
      name: 'Aurora Ocean',
      type: 'gradient',
      bgClass: 'bg-[#06141d]',
      previewColor: '#082f49',
      style: `radial-gradient(circle at 15% 20%, rgba(6, 182, 212, 0.25) 0%, transparent 55%),
              radial-gradient(circle at 85% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
              #041018`
    },
    {
      id: 'sunset-twilight',
      name: 'Sunset Twilight',
      type: 'gradient',
      bgClass: 'bg-[#190d18]',
      previewColor: '#38122c',
      style: `radial-gradient(circle at 30% 20%, rgba(249, 115, 22, 0.22) 0%, transparent 55%),
              radial-gradient(circle at 75% 70%, rgba(217, 70, 239, 0.2) 0%, transparent 50%),
              #120914`
    },
    {
      id: 'minimal-obsidian',
      name: 'Obsidian Minimal',
      type: 'gradient',
      bgClass: 'bg-[#0a0a0c]',
      previewColor: '#18181b',
      style: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 70%),
              #09090b`
    }
  ]
};

// Export to window
window.PedroOSData = PedroOSData;
