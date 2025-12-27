import Helpers from '../utils/Helpers.js';

class TemplateManager {
    constructor() {
        this.templates = new Map();
        this.cache = new Map();
        this.initTemplates();
    }
    
    // Inicializar templates base
    initTemplates() {
        this.registerTemplate('statsCard', (data) => `
            <div class="stat-card ${data.color || ''}">
                <div class="stat-icon">
                    <i class="${data.icon || 'fas fa-chart-bar'}"></i>
                </div>
                <div class="stat-content">
                    <h3 class="stat-value">${data.value || '0'}</h3>
                    <p class="stat-label">${data.label || 'Sin título'}</p>
                </div>
                ${data.trend ? `
                <div class="stat-trend ${data.trend > 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-chevron-${data.trend > 0 ? 'up' : 'down'}"></i>
                    <span>${Math.abs(data.trend)}%</span>
                </div>
                ` : ''}
            </div>
        `);
        
        this.registerTemplate('menuItem', (item) => `
            <a href="${item.url || '#'}" class="menu-item ${item.active ? 'active' : ''}" 
               data-menu="${item.id}" data-action="${item.action || 'navigate'}">
                <div class="menu-icon">
                    <i class="${item.icon || 'fas fa-circle'}"></i>
                </div>
                <span class="menu-text">${item.text}</span>
                ${item.badge ? `
                <span class="menu-badge ${item.badgeColor || ''}">${item.badge}</span>
                ` : ''}
                ${item.children ? '<i class="menu-arrow fas fa-chevron-right"></i>' : ''}
            </a>
        `);
        
        this.registerTemplate('notificationItem', (notification) => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'} ${notification.type || 'info'}">
                <div class="notification-icon">
                    <i class="${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-title">${notification.title || 'Notificación'}</p>
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${Helpers.formatDate(notification.timestamp, 'DD/MM/YYYY HH:mm')}</span>
                </div>
                ${!notification.read ? '<div class="notification-dot"></div>' : ''}
            </div>
        `);
        
        this.registerTemplate('userCard', (user) => `
            <div class="user-card">
                <div class="user-avatar">
                    <img src="${user.avatar || '/assets/user.svg'}" alt="${user.name}">
                    ${user.status ? `<span class="user-status ${user.status}"></span>` : ''}
                </div>
                <div class="user-info">
                    <h4 class="user-name">${user.name}</h4>
                    <p class="user-role">${user.role}</p>
                    <p class="user-email">${user.email}</p>
                </div>
                <div class="user-actions">
                    ${user.actions ? user.actions.map(action => `
                        <button class="btn btn-sm ${action.class || 'btn-secondary'}" 
                                data-action="${action.action}" 
                                data-user-id="${user.id}">
                            <i class="${action.icon}"></i>
                        </button>
                    `).join('') : ''}
                </div>
            </div>
        `);
        
        this.registerTemplate('emptyState', (config) => `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="${config.icon || 'fas fa-inbox'}"></i>
                </div>
                <h3 class="empty-title">${config.title || 'No hay datos'}</h3>
                <p class="empty-message">${config.message || 'No se encontraron registros para mostrar'}</p>
                ${config.action ? `
                <button class="btn btn-primary empty-action" data-action="${config.action}">
                    <i class="${config.actionIcon || 'fas fa-plus'}"></i>
                    ${config.actionText || 'Agregar nuevo'}
                </button>
                ` : ''}
            </div>
        `);
    }
    
    // Registrar template
    registerTemplate(name, templateFunction) {
        this.templates.set(name, templateFunction);
    }
    
    // Renderizar template
    render(templateName, data, cacheKey = null) {
        // Verificar cache
        if (cacheKey && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        const template = this.templates.get(templateName);
        if (!template) {
            console.error(`Template ${templateName} no encontrado`);
            return '';
        }
        
        try {
            const result = template(data);
            
            // Guardar en cache si hay key
            if (cacheKey) {
                this.cache.set(cacheKey, result);
            }
            
            return result;
        } catch (error) {
            console.error(`Error renderizando template ${templateName}:`, error);
            return '';
        }
    }
    
    // Renderizar lista
    renderList(templateName, items, containerId, clear = true) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor ${containerId} no encontrado`);
            return;
        }
        
        if (clear) {
            container.innerHTML = '';
        }
        
        items.forEach(item => {
            const html = this.render(templateName, item);
            if (html) {
                container.insertAdjacentHTML('beforeend', html);
            }
        });
    }
    
    // Renderizar con callback
    renderWithCallback(templateName, data, callback) {
        const html = this.render(templateName, data);
        if (html && callback) {
            callback(html);
        }
        return html;
    }
    
    // Obtener icono de notificación
    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            message: 'fas fa-envelope',
            system: 'fas fa-cog',
            payment: 'fas fa-credit-card',
            loan: 'fas fa-hand-holding-usd',
            client: 'fas fa-user-plus'
        };
        
        return icons[type] || icons.info;
    }
    
    // Limpiar cache
    clearCache(cacheKey = null) {
        if (cacheKey) {
            this.cache.delete(cacheKey);
        } else {
            this.cache.clear();
        }
    }
    
    // Renderizar HTML dinámico desde string
    renderFromString(templateString, data) {
        return templateString.replace(/\${([^}]+)}/g, (match, key) => {
            return data[key.trim()] || '';
        });
    }
    
    // Renderizar componente complejo
    renderComponent(componentName, data) {
        switch (componentName) {
            case 'pagination':
                return this.renderPagination(data);
            case 'breadcrumb':
                return this.renderBreadcrumb(data);
            case 'alert':
                return this.renderAlert(data);
            default:
                return '';
        }
    }
    
    // Renderizar paginación
    renderPagination({ currentPage, totalPages, onPageChange }) {
        let pages = '';
        
        // Botón anterior
        pages += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" 
                   ${currentPage === 1 ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Números de página
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        if (start > 1) {
            pages += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
                ${start > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            `;
        }
        
        for (let i = start; i <= end; i++) {
            pages += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        if (end < totalPages) {
            pages += `
                ${end < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Botón siguiente
        pages += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" 
                   ${currentPage === totalPages ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        return `
            <nav>
                <ul class="pagination justify-content-center">
                    ${pages}
                </ul>
            </nav>
        `;
    }
    
    // Renderizar breadcrumb
    renderBreadcrumb(items) {
        const itemsHTML = items.map((item, index) => `
            <li class="breadcrumb-item ${index === items.length - 1 ? 'active' : ''}">
                ${index === items.length - 1 ? item.text : `
                <a href="${item.url || '#'}">${item.text}</a>
                `}
            </li>
        `).join('');
        
        return `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    ${itemsHTML}
                </ol>
            </nav>
        `;
    }
    
    // Renderizar alerta
    renderAlert({ type, title, message, dismissible }) {
        return `
            <div class="alert alert-${type} ${dismissible ? 'alert-dismissible' : ''}" role="alert">
                ${dismissible ? `
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                ` : ''}
                ${title ? `<h4 class="alert-heading">${title}</h4>` : ''}
                <p>${message}</p>
            </div>
        `;
    }
}

export default new TemplateManager();