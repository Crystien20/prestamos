import ApiClient from './ApiClient.js';
import ModalManager from './ModalManager.js';
import Helpers from '../utils/Helpers.js';
import Constants from '../utils/Constants.js';

class TableManager {
    constructor() {
        this.tables = new Map();
        this.currentPage = new Map();
        this.pageSize = new Map();
    }
    
    // Inicializar tabla
    async init(tableId, config) {
        const container = document.getElementById(tableId);
        if (!container) {
            console.error(`Contenedor ${tableId} no encontrado`);
            return;
        }
        
        // Configuración por defecto
        const defaultConfig = {
            endpoint: '',
            columns: [],
            pageSize: 10,
            showSearch: true,
            showPagination: true,
            actions: ['view', 'edit', 'delete'],
            onRowClick: null,
            onEdit: null,
            onDelete: null
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        
        // Registrar tabla
        this.tables.set(tableId, finalConfig);
        this.currentPage.set(tableId, 1);
        this.pageSize.set(tableId, finalConfig.pageSize);
        
        // Renderizar estructura
        this.renderTableStructure(tableId, finalConfig);
        
        // Cargar datos
        await this.loadData(tableId);
        
        // Vincular eventos
        this.bindTableEvents(tableId);
    }
    
    // Renderizar estructura de tabla
    renderTableStructure(tableId, config) {
        const container = document.getElementById(tableId);
        
        const tableHTML = `
            <div class="table-container">
                ${config.showSearch ? `
                <div class="table-header">
                    <div class="table-search">
                        <input type="text" class="search-input" 
                               placeholder="Buscar..." 
                               data-table-search="${tableId}">
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    <div class="table-actions">
                        ${config.customActions || ''}
                        <button class="btn btn-primary btn-sm" data-table-refresh="${tableId}">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                ` : ''}
                
                <div class="table-responsive">
                    <table class="table table-striped" data-table="${tableId}">
                        <thead>
                            <tr>
                                ${config.columns.map(col => `
                                    <th ${col.sortable ? `data-sort="${col.key}" style="cursor:pointer"` : ''}>
                                        ${col.label}
                                        ${col.sortable ? '<i class="fas fa-sort"></i>' : ''}
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody data-table-body="${tableId}">
                            <!-- Datos cargados dinámicamente -->
                        </tbody>
                    </table>
                </div>
                
                ${config.showPagination ? `
                <div class="table-footer">
                    <div class="table-info" data-table-info="${tableId}"></div>
                    <div class="table-pagination" data-table-pagination="${tableId}"></div>
                </div>
                ` : ''}
            </div>
        `;
        
        container.innerHTML = tableHTML;
    }
    
    // Cargar datos de la tabla
    async loadData(tableId, page = 1, search = '') {
        const config = this.tables.get(tableId);
        if (!config) return;
        
        this.currentPage.set(tableId, page);
        
        try {
            // Mostrar loading
            const tbody = document.querySelector(`[data-table-body="${tableId}"]`);
            tbody.innerHTML = `
                <tr>
                    <td colspan="${config.columns.length}" class="text-center">
                        <div class="loading-table">
                            <i class="fas fa-spinner fa-spin"></i> Cargando...
                        </div>
                    </td>
                </tr>
            `;
            
            // Parámetros de búsqueda
            const params = {
                page,
                limit: this.pageSize.get(tableId),
                ...(search && { search })
            };
            
            // Obtener datos
            let data;
            if (typeof config.endpoint === 'function') {
                data = await config.endpoint(params);
            } else {
                data = await ApiClient.get(config.endpoint, params);
            }
            
            // Renderizar datos
            this.renderTableData(tableId, data);
            
        } catch (error) {
            console.error('Error cargando tabla:', error);
            this.showTableError(tableId, error.message);
        }
    }
    
    // Renderizar datos en tabla
    renderTableData(tableId, data) {
        const config = this.tables.get(tableId);
        const tbody = document.querySelector(`[data-table-body="${tableId}"]`);
        
        if (!data || !data.rows || data.rows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="${config.columns.length}" class="text-center">
                        <div class="empty-table">
                            <i class="fas fa-inbox"></i>
                            <p>No se encontraron registros</p>
                        </div>
                    </td>
                </tr>
            `;
            this.updatePagination(tableId, { total: 0 });
            return;
        }
        
        // Renderizar filas
        const rowsHTML = data.rows.map(row => this.renderTableRow(tableId, row, config)).join('');
        tbody.innerHTML = rowsHTML;
        
        // Actualizar paginación
        this.updatePagination(tableId, data.pagination || { total: data.rows.length });
    }
    
    // Renderizar fila individual
    renderTableRow(tableId, row, config) {
        const cells = config.columns.map(col => {
            if (col.key === 'acciones') {
                return this.renderActionButtons(tableId, row, config);
            }
            
            let cellValue = row[col.key];
            
            // Formatear según tipo
            if (col.format) {
                if (typeof col.format === 'function') {
                    cellValue = col.format(cellValue, row);
                } else if (col.format === 'currency') {
                    cellValue = Helpers.formatCurrency(cellValue);
                } else if (col.format === 'date') {
                    cellValue = Helpers.formatDate(cellValue);
                } else if (col.format === 'boolean') {
                    cellValue = cellValue ? 
                        '<span class="badge badge-success">Sí</span>' : 
                        '<span class="badge badge-danger">No</span>';
                }
            }
            
            return `<td>${cellValue || '-'}</td>`;
        });
        
        return `<tr data-id="${row.id}">${cells.join('')}</tr>`;
    }
    
