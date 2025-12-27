import ApiClient from '../core/ApiClient.js';
import FormManager from '../core/FormManager.js';
import ModalManager from '../core/ModalManager.js';
import Helpers from '../utils/Helpers.js';

class Settings {
    constructor() {
        this.settings = {};
        this.categories = [
            'general',
            'security',
            'notifications',
            'appearance',
            'backup',
            'advanced'
        ];
    }
    
    // Inicializar configuración
    async init() {
        await this.loadSettings();
        this.renderSettingsUI();
        this.bindEvents();
    }
    
    // Cargar configuración
    async loadSettings() {
        try {
            const response = await ApiClient.get('/api/settings');
            this.settings = response.settings || {};
            
            // Cargar configuración del localStorage como fallback
            const localSettings = localStorage.getItem('brk_settings');
            if (localSettings) {
                this.settings = { ...JSON.parse(localSettings), ...this.settings };
            }
            
        } catch (error) {
            console.error('Error cargando configuración:', error);
            this.settings = this.getDefaultSettings();
        }
    }
    
    // Obtener configuración por defecto
    getDefaultSettings() {
        return {
            general: {
                language: 'es',
                timezone: 'America/Bogota',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: '24h',
                currency: 'COP'
            },
            security: {
                twoFactorAuth: false,
                sessionTimeout: 30,
                passwordExpiry: 90,
                loginNotifications: true
            },
            notifications: {
                email: true,
                push: true,
                sound: true,
                desktop: true,
                loanAlerts: true,
                paymentReminders: true,
                systemUpdates: true
            },
            appearance: {
                theme: 'light',
                density: 'comfortable',
                fontSize: 'medium',
                sidebarColor: 'default',
                animations: true
            },
            backup: {
                autoBackup: false,
                backupFrequency: 'daily',
                backupTime: '02:00',
                keepBackups: 30,
                cloudBackup: false
            },
            advanced: {
                debugMode: false,
                analytics: true,
                autoUpdate: true,
                logsRetention: 90,
                apiAccess: false
            }
        };
    }
    
