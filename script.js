// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================
const SUPABASE_URL = 'https://cwvcovxxiyixjpbxwrmj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dc82dowA17PZGka1rtdV5Q_-gdkgyIq';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Seletores de Telas
const loginScreen = document.getElementById('loginScreen');
const loadingScreen = document.getElementById('loadingScreen');
const hubScreen = document.getElementById('hubScreen');
const appContainer = document.getElementById('appContainer');

// Elementos de Login e Usuário
const loginForm = document.getElementById('loginForm');
const userNameInput = document.getElementById('userNameInput');
const displayName = document.getElementById('displayName');
const hubDisplayName = document.getElementById('hubDisplayName');
const btnLogout = document.getElementById('btnLogout');
const btnHubLogout = document.getElementById('btnHubLogout');

// Painel Admin Hub
const adminHubSection = document.getElementById('adminHubSection');
const cardAdminReview = document.getElementById('cardAdminReview');
const cardAdminDelete = document.getElementById('cardAdminDelete');

// Carregamento
const progressBarFill = document.getElementById('progressBarFill');
const progressPercentage = document.getElementById('progressPercentage');
const btnEnterPlatform = document.getElementById('btnEnterPlatform');

// Hub Buttons
const cardMyRecords = document.getElementById('cardMyRecords');
const cardAllRecords = document.getElementById('cardAllRecords');
const btnBackToHub = document.getElementById('btnBackToHub');

// Views internas
const myRecordsView = document.getElementById('myRecordsView');
const allRecordsView = document.getElementById('allRecordsView');
const reviewRecordsView = document.getElementById('reviewRecordsView');
const deleteRecordsView = document.getElementById('deleteRecordsView');

const viewTitleHeader = document.getElementById('viewTitleHeader');
const viewSubtitleHeader = document.getElementById('viewSubtitleHeader');

// Formulário e Listas
const form = document.getElementById('solutionForm');
const btnSubmitSolution = document.getElementById('btnSubmitSolution');
const mySolutionsContainer = document.getElementById('mySolutionsContainer');
const allSolutionsContainer = document.getElementById('allSolutionsContainer');
const reviewSolutionsContainer = document.getElementById('reviewSolutionsContainer');
const deleteSolutionsContainer = document.getElementById('deleteSolutionsContainer');

const searchMyInput = document.getElementById('searchMyInput');
const searchAllInput = document.getElementById('searchAllInput');
const searchDeleteInput = document.getElementById('searchDeleteInput');

// Modal de Exclusão
const deleteModal = document.getElementById('deleteModal');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');

// Relógio em tempo real
const liveClock = document.getElementById('liveClock');

// Elementos de Notificações (Sino)
const btnNotificationBell = document.getElementById('btnNotificationBell');
const notificationDropdown = document.getElementById('notificationDropdown');
const notificationBadge = document.getElementById('notificationBadge');
const notificationList = document.getElementById('notificationList');

const btnHubNotificationBell = document.getElementById('btnHubNotificationBell');
const hubNotificationDropdown = document.getElementById('hubNotificationDropdown');
const hubNotificationBadge = document.getElementById('hubNotificationBadge');
const hubNotificationList = document.getElementById('hubNotificationList');

const USER_KEY = 'kb_current_user';
let allSolutionsCache = [];
let pendingDeleteId = null;
let lastSeenNotificationId = 0;

// Inicializa o relógio em tempo real
function initLiveClock() {
    function updateClock() {
        const now = new Date();
        if (liveClock) {
            liveClock.textContent = now.toLocaleTimeString('pt-BR');
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
        if (loginParticles) loginParticles.stop();
        showHubDirect(savedUser);
    }

    // Fechar dropdown de notificações ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-dropdown-container')) {
            if (notificationDropdown) notificationDropdown.classList.add('app-hidden');
            if (hubNotificationDropdown) hubNotificationDropdown.classList.add('app-hidden');
        }
    });
});

// --- SISTEMA DE PARTÍCULAS ---
function initParticleNetwork(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < numberOfParticles; i++) particlesArray.push(new Particle());
    }

    function connectParticles() {
        const maxDistance = 120;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < maxDistance) {
                    let opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    return { stop: () => cancelAnimationFrame(animationFrameId) };
}

let loginParticles = initParticleNetwork('particleCanvas');
let loadingParticles = null;