    // Renderizar botones de acción
    renderActionButtons(tableId, row, config) {
        const buttons = [];
        
        if (config.actions.includes('view')) {
            buttons.push(`
                <button class="btn-action btn-view" data-action="view" data-id="${row.id}" title="Ver">
                    <i class="fas fa-eye"></i>
                </button>
            `);
        }
        
        if (config.actions.includes('edit') && config.onEdit) {
            buttons.push(`
                <button class="btn-action btn-edit" data-action="edit" data-id="${row.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
            `);
        }
        
        if (config.actions.includes('delete') && config.onDelete) {
            buttons.push(`
                <button class="btn-action btn-delete" data-action="delete" data-id="${row.id}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            `);
        }
        
        return `
            <td class="table-actions-cell">
                <div class="btn-group">
                    ${buttons.join('')}
                </div>
            </td>
        `;
    }
    
    // Actualizar paginación
    updatePagination(tableId, pagination) {
        const infoElement = document.querySelector(`[data-table-info="${tableId}"]`);
        const paginationElement = document.querySelector(`[data-table-pagination="${tableId}"]`);
        
        if (!infoElement || !paginationElement) return;
        
        const pageSize = this.pageSize.get(tableId);
        const currentPage = this.currentPage.get(tableId);
        const totalPages = Math.ceil(pagination.total / pageSize);
        
        // Información
        const start = ((currentPage - 1) * pageSize) + 1;
        const end = Math.min(currentPage * pageSize, pagination.total);
        infoElement.textContent = `Mostrando ${start}-${end} de ${pagination.total} registros`;
        
        // Botones de paginación
        let paginationHTML = '';
        
        // Botón anterior
        paginationHTML += `
            <button class="btn btn-sm ${currentPage === 1 ? 'disabled' : ''}" 
                    data-page="${currentPage - 1}" 
                    ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `
                    <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : ''}" 
                            data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // Botón siguiente
        paginationHTML += `
            <button class="btn btn-sm ${currentPage === totalPages ? 'disabled' : ''}" 
                    data-page="${currentPage + 1}" 
                    ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationElement.innerHTML = paginationHTML;
    }
    
    // Mostrar error en tabla
    showTableError(tableId, message) {
        const config = this.tables.get(tableId);
        const tbody = document.querySelector(`[data-table-body="${tableId}"]`);
        
        tbody.innerHTML = `
            <tr>
                <td colspan="${config.columns.length}" class="text-center error">
                    <div class="error-table">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>${message || 'Error al cargar los datos'}</p>
                        <button class="btn btn-sm btn-primary" data-table-retry="${tableId}">
                            Reintentar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    // Vincular eventos de la tabla
    bindTableEvents(tableId) {
        const config = this.tables.get(tableId);
        
        // Búsqueda con debounce
        const searchInput = document.querySelector(`[data-table-search="${tableId}"]`);
        if (searchInput) {
            searchInput.addEventListener('input', Helpers.debounce((e) => {
                this.loadData(tableId, 1, e.target.value);
            }, 300));
        }
        
        // Ordenamiento
        document.querySelectorAll(`[data-table="${tableId}"] th[data-sort]`).forEach(th => {
            th.addEventListener('click', () => {
                const sortField = th.dataset.sort;
                // Implementar lógica de ordenamiento
                console.log('Ordenar por:', sortField);
            });
        });
        
        // Paginación (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest(`[data-table-pagination="${tableId}"]`)) {
                const pageBtn = e.target.closest('button[data-page]');
                if (pageBtn && !pageBtn.disabled) {
                    const page = parseInt(pageBtn.dataset.page);
                    this.loadData(tableId, page);
                }
            }
        });
        
        // Botón refresh
        const refreshBtn = document.querySelector(`[data-table-refresh="${tableId}"]`);
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadData(tableId, this.currentPage.get(tableId));
            });
        }
        
        // Botón retry en error
        document.addEventListener('click', (e) => {
            if (e.target.closest(`[data-table-retry="${tableId}"]`)) {
                this.loadData(tableId, this.currentPage.get(tableId));
            }
        });
        
        // Acciones de fila (event delegation)
        document.addEventListener('click', (e) => {
            const actionBtn = e.target.closest(`[data-table-body="${tableId}"] [data-action]`);
            if (!actionBtn) return;
            
            const action = actionBtn.dataset.action;
            const id = actionBtn.dataset.id;
            const row = actionBtn.closest('tr');
            
            if (config.onRowClick && action === 'view') {
                config.onRowClick(id, row);
            }
            
            if (config.onEdit && action === 'edit') {
                config.onEdit(id);
            }
            
            if (config.onDelete && action === 'delete') {
                this.handleDelete(tableId, id, config.onDelete);
            }
        });
    }
    
    // Manejar eliminación
    async handleDelete(tableId, id, deleteCallback) {
        const confirmed = await ModalManager.confirm({
            title: 'Confirmar Eliminación',
            message: '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar'
        });
        
        if (confirmed) {
            try {
                await deleteCallback(id);
                await this.loadData(tableId, this.currentPage.get(tableId));
                
                // Mostrar notificación de éxito
                this.showNotification('Registro eliminado correctamente', 'success');
            } catch (error) {
                console.error('Error eliminando:', error);
                this.showNotification('Error al eliminar el registro', 'error');
            }
        }
    }
    
    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Implementar sistema de notificaciones
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message); // Temporal
    }
}

export default new TableManager();