// Configurações Gerais
const CONFIG = {
    GITHUB_USERNAME: 'cleitonvpinheiro',
    WHATSAPP: {
        NUMBER: '5541988412058',
        MESSAGE: 'Olá! Vim através do seu portfólio e gostaria de conversar.',
    },
    SKILLS: [
        { skill: 'JavaScript', level: 80 },
        { skill: 'CSS', level: 70 },
        { skill: 'React', level: 85 },
    ],
    PROJECTS: [
        {
            title: 'Projeto 1',
            description: 'Descrição breve do projeto',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            link: '#',
        },
        {
            title: 'Projeto 2',
            description: 'Descrição breve do projeto',
            technologies: ['React', 'Node.js'],
            link: '#',
        },
    ],
};

// Função para Animação de Digitação
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        this.txt = this.isDeleting
            ? fullTxt.substring(0, this.txt.length - 1)
            : fullTxt.substring(0, this.txt.length + 1);

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = this.isDeleting ? 150 : 300;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Função para Inicializar TypeWriter
function initTypeWriter() {
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
}

// Função para Renderizar Barras de Habilidades
function renderSkillBars() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;

    CONFIG.SKILLS.forEach(({ skill, level }) => {
        const skillBar = document.createElement('div');
        skillBar.classList.add('skill-bar');
        
        // Adicionando ícones às habilidades
        const icon = skill === 'JavaScript' ? 'fab fa-js' :
                     skill === 'CSS' ? 'fab fa-css3-alt' :
                     skill === 'React' ? 'fab fa-react' : 'fas fa-cogs';
        
        skillBar.innerHTML = `
            <div class="skill-info">
                <span><i class="${icon}"></i> ${skill}</span>
                <span>${level}%</span>
            </div>
            <div class="skill-progress">
                <div class="skill-fill" style="width: 0;"></div>
            </div>
        `;
        skillsContainer.appendChild(skillBar);

        // Usando setTimeout para a animação da barra de habilidades
        setTimeout(() => {
            skillBar.querySelector('.skill-fill').style.width = `${level}%`;
        }, 100);
    });
}

// Função para Renderizar Projetos
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    CONFIG.PROJECTS.forEach(({ title, description, technologies, link }) => {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="project-tech">
                ${technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            <a href="${link}" class="btn" target="_blank">Ver Projeto</a>
        `;
        projectsContainer.appendChild(card);
    });
}

// Função para Configurar Botão do WhatsApp
function setupWhatsAppLink() {
    const whatsappLink = document.getElementById('whatsapp-link');
    if (!whatsappLink) return;

    const encodedMessage = encodeURIComponent(CONFIG.WHATSAPP.MESSAGE);
    whatsappLink.href = `https://wa.me/${CONFIG.WHATSAPP.NUMBER}?text=${encodedMessage}`;

    // Adicionando ícone ao link
    whatsappLink.innerHTML = `<i class="fab fa-whatsapp"></i> Contate-me no WhatsApp`;
}

// Função para Buscar Repositórios do GitHub
async function fetchGitHubRepos() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        const repos = await response.json();

        projectsContainer.innerHTML = ''; // Limpar projetos estáticos

        repos.forEach(({ name, description, stargazers_count, forks_count, html_url }) => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.innerHTML = `
                <h3>${name.replace(/-/g, ' ')}</h3>
                <p>${description || 'Sem descrição'}</p>
                <div class="project-meta">
                    <span>⭐ ${stargazers_count}</span>
                    <span>🍴 ${forks_count}</span>
                </div>
                <a href="${html_url}" class="btn btn-github" target="_blank">
                    <i class="fab fa-github"></i> Ver no GitHub
                </a>
            `;
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
    }
}

// Função para Enviar Formulário
async function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const formData = new FormData(contactForm);
            const formJSON = Object.fromEntries(formData);

            // Enviar para um serviço como EmailJS ou API customizada
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formJSON),
            });

            alert('Mensagem enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar';
        }
    });
}

// Função para Inicializar o Portfólio
function initPortfolio() {
    initTypeWriter();
    renderSkillBars();
    renderProjects();
    setupWhatsAppLink();
    fetchGitHubRepos();
    setupContactForm();
}

// Adicionar Evento de Carregamento do DOM
document.addEventListener('DOMContentLoaded', initPortfolio);