function isAdmin(username) {
    return username && username.trim().toLowerCase() === 'alex';
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = userNameInput.value.trim();
    if (userName) {
        localStorage.setItem(USER_KEY, userName);
        if (loginParticles) loginParticles.stop();
        loginScreen.classList.add('app-hidden');
        loadingScreen.classList.remove('app-hidden');
        loadingScreen.classList.remove('fade-out');
        loadingParticles = initParticleNetwork('particleCanvasLoading');
        
        progressBarFill.style.width = '0%';
        progressPercentage.textContent = '0%';
        btnEnterPlatform.classList.add('app-hidden');

        let currentProgress = 0;
        const intervalTime = 40; 
        const totalDuration = 4000; 
        const increment = 100 / (totalDuration / intervalTime);

        const progressInterval = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(progressInterval);
                progressBarFill.style.width = '100%';
                progressPercentage.textContent = '100%';
                btnEnterPlatform.classList.remove('app-hidden');
            } else {
                const percentInt = Math.floor(currentProgress);
                progressBarFill.style.width = percentInt + '%';
                progressPercentage.textContent = percentInt + '%';
            }
        }, intervalTime);
    }
});

btnEnterPlatform.addEventListener('click', () => {
    const savedUser = localStorage.getItem(USER_KEY);
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        if (loadingParticles) loadingParticles.stop();
        loadingScreen.classList.add('app-hidden');
        showHub(savedUser);
    }, 500);
});

function handleLogout() {
    localStorage.removeItem(USER_KEY);
    hubScreen.classList.add('app-hidden');
    appContainer.classList.add('app-hidden');
    loginScreen.classList.remove('app-hidden');
    loginScreen.classList.remove('fade-out');
    loadingScreen.classList.add('app-hidden');
    userNameInput.value = '';
    if (loadingParticles) loadingParticles.stop();
    loginParticles = initParticleNetwork('particleCanvas');
}

btnLogout.addEventListener('click', handleLogout);
btnHubLogout.addEventListener('click', handleLogout);

function showHub(userName) {
    hubDisplayName.textContent = userName;
    configureAdminView(userName);
    appContainer.classList.add('app-hidden');
    hubScreen.classList.remove('app-hidden');
    hubScreen.classList.add('screen-fade-in');
    fetchNotifications();
    setTimeout(() => hubScreen.classList.remove('screen-fade-in'), 400);
}

function showHubDirect(userName) {
    hubDisplayName.textContent = userName;
    configureAdminView(userName);
    if (loginParticles) loginParticles.stop();
    loginScreen.classList.add('app-hidden');
    loadingScreen.classList.add('app-hidden');
    appContainer.classList.add('app-hidden');
    hubScreen.classList.remove('app-hidden');
    hubScreen.classList.add('screen-fade-in');
    fetchNotifications();
    setTimeout(() => hubScreen.classList.remove('screen-fade-in'), 400);
}

function configureAdminView(userName) {
    if (isAdmin(userName)) {
        adminHubSection.classList.remove('app-hidden');
    } else {
        adminHubSection.classList.add('app-hidden');
    }
}

// --- SISTEMA DE NOTIFICAÇÕES (SINO) ---
async function fetchNotifications() {
    const currentUser = localStorage.getItem(USER_KEY);
    if (!currentUser) return;

    // Buscar último ID lido pelo usuário
    const { data: readData } = await supabaseClient
        .from('notification_reads')
        .select('last_seen_id')
        .eq('username', currentUser)
        .maybeSingle();

    lastSeenNotificationId = readData ? readData.last_seen_id : 0;

    // Buscar soluções aprovadas
    const { data: solutionsData, error } = await supabaseClient
        .from('solutions')
        .select('*')
        .eq('status', 'approved')
        .order('id', { ascending: false });

    if (error) {
        console.error('Erro ao buscar notificações:', error);
        return;
    }

    allSolutionsCache = solutionsData || [];
    updateNotificationUI();
}

