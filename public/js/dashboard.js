import ApiClient from './core/ApiClient.js';
import TableManager from './core/TableManager.js';
import ModalManager from './core/ModalManager.js';
import FormManager from './core/FormManager.js';
import TemplateManager from './core/TemplateManager.js';
import Triggers from './modules/Triggers.js';
import Chats from './modules/Chats.js';
import Settings from './modules/Settings.js';
import Constants from './utils/Constants.js';
import Helpers from './utils/Helpers.js';

class Dashboard {
    constructor() {
        this.userData = null;
        this.dashboardData = null;
        this.menuItems = [];
        this.initialized = false;
    }
    
    // Inicializar dashboard
    async init() {
        if (this.initialized) return;
        
        try {
            // Verificar autenticación
            await this.checkAuth();
            
            // Mostrar loading
            this.showLoading();
            
            // Cargar datos iniciales
            await Promise.all([
                this.loadUserData(),
                this.loadDashboardData(),
                this.loadMenu()
            ]);
            
            // Renderizar UI
            this.renderDashboard();
            
            // Inicializar módulos
            this.initModules();
            
            // Aplicar triggers
            Triggers.applyTriggers();
            
            // Ocultar loading
            this.hideLoading();
            
            this.initialized = true;
            
            // Verificar notificaciones pendientes
            this.checkPendingNotifications();
            
        } catch (error) {
            console.error('Error inicializando dashboard:', error);
            this.handleInitError(error);
        }
    }
    
    // Verificar autenticación
    async checkAuth() {
        const token = localStorage.getItem(Constants.STORAGE_KEYS.TOKEN);
        
        if (!token) {
            window.location.href = '/';
            throw new Error('No autenticado');
        }
        
        // Verificar token en servidor (opcional)
        // await ApiClient.get('/api/auth/verify');
    }
    