    // Renderizar UI de configuración
    renderSettingsUI() {
        const container = document.getElementById('settingsContainer');
        if (!container) return;
        
        const settingsHTML = `
            <div class="settings-container">
                <div class="settings-sidebar">
                    <h3 class="settings-title">Configuración</h3>
                    <nav class="settings-nav">
                        ${this.categories.map(category => `
                            <button class="settings-nav-item ${category === 'general' ? 'active' : ''}" 
                                    data-category="${category}">
                                <i class="fas fa-${this.getCategoryIcon(category)}"></i>
                                <span>${this.getCategoryName(category)}</span>
                            </button>
                        `).join('')}
                    </nav>
                </div>
                
                <div class="settings-content">
                    <div class="settings-header">
                        <h2 id="settingsCategoryTitle">General</h2>
                        <p id="settingsCategoryDescription">Configuración general del sistema</p>
                    </div>
                    
                    <div class="settings-form-container">
                        <form id="settingsForm" class="settings-form">
                            <!-- Formulario cargado dinámicamente -->
                        </form>
                    </div>
                    
                    <div class="settings-footer">
                        <button class="btn btn-secondary" id="btnResetSettings">
                            <i class="fas fa-undo"></i> Restablecer
                        </button>
                        <button class="btn btn-primary" id="btnSaveSettings">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = settingsHTML;
        
        // Cargar primera categoría
        this.loadCategory('general');
    }
    
    // Obtener icono de categoría
    getCategoryIcon(category) {
        const icons = {
            general: 'cog',
            security: 'shield-alt',
            notifications: 'bell',
            appearance: 'palette',
            backup: 'database',
            advanced: 'sliders-h'
        };
        return icons[category] || 'cog';
    }
    
    // Obtener nombre de categoría
    getCategoryName(category) {
        const names = {
            general: 'General',
            security: 'Seguridad',
            notifications: 'Notificaciones',
            appearance: 'Apariencia',
            backup: 'Copia de Seguridad',
            advanced: 'Avanzado'
        };
        return names[category] || category;
    }
    
    // Cargar categoría
    loadCategory(category) {
        const form = document.getElementById('settingsForm');
        if (!form) return;
        
        const categorySettings = this.settings[category] || {};
        const fields = this.getCategoryFields(category);
        
        // Renderizar campos
        const fieldsHTML = fields.map(field => this.renderSettingField(field, categorySettings)).join('');
        
        form.innerHTML = fieldsHTML;
        form.dataset.category = category;
        
        // Actualizar título
        const title = document.getElementById('settingsCategoryTitle');
        const description = document.getElementById('settingsCategoryDescription');
        
        if (title) title.textContent = this.getCategoryName(category);
        if (description) description.textContent = this.getCategoryDescription(category);
        
        // Actualizar navegación activa
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === category) {
                item.classList.add('active');
            }
        });
    }
    
    // Obtener descripción de categoría
    getCategoryDescription(category) {
        const descriptions = {
            general: 'Configuración general del sistema y preferencias básicas',
            security: 'Configuración de seguridad y privacidad',
            notifications: 'Configuración de notificaciones y alertas',
            appearance: 'Personalización de la apariencia del sistema',
            backup: 'Configuración de copias de seguridad y recuperación',
            advanced: 'Configuración avanzada del sistema'
        };
        return descriptions[category] || 'Configuración del sistema';
    }
    
    // Obtener campos de categoría
    getCategoryFields(category) {
        const fieldTemplates = {
            general: [
                {
                    type: 'select',
                    name: 'language',
                    label: 'Idioma',
                    options: [
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' },
                        { value: 'pt', label: 'Português' }
                    ],
                    help: 'Idioma de la interfaz'
                },
                {
                    type: 'select',
                    name: 'timezone',
                    label: 'Zona Horaria',
                    options: this.getTimezones(),
                    help: 'Zona horaria para fechas y horas'
                },
                {
                    type: 'select',
                    name: 'dateFormat',
                    label: 'Formato de Fecha',
                    options: [
                        { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA' },
                        { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA' },
                        { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD' }
                    ]
                },
                {
                    type: 'select',
                    name: 'timeFormat',
                    label: 'Formato de Hora',
                    options: [
                        { value: '24h', label: '24 horas' },
                        { value: '12h', label: '12 horas (AM/PM)' }
                    ]
                },
                {
                    type: 'select',
                    name: 'currency',
                    label: 'Moneda',
                    options: [
                        { value: 'COP', label: 'Peso Colombiano (COP)' },
                        { value: 'USD', label: 'Dólar Americano (USD)' },
                        { value: 'EUR', label: 'Euro (EUR)' }
                    ]
                }
            ],
            
            security: [
                {
                    type: 'checkbox',
                    name: 'twoFactorAuth',
                    label: 'Autenticación de Dos Factores',
                    help: 'Requiere código de verificación adicional al iniciar sesión'
                },
                {
                    type: 'number',
                    name: 'sessionTimeout',
                    label: 'Tiempo de Espera de Sesión (minutos)',
                    min: 5,
                    max: 240,
                    help: 'Tiempo de inactividad antes de cerrar sesión automáticamente'
                },
                {
                    type: 'number',
                    name: 'passwordExpiry',
                    label: 'Caducidad de Contraseña (días)',
                    min: 30,
                    max: 365,
                    help: 'Días después de los cuales se debe cambiar la contraseña'
                },
                {
                    type: 'checkbox',
                    name: 'loginNotifications',
                    label: 'Notificaciones de Inicio de Sesión',
                    help: 'Recibir notificación cuando se inicie sesión desde un dispositivo nuevo'
                }
            ],
            
            notifications: [
                {
                    type: 'checkbox',
                    name: 'email',
                    label: 'Notificaciones por Correo'
                },
                {
                    type: 'checkbox',
                    name: 'push',
                    label: 'Notificaciones Push'
                },
                {
                    type: 'checkbox',
                    name: 'sound',
                    label: 'Sonido de Notificaciones'
                },
                {
                    type: 'checkbox',
                    name: 'desktop',
                    label: 'Notificaciones de Escritorio'
                },
                {
                    type: 'checkbox',
                    name: 'loanAlerts',
                    label: 'Alertas de Préstamos',
                    help: 'Notificaciones sobre préstamos vencidos o por vencer'
                },
                {
                    type: 'checkbox',
                    name: 'paymentReminders',
                    label: 'Recordatorios de Pagos'
                },
                {
                    type: 'checkbox',
                    name: 'systemUpdates',
                    label: 'Actualizaciones del Sistema'
                }
            ],
            
            appearance: [
                {
                    type: 'select',
                    name: 'theme',
                    label: 'Tema',
                    options: [
                        { value: 'light', label: 'Claro' },
                        { value: 'dark', label: 'Oscuro' },
                        { value: 'auto', label: 'Automático' }
                    ]
                },
                {
                    type: 'select',
                    name: 'density',
                    label: 'Densidad',
                    options: [
                        { value: 'compact', label: 'Compacto' },
                        { value: 'comfortable', label: 'Cómodo' },
                        { value: 'spacious', label: 'Espacioso' }
                    ]
                },
                {
                    type: 'select',
                    name: 'fontSize',
                    label: 'Tamaño de Fuente',
                    options: [
                        { value: 'small', label: 'Pequeño' },
                        { value: 'medium', label: 'Mediano' },
                        { value: 'large', label: 'Grande' }
                    ]
                },
                {
                    type: 'select',
                    name: 'sidebarColor',
                    label: 'Color de la Barra Lateral',
                    options: [
                        { value: 'default', label: 'Por Defecto' },
                        { value: 'dark', label: 'Oscuro' },
                        { value: 'blue', label: 'Azul' },
                        { value: 'green', label: 'Verde' }
                    ]
                },
                {
                    type: 'checkbox',
                    name: 'animations',
                    label: 'Animaciones',
                    help: 'Habilitar animaciones y transiciones'
                }
            ],
            
            backup: [
                {
                    type: 'checkbox',
                    name: 'autoBackup',
                    label: 'Copia de Seguridad Automática'
                },
                {
                    type: 'select',
                    name: 'backupFrequency',
                    label: 'Frecuencia',
                    options: [
                        { value: 'daily', label: 'Diario' },
                        { value: 'weekly', label: 'Semanal' },
                        { value: 'monthly', label: 'Mensual' }
                    ],
                    disabled: true
                },
                {
                    type: 'time',
                    name: 'backupTime',
                    label: 'Hora de Copia'
                },
                {
                    type: 'number',
                    name: 'keepBackups',
                    label: 'Conservar Copias (días)',
                    min: 7,
                    max: 365,
                    help: 'Número de días para conservar las copias de seguridad'
                },
                {
                    type: 'checkbox',
                    name: 'cloudBackup',
                    label: 'Copia en la Nube',
                    help: 'Subir copias de seguridad a almacenamiento en la nube'
                }
            ],
            
            advanced: [
                {
                    type: 'checkbox',
                    name: 'debugMode',
                    label: 'Modo Depuración',
                    help: 'Habilitar logs detallados para desarrollo'
                },
                {
                    type: 'checkbox',
                    name: 'analytics',
                    label: 'Análisis de Uso',
                    help: 'Compartir datos anónimos de uso para mejorar el sistema'
                },
                {
                    type: 'checkbox',
                    name: 'autoUpdate',
                    label: 'Actualizaciones Automáticas'
                },
                {
                    type: 'number',
                    name: 'logsRetention',
                    label: 'Retención de Logs (días)',
                    min: 7,
                    max: 365
                },
                {
                    type: 'checkbox',
                    name: 'apiAccess',
                    label: 'Acceso API',
                    help: 'Habilitar acceso a la API del sistema'
                }
            ]
        };
        
        return fieldTemplates[category] || [];
    }
    
    // Obtener zonas horarias
    getTimezones() {
        return [
            { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
            { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
            { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
            { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
            { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
            { value: 'UTC', label: 'UTC' }
        ];
    }
    
    // Renderizar campo de configuración
    renderSettingField(field, values) {
        const value = values[field.name] !== undefined ? values[field.name] : field.value;
        
        switch (field.type) {
            case 'select':
                return `
                    <div class="form-group">
                        <label class="form-label">${field.label}</label>
                        <select name="${field.name}" class="form-control" ${field.disabled ? 'disabled' : ''}>
                            ${field.options.map(opt => `
                                <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                                    ${opt.label}
                                </option>
                            `).join('')}
                        </select>
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
                
            case 'checkbox':
                return `
                    <div class="form-check">
                        <input type="checkbox" 
                               name="${field.name}" 
                               id="setting_${field.name}" 
                               class="form-check-input" 
                               ${value ? 'checked' : ''}>
                        <label class="form-check-label" for="setting_${field.name}">
                            ${field.label}
                        </label>
                        ${field.help ? `<small class="form-help d-block">${field.help}</small>` : ''}
                    </div>
                `;
                
            case 'time':
                return `
                    <div class="form-group">
                        <label class="form-label">${field.label}</label>
                        <input type="time" 
                               name="${field.name}" 
                               class="form-control" 
                               value="${value || ''}">
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
                
            default:
                return `
                    <div class="form-group">
                        <label class="form-label">${field.label}</label>
                        <input type="${field.type}" 
                               name="${field.name}" 
                               class="form-control" 
                               value="${value || ''}"
                               ${field.min ? `min="${field.min}"` : ''}
                               ${field.max ? `max="${field.max}"` : ''}
                               ${field.step ? `step="${field.step}"` : ''}>
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
        }
    }
    
    // Vincular eventos
    bindEvents() {
        // Navegación entre categorías
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.loadCategory(category);
            });
        });
        
        // Guardar configuración
        const saveBtn = document.getElementById('btnSaveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.saveSettings();
            });
        }
        
        // Restablecer configuración
        const resetBtn = document.getElementById('btnResetSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.resetSettings();
            });
        }
        
        // Cambios en tiempo real para algunos ajustes
        const form = document.getElementById('settingsForm');
        if (form) {
            form.addEventListener('change', (e) => {
                this.handleSettingChange(e.target.name, e.target.value, e.target.checked);
            });
        }
    }
    
    // Manejar cambio de configuración en tiempo real
    handleSettingChange(name, value, checked) {
        const category = document.getElementById('settingsForm')?.dataset.category;
        if (!category) return;
        
        // Actualizar valor en memoria
        if (this.settings[category]) {
            if (typeof checked === 'boolean') {
                this.settings[category][name] = checked;
            } else {
                this.settings[category][name] = value;
            }
        }
        
        // Aplicar cambios inmediatos para ciertas configuraciones
        if (category === 'appearance') {
            if (name === 'theme') {
                document.documentElement.setAttribute('data-theme', value);
                localStorage.setItem('brk_theme', value);
            }
        }
        
        // Guardar en localStorage temporalmente
        this.saveToLocalStorage();
    }
    
    // Guardar configuración
    async saveSettings() {
        const form = document.getElementById('settingsForm');
        const category = form?.dataset.category;
        
        if (!category || !form) return;
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (form.querySelector(`[name="${key}"]`)?.type === 'checkbox') {
                data[key] = form.querySelector(`[name="${key}"]`).checked;
            } else {
                data[key] = value;
            }
        });
        
        // Actualizar en memoria
        this.settings[category] = { ...this.settings[category], ...data };
        
        try {
            // Guardar en servidor
            await ApiClient.put('/api/settings', this.settings);
            
            // Guardar en localStorage
            this.saveToLocalStorage();
            
            // Mostrar mensaje de éxito
            this.showSuccess('Configuración guardada correctamente');
            
        } catch (error) {
            console.error('Error guardando configuración:', error);
            this.showError('Error al guardar la configuración');
        }
    }
    
    // Restablecer configuración
    async resetSettings() {
        const confirmed = await ModalManager.confirm({
            title: 'Restablecer Configuración',
            message: '¿Estás seguro de restablecer todas las configuraciones a sus valores por defecto?',
            confirmText: 'Restablecer'
        });
        
        if (confirmed) {
            try {
                // Obtener configuración por defecto
                const defaultSettings = this.getDefaultSettings();
                
                // Actualizar en servidor
                await ApiClient.put('/api/settings', defaultSettings);
                
                // Actualizar en memoria
                this.settings = defaultSettings;
                
                // Guardar en localStorage
                this.saveToLocalStorage();
                
                // Recargar categoría actual
                const currentCategory = document.getElementById('settingsForm')?.dataset.category || 'general';
                this.loadCategory(currentCategory);
                
                // Aplicar cambios inmediatos
                this.applyImmediateSettings();
                
                this.showSuccess('Configuración restablecida correctamente');
                
            } catch (error) {
                console.error('Error restableciendo configuración:', error);
                this.showError('Error al restablecer la configuración');
            }
        }
    }
    
    // Guardar en localStorage
    saveToLocalStorage() {
        localStorage.setItem('brk_settings', JSON.stringify(this.settings));
    }
    
    // Aplicar configuraciones inmediatas
    applyImmediateSettings() {
        // Aplicar tema
        const theme = this.settings.appearance?.theme || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Aplicar otras configuraciones que afecten la UI inmediatamente
        // (agregar según sea necesario)
    }
    
    // Mostrar éxito
    showSuccess(message) {
        // Implementar notificación
        console.log('Éxito:', message);
        alert(message); // Temporal
    }
    
    // Mostrar error
    showError(message) {
        // Implementar notificación
        console.error('Error:', message);
        alert(message); // Temporal
    }
    
    // Obtener configuración específica
    getSetting(category, key) {
        return this.settings[category]?.[key];
    }
    
    // Establecer configuración específica
    setSetting(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        this.settings[category][key] = value;
        this.saveToLocalStorage();
    }
}

export default new Settings();