function updateNotificationUI() {
    const approvedList = allSolutionsCache.filter(item => item.status === 'approved');
    
    // Filtrar novos itens não visualizados pelo usuário
    const unreadItems = approvedList.filter(item => item.id > lastSeenNotificationId);

    // Agrupar contagem por autor
    const authorCounts = {};
    approvedList.forEach(item => {
        const author = item.author || 'Equipe';
        authorCounts[author] = (authorCounts[author] || 0) + 1;
    });

    const unreadCount = unreadItems.length;

    // Atualizar Badges e ativar pulsação vermelha se houver novos registros
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.classList.remove('app-hidden');
        hubNotificationBadge.textContent = unreadCount;
        hubNotificationBadge.classList.remove('app-hidden');

        if (btnNotificationBell) btnNotificationBell.classList.add('pulse-alert');
        if (btnHubNotificationBell) btnHubNotificationBell.classList.add('pulse-alert');
    } else {
        notificationBadge.classList.add('app-hidden');
        hubNotificationBadge.classList.add('app-hidden');

        if (btnNotificationBell) btnNotificationBell.classList.remove('pulse-alert');
        if (btnHubNotificationBell) btnHubNotificationBell.classList.remove('pulse-alert');
    }

    // Montar Conteúdo das Listas de Notificação
    let htmlContent = '';
    if (approvedList.length === 0) {
        htmlContent = `<div class="notification-empty">Nenhum registro aprovado ainda.</div>`;
    } else {
        // Mostrar um resumo consolidado por autor na parte superior
        htmlContent += `<div class="notification-item" style="background: #f1f5f9; font-weight: 600; border-bottom: 2px solid #e2e8f0;">
            <i class="fa-solid fa-chart-pie" style="color: #0ea5e9;"></i> Resumo de inclusões aprovadas:
        </div>`;
        
        for (const [author, count] of Object.entries(authorCounts)) {
            htmlContent += `<div class="notification-item">
                • <strong>${escapeHtml(author)}</strong> incluiu <strong>${count}</strong> ${count === 1 ? 'registro' : 'registros'}.
            </div>`;
        }
    }

    if (notificationList) notificationList.innerHTML = htmlContent;
    if (hubNotificationList) hubNotificationList.innerHTML = htmlContent;
}

// Eventos de clique nos sinos para marcar como lidas
async function handleBellClick() {
    const currentUser = localStorage.getItem(USER_KEY);
    if (!currentUser || allSolutionsCache.length === 0) return;

    // Alternar visibilidade dos dropdowns
    if (notificationDropdown) notificationDropdown.classList.toggle('app-hidden');
    if (hubNotificationDropdown) hubNotificationDropdown.classList.toggle('app-hidden');

    const maxId = Math.max(...allSolutionsCache.map(i => i.id));

    if (maxId > lastSeenNotificationId) {
        lastSeenNotificationId = maxId;
        notificationBadge.classList.add('app-hidden');
        hubNotificationBadge.classList.add('app-hidden');

        if (btnNotificationBell) btnNotificationBell.classList.remove('pulse-alert');
        if (btnHubNotificationBell) btnHubNotificationBell.classList.remove('pulse-alert');

        // Salvar na tabela de controle do Supabase
        await supabaseClient
            .from('notification_reads')
            .upsert([{ username: currentUser, last_seen_id: maxId, updated_at: new Date() }], { onConflict: 'username' });
    }
}

if (btnNotificationBell) btnNotificationBell.addEventListener('click', handleBellClick);
if (btnHubNotificationBell) btnHubNotificationBell.addEventListener('click', handleBellClick);

// --- NAVEGAÇÃO DO HUB PARA AS VIEWS ---
cardMyRecords.addEventListener('click', () => transitionToView('my'));
cardAllRecords.addEventListener('click', () => transitionToView('all'));
if (cardAdminReview) cardAdminReview.addEventListener('click', () => transitionToView('review'));
if (cardAdminDelete) cardAdminDelete.addEventListener('click', () => transitionToView('delete'));