    // Cargar datos del usuario
    async loadUserData() {
        try {
            const data = localStorage.getItem(Constants.STORAGE_KEYS.USER_DATA);
            if (data) {
                this.userData = JSON.parse(data);
            } else {
                // Si no hay datos en localStorage, obtener del servidor
                const response = await ApiClient.get('/api/auth/me');
                this.userData = response.user;
                localStorage.setItem(Constants.STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
            }
        } catch (error) {
            console.error('Error cargando datos del usuario:', error);
            throw error;
        }
    }
    
    // Cargar datos del dashboard
    async loadDashboardData() {
        try {
            const response = await ApiClient.getDashboardStats();
            this.dashboardData = response;
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            this.dashboardData = this.getDefaultDashboardData();
        }
    }
    
    // Obtener datos por defecto del dashboard
    getDefaultDashboardData() {
        return {
            stats: [
                { label: 'Clientes Activos', value: 0, icon: 'fas fa-users', color: 'blue' },
                { label: 'Préstamos Activos', value: 0, icon: 'fas fa-hand-holding-usd', color: 'green' },
                { label: 'Monto Total', value: 0, icon: 'fas fa-dollar-sign', color: 'orange' },
                { label: 'Pagos Hoy', value: 0, icon: 'fas fa-calendar-check', color: 'purple' }
            ],
            recentLoans: [],
            upcomingPayments: [],
            monthlySummary: {
                totalLoans: 0,
                totalPayments: 0,
                pendingAmount: 0
            }
        };
    }
    
    // Cargar menú
    async loadMenu() {
        try {
            const response = await ApiClient.getMenu();
            this.menuItems = response.menu || [];
        } catch (error) {
            console.error('Error cargando menú:', error);
            this.menuItems = this.getDefaultMenu();
        }
    }
    
    // Obtener menú por defecto
    getDefaultMenu() {
        return [
            { id: 'dashboard', text: 'Dashboard', icon: 'fas fa-home', url: '#dashboard', active: true },
            { id: 'clients', text: 'Clientes', icon: 'fas fa-users', url: '#clients' },
            { id: 'loans', text: 'Préstamos', icon: 'fas fa-hand-holding-usd', url: '#loans' },
            { id: 'payments', text: 'Pagos', icon: 'fas fa-credit-card', url: '#payments' },
            { id: 'reports', text: 'Reportes', icon: 'fas fa-chart-bar', url: '#reports' },
            { id: 'settings', text: 'Configuración', icon: 'fas fa-cog', url: '#settings' }
        ];
    }
    
    // Renderizar dashboard
    renderDashboard() {
        this.renderUserInfo();
        this.renderMenu();
        this.renderStats();
        this.initTables();
    }
    
    // Renderizar información del usuario
    renderUserInfo() {
        if (!this.userData) return;
        
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = this.userData.nombre || this.userData.username || 'Usuario';
        if (userRole) userRole.textContent = this.userData.rol || 'Administrador';
        if (userAvatar && this.userData.avatar) {
            userAvatar.src = this.userData.avatar;
        }
    }
    
    // Renderizar menú
    renderMenu() {
        const menuContainer = document.getElementById('sidebarMenu');
        if (!menuContainer) return;
        
        const menuHTML = this.menuItems.map(item => 
            TemplateManager.render('menuItem', item)
        ).join('');
        
        menuContainer.innerHTML = menuHTML;
        
        // Vincular eventos del menú
        this.bindMenuEvents();
    }
    
    // Vincular eventos del menú
    bindMenuEvents() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const action = item.dataset.action;
                const menuId = item.dataset.menu;
                
                switch (action) {
                    case 'navigate':
                        this.navigateTo(menuId, item.href);
                        break;
                        
                    case 'modal':
                        this.openModal(menuId);
                        break;
                        
                    case 'section':
                        this.showSection(menuId);
                        break;
                        
                    default:
                        console.log(`Acción ${action} no implementada`);
                }
            });
        });
    }
    
    // Navegar a sección
    navigateTo(sectionId, url) {
        // Remover activo de todos los items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Activar item actual
        document.querySelector(`[data-menu="${sectionId}"]`)?.classList.add('active');
        
        // Cargar contenido de la sección
        this.loadSectionContent(sectionId);
        
        // Actualizar URL si es necesario
        if (url && url !== '#') {
            window.history.pushState({ section: sectionId }, '', url);
        }
    }
    
    // Cargar contenido de sección
    async loadSectionContent(sectionId) {
        const contentArea = document.getElementById('contentArea');
        if (!contentArea) return;
        
        // Mostrar loading
        contentArea.innerHTML = `
            <div class="section-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando...</p>
            </div>
        `;
        
        try {
            let content;
            
            switch (sectionId) {
                case 'dashboard':
                    content = this.getDashboardContent();
                    break;
                    
                case 'clients':
                    content = await this.getClientsContent();
                    break;
                    
                case 'loans':
                    content = await this.getLoansContent();
                    break;
                    
                case 'payments':
                    content = await this.getPaymentsContent();
                    break;
                    
                case 'reports':
                    content = await this.getReportsContent();
                    break;
                    
                case 'settings':
                    content = await this.getSettingsContent();
                    break;
                    
                default:
                    content = '<h2>Sección no encontrada</h2>';
            }
            
            contentArea.innerHTML = content;
            
            // Inicializar componentes específicos de la sección
            this.initSectionComponents(sectionId);
            
        } catch (error) {
            console.error(`Error cargando sección ${sectionId}:`, error);
            contentArea.innerHTML = `
                <div class="section-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error al cargar la sección</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="dashboard.loadSectionContent('${sectionId}')">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
    
    // Obtener contenido del dashboard
    getDashboardContent() {
        return `
            <section class="dashboard-section">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Dashboard Principal</h1>
                    <p class="dashboard-subtitle">Resumen general del sistema</p>
                </div>
                
                <div class="stats-grid" id="statsGrid"></div>
                
                <div class="content-grid">
                    <div class="content-card">
                        <div class="card-header">
                            <h3><i class="fas fa-users"></i> Últimos Clientes</h3>
                        </div>
                        <div class="card-body">
                            <div id="recentClientsTable"></div>
                        </div>
                    </div>
                    
                    <div class="content-card">
                        <div class="card-header">
                            <h3><i class="fas fa-hand-holding-usd"></i> Préstamos Recientes</h3>
                        </div>
                        <div class="card-body">
                            <div id="recentLoansTable"></div>
                        </div>
                    </div>
                    
                    <div class="content-card full-width">
                        <div class="card-header">
                            <h3><i class="fas fa-chart-line"></i> Resumen Mensual</h3>
                        </div>
                        <div class="card-body">
                            <div id="monthlyChart"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    // Renderizar estadísticas
    renderStats() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid || !this.dashboardData?.stats) return;
        
        const statsHTML = this.dashboardData.stats.map(stat => 
            TemplateManager.render('statsCard', stat)
        ).join('');
        
        statsGrid.innerHTML = statsHTML;
    }
    
    // Inicializar tablas
    initTables() {
        // Tabla de clientes recientes
        TableManager.init('recentClientsTable', {
            endpoint: '/api/clients/recent',
            columns: Constants.TABLE_CONFIGS.CLIENTS.columns,
            pageSize: 5,
            showSearch: false,
            showPagination: false,
            actions: ['view'],
            onRowClick: (id, row) => {
                this.viewClient(id);
            }
        });
        
        // Tabla de préstamos recientes
        TableManager.init('recentLoansTable', {
            endpoint: '/api/loans/recent',
            columns: Constants.TABLE_CONFIGS.LOANS.columns,
            pageSize: 5,
            showSearch: false,
            showPagination: false,
            actions: ['view'],
            onRowClick: (id, row) => {
                this.viewLoan(id);
            }
        });
    }
    
    // Inicializar módulos
    initModules() {
        // Inicializar chat
        Chats.init();
        
        // Inicializar configuración
        Settings.init();
        
        // Configurar tema
        this.initTheme();
        
        // Configurar manejador de errores global
        this.initErrorHandler();
    }
    
    // Inicializar tema
    initTheme() {
        const savedTheme = localStorage.getItem('brk_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Actualizar iconos del toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icons = themeToggle.querySelectorAll('.theme-icon');
            icons.forEach(icon => {
                icon.classList.toggle('hidden', 
                    (icon.classList.contains('sun') && savedTheme === 'dark') ||
                    (icon.classList.contains('moon') && savedTheme === 'light')
                );
            });
        }
    }
    
    // Inicializar manejador de errores
    initErrorHandler() {
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
            
            // Mostrar error al usuario de forma amigable
            if (!event.error.handled) {
                ModalManager.createModal({
                    title: 'Error del Sistema',
                    type: 'error',
                    content: `
                        <div class="error-modal">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h4>Ocurrió un error inesperado</h4>
                            <p>${event.error.message || 'Error desconocido'}</p>
                            <details>
                                <summary>Detalles técnicos</summary>
                                <pre>${event.error.stack}</pre>
                            </details>
                        </div>
                    `,
                    buttons: [
                        {
                            text: 'Cerrar',
                            class: 'btn-secondary',
                            action: 'close'
                        },
                        {
                            text: 'Reportar',
                            class: 'btn-primary',
                            action: 'report'
                        }
                    ]
                });
                
                event.error.handled = true;
            }
        });
    }
    
    // Mostrar loading
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('active');
    }
    
    // Ocultar loading
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('active');
    }
    
    // Manejar error de inicialización
    handleInitError(error) {
        console.error('Error crítico en dashboard:', error);
        
        ModalManager.createModal({
            title: 'Error de Inicialización',
            type: 'error',
            content: `
                <div class="init-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h4>No se pudo inicializar el dashboard</h4>
                    <p>${error.message}</p>
                    <div class="error-actions">
                        <button class="btn btn-primary" id="retryInit">
                            Reintentar
                        </button>
                        <button class="btn btn-secondary" id="logoutInit">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            `
        });
        
        document.getElementById('retryInit')?.addEventListener('click', () => {
            ModalManager.hide();
            this.init();
        });
        
        document.getElementById('logoutInit')?.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }
    
    // Verificar notificaciones pendientes
    async checkPendingNotifications() {
        try {
            const response = await ApiClient.get('/api/notifications/pending');
            if (response.count > 0) {
                this.showNotificationBadge(response.count);
            }
        } catch (error) {
            console.error('Error verificando notificaciones:', error);
        }
    }
    
    // Mostrar badge de notificaciones
    showNotificationBadge(count) {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'block';
        }
    }
    
    // Métodos de secciones específicas (simplificados)
    
    async getClientsContent() {
        return `
            <section class="clients-section">
                <div class="section-header">
                    <h1>Gestión de Clientes</h1>
                    <div class="section-actions">
                        <button class="btn btn-primary" id="addClientBtn">
                            <i class="fas fa-plus"></i> Nuevo Cliente
                        </button>
                    </div>
                </div>
                <div id="clientsTable"></div>
            </section>
        `;
    }
    
    async getLoansContent() {
        return `
            <section class="loans-section">
                <div class="section-header">
                    <h1>Gestión de Préstamos</h1>
                    <div class="section-actions">
                        <button class="btn btn-primary" id="addLoanBtn">
                            <i class="fas fa-plus"></i> Nuevo Préstamo
                        </button>
                    </div>
                </div>
                <div id="loansTable"></div>
            </section>
        `;
    }
    
    async getPaymentsContent() {
        return `
            <section class="payments-section">
                <div class="section-header">
                    <h1>Gestión de Pagos</h1>
                </div>
                <div id="paymentsTable"></div>
            </section>
        `;
    }
    
    async getReportsContent() {
        return `
            <section class="reports-section">
                <div class="section-header">
                    <h1>Reportes</h1>
                </div>
                <div class="reports-grid">
                    <!-- Contenido de reportes -->
                </div>
            </section>
        `;
    }
    
    async getSettingsContent() {
        return `
            <section class="settings-section">
                <div class="section-header">
                    <h1>Configuración</h1>
                </div>
                <div id="settingsContainer"></div>
            </section>
        `;
    }
    
    // Inicializar componentes de sección
    initSectionComponents(sectionId) {
        switch (sectionId) {
            case 'clients':
                this.initClientsSection();
                break;
            case 'loans':
                this.initLoansSection();
                break;
            case 'payments':
                this.initPaymentsSection();
                break;
            case 'settings':
                Settings.renderSettingsUI();
                break;
        }
    }
    
    // Inicializar sección de clientes
    initClientsSection() {
        TableManager.init('clientsTable', {
            endpoint: Constants.ENDPOINTS.CLIENTS,
            columns: Constants.TABLE_CONFIGS.CLIENTS.columns,
            pageSize: 10,
            showSearch: true,
            showPagination: true,
            actions: ['view', 'edit', 'delete'],
            onEdit: (id) => {
                Triggers.showClientForm(id);
            },
            onDelete: (id) => {
                return ApiClient.deleteClient(id);
            }
        });
        
        document.getElementById('addClientBtn')?.addEventListener('click', () => {
            Triggers.showClientForm();
        });
    }
    
    // Inicializar sección de préstamos
    initLoansSection() {
        TableManager.init('loansTable', {
            endpoint: Constants.ENDPOINTS.LOANS,
            columns: Constants.TABLE_CONFIGS.LOANS.columns,
            pageSize: 10,
            showSearch: true,
            showPagination: true,
            actions: ['view', 'edit', 'delete'],
            onEdit: (id) => {
                Triggers.showLoanForm(id);
            },
            onDelete: (id) => {
                return ApiClient.delete(`/api/loans/${id}`);
            }
        });
        
        document.getElementById('addLoanBtn')?.addEventListener('click', () => {
            Triggers.showLoanForm();
        });
    }
    
    // Inicializar sección de pagos
    initPaymentsSection() {
        TableManager.init('paymentsTable', {
            endpoint: Constants.ENDPOINTS.PAYMENTS,
            columns: [
                { key: 'id', label: 'ID', sortable: true },
                { key: 'cliente', label: 'Cliente', sortable: true },
                { key: 'prestamo', label: 'Préstamo' },
                { key: 'monto', label: 'Monto', sortable: true },
                { key: 'fecha', label: 'Fecha', sortable: true },
                { key: 'estado', label: 'Estado', sortable: true },
                { key: 'acciones', label: 'Acciones' }
            ],
            pageSize: 10,
            showSearch: true,
            showPagination: true,
            actions: ['view', 'edit']
        });
    }
    
    // Ver cliente
    viewClient(id) {
        ModalManager.createModal({
            title: 'Detalles del Cliente',
            size: 'lg',
            content: `
                <div class="client-details">
                    <div class="loading-details">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Cargando detalles...</p>
                    </div>
                </div>
            `
        });
        
        // Cargar datos del cliente
        setTimeout(async () => {
            try {
                const client = await ApiClient.get(`/api/clients/${id}`);
                
                document.querySelector('.client-details').innerHTML = `
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Nombre:</label>
                            <span>${client.nombre}</span>
                        </div>
                        <div class="detail-item">
                            <label>Documento:</label>
                            <span>${client.documento}</span>
                        </div>
                        <div class="detail-item">
                            <label>Teléfono:</label>
                            <span>${client.telefono}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${client.email || 'No especificado'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Dirección:</label>
                            <span>${client.direccion || 'No especificada'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Estado:</label>
                            <span class="badge ${client.estado === 'activo' ? 'badge-success' : 'badge-danger'}">
                                ${client.estado}
                            </span>
                        </div>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error cargando cliente:', error);
                document.querySelector('.client-details').innerHTML = `
                    <div class="error-details">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error cargando detalles del cliente</p>
                    </div>
                `;
            }
        }, 500);
    }
    
    // Ver préstamo
    viewLoan(id) {
        ModalManager.createModal({
            title: 'Detalles del Préstamo',
            size: 'lg',
            content: `
                <div class="loan-details">
                    <div class="loading-details">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Cargando detalles...</p>
                    </div>
                </div>
            `
        });
        
        // Similar a viewClient, implementar según necesidad
    }
    
    // Abrir modal
    openModal(modalId) {
        // Implementar según necesidad
    }
    
    // Mostrar sección
    showSection(sectionId) {
        this.navigateTo(sectionId, `#${sectionId}`);
    }
}

// Instancia global del dashboard
const dashboard = new Dashboard();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    dashboard.init();
});

// Exportar para uso global
window.dashboard = dashboard;