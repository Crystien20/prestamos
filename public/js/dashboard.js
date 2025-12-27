// dashboard.js
console.log('🚀 Dashboard BRK Software - PRODUCCIÓN');

// ===========================================
// CONFIGURACIÓN GLOBAL DE PRODUCCIÓN
// ===========================================
const BRK_CONFIG = {
    user: null,
    apiUrl: '/api',
    
    initialize() {
        try {
            const userData = localStorage.getItem('brk_user');
            const token = localStorage.getItem('brk_token');
            
            console.log('🔍 Verificando autenticación...');
            
            if (!userData || !token) {
                console.warn('⚠️ Sesión no válida - Redirigiendo al login');
                window.location.href = '/';
                return false;
            }
            
            this.user = JSON.parse(userData);
            console.log('✅ Usuario autenticado:', {
                username: this.user.username,
                level: this.user.level
            });
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando sesión:', error);
            window.location.href = '/';
            return false;
        }
    },
    
    getAuthHeaders() {
        const token = localStorage.getItem('brk_token');
        if (!token) {
            console.error('❌ Token no disponible');
            return {};
        }
        
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },
    
    async makeRequest(endpoint, options = {}) {
        const url = `${this.apiUrl}${endpoint}`;
        const headers = this.getAuthHeaders();
        
        if (Object.keys(headers).length === 0) {
            throw new Error('No hay token de autenticación');
        }
        
        console.log(`📡 Petición a: ${url}`);
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers },
                credentials: 'same-origin'
            });
            
            if (response.status === 401) {
                console.warn('🔐 Sesión expirada');
                localStorage.clear();
                window.location.href = '/';
                throw new Error('Sesión expirada');
            }
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`❌ Error en ${endpoint}:`, error.message);
            throw error;
        }
    }
};

// ===========================================
// DASHBOARD MANAGER - PRODUCCIÓN
// ===========================================
class DashboardManager {
    constructor() {
        this.menuOpen = false;
        this.currentView = 'dashboard';
    }
    
    async initialize() {
        console.log('🚀 Iniciando Dashboard Manager...');
        
        try {
            // 1. Inicializar configuración
            if (!BRK_CONFIG.initialize()) {
                throw new Error('Configuración inválida');
            }
            
            // 2. Ocultar loader
            this.hideLoader();
            
            // 3. Cargar menú
            await this.loadMenu();
            
            // 4. Cargar dashboard principal
            await this.loadDashboard();
            
            // 5. Configurar eventos
            this.bindEvents();
            
            // 6. Iniciar reloj
            this.startClock();
            
            // 7. Cargar tema guardado
            this.loadSavedTheme();
            
            // 8. Mostrar mensaje de bienvenida
            this.showWelcomeMessage();
            
            console.log('✅ Dashboard inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando dashboard:', error);
            this.showError(`Error al iniciar: ${error.message}`);
        }
    }
    
    hideLoader() {
        const loader = document.querySelector('.main-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
    
    async loadMenu() {
        try {
            console.log('📋 Cargando menú...');
            const response = await BRK_CONFIG.makeRequest('/menu');
            
            if (response.success) {
                this.renderMenu(response.menu);
            } else {
                throw new Error('Error en la respuesta del menú');
            }
        } catch (error) {
            console.error('❌ Error cargando menú:', error.message);
            this.showError('No se pudo cargar el menú: ' + error.message);
        }
    }
    
    renderMenu(menuItems) {
        const menuList = document.getElementById('menu-nav-list');
        if (!menuList) {
            console.error('❌ No se encontró el contenedor del menú');
            return;
        }
        
        menuList.innerHTML = '';
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('li');
            menuItem.className = 'menu-nav__item';
            menuItem.dataset.id = item.id;
            
            menuItem.innerHTML = `
                <span class="menu-nav__item-anchor button">
                    <span class="menu-nav__item-content">
                        <svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="8"/>
                        </svg>
                        <span class="menu-nav__item-text">${item.text}</span>
                    </span>
                    <span class="arrow-down">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 10l5 5 5-5z"/>
                        </svg>
                    </span>
                </span>
                <ul class="menu-nav__sublist">
                    ${item.subitems.map(subitem => `
                        <li class="menu-nav__item button" data-action="${subitem.action}">
                            ${subitem.text}
                        </li>
                    `).join('')}
                </ul>
            `;
            
            menuList.appendChild(menuItem);
        });
        
        this.bindMenuEvents();
    }
    
    bindMenuEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-nav__item-anchor')) {
                e.preventDefault();
                const anchor = e.target.closest('.menu-nav__item-anchor');
                const sublist = anchor.nextElementSibling;
                const arrow = anchor.querySelector('.arrow-down');
                
                document.querySelectorAll('.menu-nav__sublist').forEach(s => {
                    if (s !== sublist) s.classList.remove('showItemnav');
                });
                document.querySelectorAll('.arrow-down').forEach(a => {
                    if (a !== arrow) a.style.transform = 'rotate(0deg)';
                });
                
                sublist.classList.toggle('showItemnav');
                arrow.style.transform = sublist.classList.contains('showItemnav') 
                    ? 'rotate(180deg)' 
                    : 'rotate(0deg)';
            }
            
            if (e.target.closest('.menu-nav__sublist .menu-nav__item')) {
                const item = e.target.closest('.menu-nav__item');
                const action = item.dataset.action;
                
                if (action) {
                    this.handleMenuAction(action);
                    
                    if (window.innerWidth < 1200) {
                        this.closeMenu();
                    }
                }
            }
            
            if (!e.target.closest('.menu') && !e.target.closest('.hamburguer-menu')) {
                this.closeMenu();
            }
        });
        
        const hamburger = document.querySelector('.hamburguer-menu');
        if (hamburger) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }
    }
    
    handleMenuAction(action) {
        console.log(`🎯 Acción seleccionada: ${action}`);
        
        const actionMap = {
            'dashboard': () => this.loadDashboard(),
            'showadmin': () => this.showModule('Administradores', 'Listado de administradores'),
            'showmoney': () => this.showModule('Monedas', 'Gestión de monedas'),
            'showsecre': () => this.showModule('Secretarios', 'Listado de secretarios'),
            'showsuper': () => this.showModule('Supervisores', 'Listado de supervisores'),
            'showcobra': () => this.showModule('Cobradores', 'Listado de cobradores'),
            'showpendientes': () => this.showModule('Clientes Pendientes', 'Clientes pendientes por visitar'),
            'generarreport': () => this.showModule('Generar Reporte', 'Generar reporte del día')
        };
        
        if (actionMap[action]) {
            actionMap[action]();
        } else {
            this.loadDashboard();
        }
    }
    
    async loadDashboard() {
        try {
            console.log('📊 Cargando dashboard...');
            const response = await BRK_CONFIG.makeRequest('/dashboard/modules');
            
            if (response.success) {
                this.renderDashboard(response.modules);
            } else {
                throw new Error('Error en la respuesta del dashboard');
            }
        } catch (error) {
            console.error('❌ Error cargando dashboard:', error.message);
            this.showError('No se pudo cargar el dashboard: ' + error.message);
        }
    }
    
    renderDashboard(modules) {
        const mainView = document.getElementById('main-view');
        if (!mainView) return;
        
        const levelNames = {
            'ma': 'Master',
            'ad': 'Administrador',
            'se': 'Secretario',
            'su': 'Supervisor',
            'co': 'Cobrador'
        };
        
        const user = BRK_CONFIG.user;
        const levelName = levelNames[user.level] || 'Usuario';
        const userName = user.fullName || user.username;
        
        let html = `
            <div class="dashboard__container">
                <h2 class="title-section__text">Dashboard - ${levelName}</h2>
                <p style="margin-bottom: 20px; color: var(--text-gray);">
                    Bienvenido ${userName}
                </p>
                
                <div class="grid-dashboard">
        `;
        
        modules.forEach(module => {
            html += `
                <div class="grid-dashboard__block">
                    <img class="grid-dashboard__icon" src="${module.icon}" alt="${module.title}"
                         onerror="this.src='/assets/lupa.svg'">
                    <h3 class="grid-dashboard__title">${module.title}</h3>
                    <p class="grid-dashboard__text">${module.description}</p>
                    <button class="generic-btn__text grid-dashboard-btn" data-action="${module.action}">
                        Acceder
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        mainView.innerHTML = html;
        
        mainView.querySelectorAll('.grid-dashboard-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action) {
                    this.handleMenuAction(action);
                }
            });
        });
    }
    
    showModule(title, description) {
        const mainView = document.getElementById('main-view');
        if (!mainView) return;
        
        mainView.innerHTML = `
            <div class="dashboard__container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 class="title-section__text">${title}</h2>
                    <button class="generic-btn__text" onclick="window.dashboard.loadDashboard()" 
                            style="width: auto; padding: 8px 16px;">
                        ← Volver al Dashboard
                    </button>
                </div>
                
                <div style="
                    background: var(--background-color-two);
                    border-radius: 10px;
                    padding: 30px;
                    min-height: 400px;
                ">
                    <div style="text-align: center; padding: 20px 0;">
                        <div style="
                            width: 80px;
                            height: 80px;
                            background: var(--primary-color);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                        ">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        </div>
                        
                        <h3 style="color: var(--primary-color); margin-bottom: 15px;">
                            ${title}
                        </h3>
                        
                        <p style="color: var(--text-gray); margin-bottom: 25px; max-width: 600px; margin: 0 auto 25px;">
                            ${description}
                        </p>
                        
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                            gap: 15px;
                            margin-top: 30px;
                        ">
                            <div style="
                                background: var(--background-color-three);
                                padding: 20px;
                                border-radius: 8px;
                                text-align: center;
                            ">
                                <h4 style="color: var(--primary-color); margin-bottom: 10px;">Funcionalidad 1</h4>
                                <p style="color: var(--text-gray); font-size: 14px;">
                                    Descripción de la funcionalidad principal
                                </p>
                            </div>
                            
                            <div style="
                                background: var(--background-color-three);
                                padding: 20px;
                                border-radius: 8px;
                                text-align: center;
                            ">
                                <h4 style="color: var(--primary-color); margin-bottom: 10px;">Funcionalidad 2</h4>
                                <p style="color: var(--text-gray); font-size: 14px;">
                                    Descripción de funcionalidad adicional
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    toggleMenu() {
        const menu = document.querySelector('.menu');
        const lines = document.querySelectorAll('.hamburguer-menu__line');
        
        if (this.menuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        const menu = document.querySelector('.menu');
        const lines = document.querySelectorAll('.hamburguer-menu__line');
        
        menu.classList.add('showMenu');
        lines[0].classList.add('line-one-closed');
        lines[1].classList.add('line-two-closed');
        lines[2].classList.add('line-three-closed');
        this.menuOpen = true;
    }
    
    closeMenu() {
        const menu = document.querySelector('.menu');
        const lines = document.querySelectorAll('.hamburguer-menu__line');
        
        menu.classList.remove('showMenu');
        lines.forEach(line => {
            line.classList.remove('line-one-closed', 'line-two-closed', 'line-three-closed');
        });
        this.menuOpen = false;
    }
    
    bindEvents() {
        document.querySelectorAll('.closeMain, .exitSystem').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
        
        const refreshBtn = document.querySelector('.refreshPage');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                location.reload();
            });
        }
        
        const userBtn = document.querySelector('.menu-user-settings');
        const userMenu = document.querySelector('.menu-user__settings-nav');
        
        if (userBtn && userMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('showUsermenu');
            });
            
            document.addEventListener('click', (e) => {
                if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.remove('showUsermenu');
                }
            });
        }
        
        const themeBtn = document.querySelector('.switch-theme');
        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        this.updateUserInfo();
    }
    
    startClock() {
        const updateClock = () => {
            const clockElement = document.getElementById('reloj');
            if (clockElement) {
                const now = new Date();
                clockElement.textContent = now.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    updateUserInfo() {
        const user = BRK_CONFIG.user;
        if (!user) return;
        
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            const levelNames = {
                'ma': 'Master',
                'ad': 'Admin',
                'se': 'Secretario',
                'su': 'Supervisor',
                'co': 'Cobrador'
            };
            
            const levelName = levelNames[user.level] || 'Usuario';
            userNameElement.textContent = `${levelName}: ${user.fullName || user.username}`;
        }
        
        const userImage = document.getElementById('fotoperfil');
        if (userImage) {
            userImage.src = '/assets/user.svg';
            userImage.onerror = function() {
                this.src = '/assets/lupa.svg';
            };
        }
    }
    
    toggleTheme() {
        const body = document.body;
        const themePicker = document.querySelector('.theme__picker');
        
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            if (themePicker) {
                themePicker.classList.remove('theme__picker-slide');
            }
            localStorage.setItem('brk_theme', 'dark');
        } else {
            body.classList.add('light-theme');
            if (themePicker) {
                themePicker.classList.add('theme__picker-slide');
            }
            localStorage.setItem('brk_theme', 'light');
        }
    }
    
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('brk_theme');
            const themePicker = document.querySelector('.theme__picker');
            
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                if (themePicker) {
                    themePicker.classList.add('theme__picker-slide');
                }
            }
        } catch (error) {
            console.warn('⚠️ Error cargando tema:', error);
        }
    }
    
    logout() {
        localStorage.removeItem('brk_token');
        localStorage.removeItem('brk_user');
        localStorage.removeItem('brk_theme');
        
        window.location.href = '/';
    }
    
    showWelcomeMessage() {
        const user = BRK_CONFIG.user;
        if (user) {
            const levelNames = {
                'ma': 'Master',
                'ad': 'Administrador',
                'se': 'Secretario',
                'su': 'Supervisor',
                'co': 'Cobrador'
            };
            
            const levelName = levelNames[user.level] || '';
            const userName = user.fullName || user.username;
            const message = `¡Bienvenido ${levelName} ${userName}!`;
            
            this.showNotification('success', message);
        }
    }
    
    showNotification(type, message) {
        const elementId = type === 'success' ? 'message-approve' : 'message-error';
        const element = document.getElementById(elementId);
        
        if (element) {
            const textElement = element.querySelector('.notify__text-content');
            if (textElement) {
                textElement.textContent = message;
                element.classList.add('show');
                
                setTimeout(() => {
                    element.classList.remove('show');
                }, 3000);
            }
        }
    }
    
    showError(message) {
        const mainView = document.getElementById('main-view');
        if (!mainView) return;
        
        mainView.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: calc(100vh - 100px);
                padding: 40px;
                text-align: center;
                color: var(--text-gray);
            ">
                <div style="
                    background: var(--background-color-two);
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: var(--shadow-lg);
                ">
                    <h2 style="color: var(--error); margin-bottom: 20px;">
                        ⚠️ Error
                    </h2>
                    <p style="margin-bottom: 25px; line-height: 1.5;">
                        ${message}
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="location.reload()" class="generic-btn__text" style="width: auto;">
                            🔄 Recargar
                        </button>
                        <button onclick="window.location.href='/'" class="generic-btn__text" 
                                style="width: auto; background: var(--primary-color);">
                            🔐 Ir al Login
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// ===========================================
// FUNCIONES GLOBALES
// ===========================================
window.showNotification = (type, message) => {
    const elementId = type === 'success' ? 'message-approve' : 'message-error';
    const element = document.getElementById(elementId);
    
    if (element) {
        const textElement = element.querySelector('.notify__text-content');
        if (textElement) {
            textElement.textContent = message;
            element.classList.add('show');
            
            setTimeout(() => {
                element.classList.remove('show');
            }, 3000);
        }
    }
};

// ===========================================
// INICIALIZACIÓN
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, iniciando dashboard...');
    
    const token = localStorage.getItem('brk_token');
    const userData = localStorage.getItem('brk_user');
    
    if (!token || !userData) {
        console.warn('❌ No autenticado, redirigiendo...');
        window.location.href = '/';
        return;
    }
    
    try {
        window.dashboard = new DashboardManager();
        window.dashboard.initialize();
        
    } catch (error) {
        console.error('❌ Error crítico inicializando dashboard:', error);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--background-color);
            color: var(--error);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            padding: 20px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h2>❌ Error Crítico</h2>
            <p>${error.message}</p>
            <button onclick="location.reload()" class="generic-btn__text" style="width: auto; margin-top: 20px;">
                Recargar Página
            </button>
        `;
        document.body.appendChild(errorDiv);
    }
});

window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    showNotification('error', 'Ocurrió un error inesperado');
});