function transitionToView(mode) {
    const savedUser = localStorage.getItem(USER_KEY);
    displayName.textContent = savedUser;
    hubScreen.classList.add('screen-fade-out');

    setTimeout(() => {
        hubScreen.classList.add('app-hidden');
        hubScreen.classList.remove('screen-fade-out');

        appContainer.classList.remove('app-hidden');
        appContainer.classList.add('screen-fade-in');

        myRecordsView.classList.add('app-hidden');
        allRecordsView.classList.add('app-hidden');
        if (reviewRecordsView) reviewRecordsView.classList.add('app-hidden');
        if (deleteRecordsView) deleteRecordsView.classList.add('app-hidden');

        if (mode === 'my') {
            myRecordsView.classList.remove('app-hidden');
            viewTitleHeader.innerHTML = `<i class="fa-solid fa-user-pen"></i> Meus Registros`;
            viewSubtitleHeader.textContent = `Gerenciamento de suas soluções pessoais`;
            loadSolutionsFromCloud('my');
        } else if (mode === 'all') {
            allRecordsView.classList.remove('app-hidden');
            viewTitleHeader.innerHTML = `<i class="fa-solid fa-globe"></i> Visualizar Todos os Registros`;
            viewSubtitleHeader.textContent = `Consulta de soluções aprovadas de toda a equipe`;
            loadSolutionsFromCloud('all');
        } else if (mode === 'review') {
            reviewRecordsView.classList.remove('app-hidden');
            viewTitleHeader.innerHTML = `<i class="fa-solid fa-clipboard-check"></i> Revisão Administrativa`;
            viewSubtitleHeader.textContent = `Autorização de novos registros`;
            loadSolutionsFromCloud('review');
        } else if (mode === 'delete') {
            deleteRecordsView.classList.remove('app-hidden');
            viewTitleHeader.innerHTML = `<i class="fa-solid fa-trash-can"></i> Gerenciamento e Exclusão`;
            viewSubtitleHeader.textContent = `Painel de exclusão de registros`;
            loadSolutionsFromCloud('delete');
        }

        setTimeout(() => appContainer.classList.remove('screen-fade-in'), 400);
    }, 350);
}

btnBackToHub.addEventListener('click', () => {
    appContainer.classList.add('screen-fade-out');
    setTimeout(() => {
        appContainer.classList.add('app-hidden');
        appContainer.classList.remove('screen-fade-out');
        showHub(localStorage.getItem(USER_KEY));
    }, 350);
});

// --- COMUNICAÇÃO COM O SUPABASE ---
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value.trim();
    const description = document.getElementById('description').value.trim();
    const solution = document.getElementById('solution').value.trim();
    const author = localStorage.getItem(USER_KEY) || 'Equipe';
    const date = new Date().toLocaleDateString('pt-BR');
    const status = isAdmin(author) ? 'approved' : 'pending';

    btnSubmitSolution.disabled = true;
    btnSubmitSolution.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Salvando na nuvem...`;

    const { error } = await supabaseClient
        .from('solutions')
        .insert([{ title, category, description, solution, author, date, status }]);

    btnSubmitSolution.disabled = false;
    btnSubmitSolution.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar Solução`;

    if (error) {
        alert('Erro ao salvar solução na nuvem: ' + error.message);
        console.error(error);
        return;
    }

    form.reset();
    loadSolutionsFromCloud('my');
});

async function loadSolutionsFromCloud(viewMode) {
    let targetContainer;
    if (viewMode === 'my') targetContainer = mySolutionsContainer;
    else if (viewMode === 'all') targetContainer = allSolutionsContainer;
    else if (viewMode === 'review') targetContainer = reviewSolutionsContainer;
    else if (viewMode === 'delete') targetContainer = deleteSolutionsContainer;

    if (!targetContainer) return;

    targetContainer.innerHTML = `
        <div class="card" style="text-align: center; color: #64748b; padding: 30px; grid-column: 1 / -1;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; margin-bottom: 10px; color: #0ea5e9;"></i>
            <p>Sincronizando soluções da nuvem...</p>
        </div>
    `;

    const { data, error } = await supabaseClient
        .from('solutions')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        targetContainer.innerHTML = `
            <div class="card" style="text-align: center; color: #ef4444; padding: 30px; grid-column: 1 / -1;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.8rem; margin-bottom: 10px;"></i>
                <p>Erro ao carregar dados. Verifique sua conexão.</p>
            </div>
        `;
        console.error(error);
        return;
    }

    allSolutionsCache = data || [];
    updateNotificationUI();
    
    if (viewMode === 'my') renderMySolutions(allSolutionsCache);
    else if (viewMode === 'all') renderAllSolutions(allSolutionsCache);
    else if (viewMode === 'review') renderReviewSolutions(allSolutionsCache);
    else if (viewMode === 'delete') renderDeleteSolutions(allSolutionsCache);
}

