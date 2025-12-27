import ApiClient from '../core/ApiClient.js';
import ModalManager from '../core/ModalManager.js';
import TableManager from '../core/TableManager.js';
import FormManager from '../core/FormManager.js';
import TemplateManager from '../core/TemplateManager.js';
import Helpers from '../utils/Helpers.js';

class Triggers {
    constructor() {
        this.triggers = new Map();
        this.initGlobalTriggers();
    }
    
    // Inicializar triggers globales
    initGlobalTriggers() {
        // Theme toggle
        this.registerTrigger('theme-toggle', (element) => {
            element.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('brk_theme', newTheme);
                
                // Actualizar icono
                element.querySelector('.theme-icon').classList.toggle('hidden');
                element.querySelectorAll('.theme-icon').forEach(icon => {
                    icon.classList.toggle('hidden');
                });
            });
        });
        
        // Sidebar toggle
        this.registerTrigger('menu-toggle', (element) => {
            element.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('collapsed');
                document.querySelector('.main-content').classList.toggle('expanded');
            });
        });
        
        // Logout
        this.registerTrigger('btn-logout', (element) => {
            element.addEventListener('click', async () => {
                const confirmed = await ModalManager.confirm({
                    title: 'Cerrar Sesión',
                    message: '¿Estás seguro de que deseas cerrar sesión?',
                    confirmText: 'Cerrar Sesión'
                });
                
                if (confirmed) {
                    try {
                        await ApiClient.post('/api/auth/logout');
                    } catch (error) {
                        console.error('Error en logout:', error);
                    } finally {
                        localStorage.clear();
                        window.location.href = '/';
                    }
                }
            });
        });
        
        // Global search
        this.registerTrigger('global-search', (element) => {
            element.addEventListener('input', Helpers.debounce((e) => {
                const searchTerm = e.target.value.trim();
                if (searchTerm.length > 2) {
                    this.executeGlobalSearch(searchTerm);
                }
            }, 500));
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const searchTerm = e.target.value.trim();
                    if (searchTerm) {
                        this.executeGlobalSearch(searchTerm);
                    }
                }
            });
        });
        
        // Add client button
        this.registerTrigger('btn-add-client', (element) => {
            element.addEventListener('click', () => {
                this.showClientForm();
            });
        });
        
        // Add loan button
        this.registerTrigger('btn-add-loan', (element) => {
            element.addEventListener('click', () => {
                this.showLoanForm();
            });
        });
        
        // Notifications button
        this.registerTrigger('btn-notifications', (element) => {
            element.addEventListener('click', () => {
                this.showNotifications();
            });
        });
    }
    
    // Registrar trigger
    registerTrigger(name, handler) {
        this.triggers.set(name, handler);
    }
    
    // Aplicar triggers
    applyTriggers() {
        this.triggers.forEach((handler, name) => {
            const elements = document.querySelectorAll(`[id^="${name}"], [data-trigger="${name}"]`);
            elements.forEach(element => handler(element));
        });
        
        // Aplicar triggers dinámicos
        this.applyDynamicTriggers();
    }
    
    // Aplicar triggers dinámicos
    applyDynamicTriggers() {
        // Tooltips
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
                
                e.target._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    delete e.target._tooltip;
                }
            });
        });
        
        // Confirm dialogs
        document.querySelectorAll('[data-confirm]').forEach(element => {
            element.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const message = element.dataset.confirm || '¿Estás seguro de realizar esta acción?';
                const confirmed = await ModalManager.confirm({
                    title: 'Confirmar',
                    message: message
                });
                
                if (confirmed && element.href && element.href !== '#') {
                    window.location.href = element.href;
                } else if (confirmed && element.dataset.action) {
                    this.executeAction(element.dataset.action, element.dataset);
                }
            });
        });
        
        // Copy to clipboard
        document.querySelectorAll('[data-copy]').forEach(element => {
            element.addEventListener('click', async (e) => {
                const text = element.dataset.copy || element.textContent;
                const success = await Helpers.copyToClipboard(text);
                
                if (success) {
                    const originalText = element.innerHTML;
                    element.innerHTML = '<i class="fas fa-check"></i> Copiado';
                    
                    setTimeout(() => {
                        element.innerHTML = originalText;
                    }, 2000);
                }
            });
        });
        
        // Dynamic forms
        document.querySelectorAll('[data-form]').forEach(element => {
            element.addEventListener('click', () => {
                const formType = element.dataset.form;
                this.showDynamicForm(formType, element.dataset);
            });
        });
    }
    
    // Ejecutar búsqueda global
    async executeGlobalSearch(searchTerm) {
        try {
            const results = await ApiClient.get('/api/search', { q: searchTerm });
            
            if (results.length > 0) {
                this.showSearchResults(results);
            } else {
                this.showNoResults(searchTerm);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    }
    
    // Mostrar resultados de búsqueda
    showSearchResults(results) {
        const modalId = ModalManager.createModal({
            title: 'Resultados de Búsqueda',
            size: 'lg',
            content: `
                <div class="search-results">
                    ${results.map(result => `
                        <div class="search-result-item">
                            <div class="result-icon">
                                <i class="${this.getResultIcon(result.type)}"></i>
                            </div>
                            <div class="result-content">
                                <h4>${result.title}</h4>
                                <p>${result.description}</p>
                                <span class="result-type">${result.type}</span>
                            </div>
                            <div class="result-actions">
                                <button class="btn btn-sm btn-primary" data-action="view" data-id="${result.id}" data-type="${result.type}">
                                    Ver
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `
        });
        
        // Vincular eventos de resultados
        document.querySelectorAll(`#${modalId} [data-action]`).forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                
                this.navigateToResult(type, id);
                ModalManager.hide();
            });
        });
    }
    
    // Mostrar sin resultados
    showNoResults(searchTerm) {
        ModalManager.createModal({
            title: 'Sin Resultados',
            size: 'sm',
            content: `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron resultados para "<strong>${searchTerm}</strong>"</p>
                </div>
            `,
            buttons: [
                {
                    text: 'Cerrar',
                    class: 'btn-secondary',
                    action: 'close'
                }
            ]
        });
    }
    
    // Obtener icono de resultado
    getResultIcon(type) {
        const icons = {
            client: 'fas fa-user',
            loan: 'fas fa-hand-holding-usd',
            payment: 'fas fa-credit-card',
            user: 'fas fa-user-tie',
            document: 'fas fa-file',
            note: 'fas fa-sticky-note'
        };
        
        return icons[type] || 'fas fa-search';
    }
    
    // Navegar a resultado
    navigateToResult(type, id) {
        const routes = {
            client: `/clientes/${id}`,
            loan: `/prestamos/${id}`,
            payment: `/pagos/${id}`,
            user: `/usuarios/${id}`
        };
        
        const route = routes[type];
        if (route) {
            // Implementar navegación en el sistema
            console.log(`Navegar a: ${route}`);
            // window.location.href = route;
        }
    }
    
    // Mostrar formulario de cliente
    async showClientForm(clientId = null) {
        const title = clientId ? 'Editar Cliente' : 'Nuevo Cliente';
        const fields = Constants.FORM_TEMPLATES.CLIENT.fields;
        
        // Si hay ID, cargar datos del cliente
        let initialData = {};
        if (clientId) {
            try {
                const client = await ApiClient.get(`/api/clients/${clientId}`);
                initialData = client;
            } catch (error) {
                console.error('Error cargando cliente:', error);
            }
        }
        
        ModalManager.form({
            title: title,
            fields: fields,
            size: 'lg',
            onSubmit: async (formData) => {
                if (clientId) {
                    return await ApiClient.updateClient(clientId, formData);
                } else {
                    return await ApiClient.createClient(formData);
                }
            }
        }).then(result => {
            if (result) {
                TableManager.loadData('clientsTable');
                this.showNotification(
                    clientId ? 'Cliente actualizado' : 'Cliente creado',
                    'success'
                );
            }
        });
    }
    
    // Mostrar formulario de préstamo
    async showLoanForm(loanId = null) {
        // Cargar clientes para el select
        let clients = [];
        try {
            const clientsData = await ApiClient.getClients();
            clients = clientsData.rows || [];
        } catch (error) {
            console.error('Error cargando clientes:', error);
        }
        
        const fields = Constants.FORM_TEMPLATES.LOAN.fields;
        
        // Actualizar opciones de clientes
        const clientField = fields.find(f => f.name === 'cliente_id');
        if (clientField && clients.length > 0) {
            clientField.options = clients.map(client => ({
                value: client.id,
                label: `${client.nombre} (${client.documento})`
            }));
        }
        
        ModalManager.form({
            title: loanId ? 'Editar Préstamo' : 'Nuevo Préstamo',
            fields: fields,
            size: 'lg',
            onSubmit: async (formData) => {
                if (loanId) {
                    return await ApiClient.put(`/api/loans/${loanId}`, formData);
                } else {
                    return await ApiClient.createLoan(formData);
                }
            }
        }).then(result => {
            if (result) {
                TableManager.loadData('loansTable');
                this.showNotification(
                    loanId ? 'Préstamo actualizado' : 'Préstamo creado',
                    'success'
                );
            }
        });
    }
    
    // Mostrar notificaciones
    async showNotifications() {
        try {
            const notifications = await ApiClient.get('/api/notifications');
            
            ModalManager.createModal({
                title: 'Notificaciones',
                size: 'md',
                content: `
                    <div class="notifications-container">
                        ${notifications.length > 0 ? notifications.map(notif => `
                            <div class="notification-item ${notif.read ? 'read' : 'unread'}">
                                <div class="notification-icon">
                                    <i class="${TemplateManager.getNotificationIcon(notif.type)}"></i>
                                </div>
                                <div class="notification-content">
                                    <h5>${notif.title}</h5>
                                    <p>${notif.message}</p>
                                    <small>${Helpers.formatDate(notif.created_at, 'DD/MM/YYYY HH:mm')}</small>
                                </div>
                                ${!notif.read ? `
                                <button class="btn-notification-mark" data-id="${notif.id}">
                                    <i class="fas fa-check"></i>
                                </button>
                                ` : ''}
                            </div>
                        `).join('') : `
                            <div class="empty-notifications">
                                <i class="fas fa-bell-slash"></i>
                                <p>No tienes notificaciones</p>
                            </div>
                        `}
                    </div>
                `,
                buttons: notifications.length > 0 ? [{
                    text: 'Marcar todas como leídas',
                    class: 'btn-secondary',
                    action: 'mark-all-read'
                }] : []
            });
            
            // Vincular eventos de notificaciones
            document.querySelectorAll('.btn-notification-mark').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.closest('button').dataset.id;
                    await ApiClient.put(`/api/notifications/${id}/read`);
                    e.target.closest('.notification-item').classList.add('read');
                    e.target.closest('button').remove();
                });
            });
            
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        }
    }
    
    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Ejecutar acción
    executeAction(action, data) {
        switch (action) {
            case 'refresh':
                window.location.reload();
                break;
                
            case 'print':
                window.print();
                break;
                
            case 'export':
                this.exportData(data.type);
                break;
                
            case 'import':
                this.importData(data.type);
                break;
                
            default:
                console.log(`Acción ${action} no implementada`);
        }
    }
    
    // Exportar datos
    exportData(type) {
        // Implementar exportación
        console.log(`Exportando ${type}`);
    }
    
    // Importar datos
    importData(type) {
        // Implementar importación
        console.log(`Importando ${type}`);
    }
}

export default new Triggers();