// Renderizadores
function renderMySolutions(list) {
    mySolutionsContainer.innerHTML = '';
    const currentUser = localStorage.getItem(USER_KEY);
    const myFiltered = list.filter(item => item.author && item.author.toLowerCase() === currentUser.toLowerCase());

    if (myFiltered.length === 0) {
        mySolutionsContainer.innerHTML = `
            <div class="card" style="text-align: center; color: #64748b; padding: 40px;">
                <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p>Você ainda não cadastrou nenhuma solução.</p>
            </div>
        `;
        return;
    }

    myFiltered.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('solution-card');
        const statusBadge = item.status === 'approved' 
            ? `<span class="badge" style="background: #dcfce7; color: #15803d;">Aprovado</span>` 
            : `<span class="badge" style="background: #fef3c7; color: #b45309;">Aguardando Revisão</span>`;

        card.innerHTML = `
            <div class="card-header-info">
                <h3>${escapeHtml(item.title)}</h3>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="badge">${escapeHtml(item.category)}</span>
                    ${statusBadge}
                </div>
            </div>
            <p><strong>Problema:</strong> ${escapeHtml(item.description)}</p>
            <p><strong>Resolução:</strong> ${escapeHtml(item.solution)}</p>
            <div class="card-footer-info">
                <span>Registrado em: ${item.date || 'Data recente'}</span>
            </div>
        `;
        mySolutionsContainer.appendChild(card);
    });
}

function renderAllSolutions(list) {
    allSolutionsContainer.innerHTML = '';
    const approvedList = list.filter(item => item.status === 'approved');

    if (approvedList.length === 0) {
        allSolutionsContainer.innerHTML = `
            <div class="card" style="text-align: center; color: #64748b; padding: 40px; grid-column: 1 / -1;">
                <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p>Nenhuma solução aprovada disponível na base geral.</p>
            </div>
        `;
        return;
    }

    approvedList.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('solution-card');
        card.innerHTML = `
            <div class="card-header-info">
                <h3>${escapeHtml(item.title)}</h3>
                <span class="badge">${escapeHtml(item.category)}</span>
            </div>
            <p><strong>Problema:</strong> ${escapeHtml(item.description)}</p>
            <p><strong>Resolução:</strong> ${escapeHtml(item.solution)}</p>
            <div class="card-footer-info">
                <span>Registrado por: <strong>${escapeHtml(item.author || 'Equipe')}</strong> em ${item.date || 'Data recente'}</span>
            </div>
        `;
        allSolutionsContainer.appendChild(card);
    });
}

function renderReviewSolutions(list) {
    reviewSolutionsContainer.innerHTML = '';
    const pendingList = list.filter(item => item.status === 'pending' || !item.status);

    if (pendingList.length === 0) {
        reviewSolutionsContainer.innerHTML = `
            <div class="card" style="text-align: center; color: #64748b; padding: 40px; grid-column: 1 / -1;">
                <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; margin-bottom: 10px; color: #10b981;"></i>
                <p>Parabéns! Não há novos registros aguardando revisão no momento.</p>
            </div>
        `;
        return;
    }

    pendingList.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('solution-card');
        card.style.borderLeftColor = '#d97706';

        card.innerHTML = `
            <div class="card-header-info">
                <h3>${escapeHtml(item.title)}</h3>
                <span class="badge" style="background: #fef3c7; color: #b45309;">Pendente</span>
            </div>
            <p><strong>Problema:</strong> ${escapeHtml(item.description)}</p>
            <p><strong>Resolução:</strong> ${escapeHtml(item.solution)}</p>
            <div class="card-footer-info">
                <span>Enviado por: <strong>${escapeHtml(item.author || 'Equipe')}</strong> em ${item.date || 'Data recente'}</span>
            </div>
            <div class="card-admin-actions">
                <button onclick="authorizeSolution(${item.id})" class="btn-primary" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 8px 12px; font-size: 0.85rem;">
                    <i class="fa-solid fa-check"></i> Autorizar Exibição
                </button>
            </div>
        `;
        reviewSolutionsContainer.appendChild(card);
    });
}

function renderDeleteSolutions(list) {
    deleteSolutionsContainer.innerHTML = '';

    if (list.length === 0) {
        deleteSolutionsContainer.innerHTML = `
            <div class="card" style="text-align: center; color: #64748b; padding: 40px; grid-column: 1 / -1;">
                <p>Nenhum registro encontrado na base.</p>
            </div>
        `;
        return;
    }

    list.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('solution-card');
        card.style.borderLeftColor = '#dc2626';

        card.innerHTML = `
            <div class="card-header-info">
                <h3>${escapeHtml(item.title)}</h3>
                <span class="badge">${escapeHtml(item.category)}</span>
            </div>
            <p><strong>Problema:</strong> ${escapeHtml(item.description)}</p>
            <p><strong>Resolução:</strong> ${escapeHtml(item.solution)}</p>
            <div class="card-footer-info">
                <span>Por: <strong>${escapeHtml(item.author || 'Equipe')}</strong> | ${item.date || ''}</span>
            </div>
            <div class="card-admin-actions">
                <button onclick="openDeleteModal(${item.id})" class="btn-primary btn-danger-theme" style="padding: 8px 12px; font-size: 0.85rem;">
                    <i class="fa-solid fa-trash-can"></i> Excluir Registro
                </button>
            </div>
        `;
        deleteSolutionsContainer.appendChild(card);
    });
}

// Função de Autorização (Admin)
window.authorizeSolution = async function(id) {
    const { error } = await supabaseClient
        .from('solutions')
        .update({ status: 'approved' })
        .eq('id', id);

    if (error) {
        alert('Erro ao autorizar registro: ' + error.message);
        return;
    }

    loadSolutionsFromCloud('review');
};

// Funções do Modal de Exclusão
window.openDeleteModal = function(id) {
    pendingDeleteId = id;
    deleteModal.classList.remove('app-hidden');
};

btnCancelDelete.addEventListener('click', () => {
    pendingDeleteId = null;
    deleteModal.classList.add('app-hidden');
});

btnConfirmDelete.addEventListener('click', async () => {
    if (!pendingDeleteId) return;

    const { error } = await supabaseClient
        .from('solutions')
        .delete()
        .eq('id', pendingDeleteId);

    if (error) {
        alert('Erro ao excluir registro: ' + error.message);
        return;
    }

    deleteModal.classList.add('app-hidden');
    pendingDeleteId = null;
    loadSolutionsFromCloud('delete');
});

// Pesquisas Dinâmicas
searchMyInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const currentUser = localStorage.getItem(USER_KEY);
    const filtered = allSolutionsCache.filter(item => 
        item.author && item.author.toLowerCase() === currentUser.toLowerCase() &&
        (item.title?.toLowerCase().includes(term) || item.category?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term))
    );
    renderMySolutions(filtered);
});

searchAllInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSolutionsCache.filter(item => 
        item.status === 'approved' &&
        (item.title?.toLowerCase().includes(term) || item.category?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term) || item.author?.toLowerCase().includes(term))
    );
    renderAllSolutions(filtered);
});

searchDeleteInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allSolutionsCache.filter(item => 
        item.title?.toLowerCase().includes(term) || item.category?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term) || item.author?.toLowerCase().includes(term)
    );
    renderDeleteSolutions(filtered);
});

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}


// ==========================================
// INTEGRAÇÃO DO CHAT ASSISTENTE GEMINI
// ==========================================

// Controla a abertura e fechamento da janela flutuante do Gemini
function toggleGeminiModal() {
    const modal = document.getElementById('gemini-modal');
    if (!modal) return;
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
        const input = document.getElementById('gemini-input');
        if (input) input.focus();
    } else {
        modal.style.display = 'none';
    }
}

// Permite enviar a pergunta apertando a tecla "Enter"
function handleGeminiKeyPress(event) {
    if (event.key === 'Enter') {
        enviarPerguntaParaGemini();
    }
}

// Função principal que envia a mensagem e interage com a Edge Function do Supabase
async function enviarPerguntaParaGemini() {
    const input = document.getElementById('gemini-input');
    const chatBody = document.getElementById('gemini-chat-body');
    if (!input || !chatBody) return;

    const pergunta = input.value.trim();
    if (!pergunta) return;

    // 1. Exibe a mensagem do usuário na tela
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'gemini-msg-user';
    userMsgDiv.textContent = pergunta;
    chatBody.appendChild(userMsgDiv);

    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Exibe o balão temporário de "Pensando..."
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'gemini-msg-loading';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando Assistente...';
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // 3. Chamada segura para a Edge Function do Supabase
        const { data, error } = await supabaseClient.functions.invoke('smart-handler', {
            body: { prompt: pergunta }
        });

        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        if (error) throw error;

        const respostaIA = (data && data.resposta) ? data.resposta : "Sem resposta detalhada da IA.";

        // 4. Cria e exibe a resposta formatada da IA
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'gemini-msg-bot';
        botMsgDiv.innerHTML = formatarRespostaIA(respostaIA);
        chatBody.appendChild(botMsgDiv);

    } catch (err) {
        console.error('Erro na Edge Function do Gemini:', err);
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'gemini-msg-error';
        errorDiv.textContent = 'Erro ao conectar com o Assistente. Tente novamente mais tarde.';
        chatBody.appendChild(errorDiv);
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}

// Formata quebras de linha com segurança para HTML
function formatarRespostaIA(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}
