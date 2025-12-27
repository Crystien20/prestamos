import Helpers from '../utils/Helpers.js';

class ModalManager {
    constructor() {
        this.container = document.getElementById('modalContainer');
        this.activeModal = null;
        this.init();
    }
    
    init() {
        // Crear overlay si no existe
        if (!document.querySelector('.modal-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'modal-overlay';
            document.body.appendChild(this.overlay);
        }
    }
    
    // Crear modal básico
    createModal(options = {}) {
        const modalId = options.id || `modal-${Helpers.generateId()}`;
        
        const modalHTML = `
            <div class="modal-container ${options.size ? 'modal-' + options.size : ''} ${options.type ? 'modal-' + options.type : ''}" id="${modalId}">
                <div class="modal-header">
                    <h3 class="modal-title">${options.title || 'Modal'}</h3>
                    <button class="modal-close" data-modal-close>&times;</button>
                </div>
                <div class="modal-body">
                    ${options.content || ''}
                </div>
                ${options.buttons ? `
                <div class="modal-footer">
                    ${options.buttons.map(btn => `
                        <button class="btn ${btn.class || 'btn-primary'}" 
                                data-action="${btn.action || 'close'}"
                                ${btn.id ? `id="${btn.id}"` : ''}>
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
        
        this.overlay.innerHTML = modalHTML;
        this.activeModal = modalId;
        this.bindEvents();
        this.show();
        
        return modalId;
    }
    
    // Modal de confirmación
    confirm(options = {}) {
        return new Promise((resolve) => {
            const modalId = this.createModal({
                title: options.title || 'Confirmar',
                type: 'confirm',
                size: 'sm',
                content: `
                    <div class="modal-confirm">
                        <div class="modal-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <p>${options.message || '¿Estás seguro de realizar esta acción?'}</p>
                    </div>
                `,
                buttons: [
                    {
                        text: options.cancelText || 'Cancelar',
                        class: 'btn-secondary',
                        action: 'cancel'
                    },
                    {
                        text: options.confirmText || 'Confirmar',
                        class: 'btn-danger',
                        action: 'confirm'
                    }
                ]
            });
            
            // Manejar eventos de botones
            document.querySelectorAll(`#${modalId} [data-action]`).forEach(button => {
                button.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    this.hide();
                    resolve(action === 'confirm');
                });
            });
        });
    }
    
    // Modal de formulario
    form(options = {}) {
        return new Promise((resolve) => {
            const formId = `form-${Helpers.generateId()}`;
            const fieldsHTML = options.fields.map(field => this.renderField(field)).join('');
            
            const modalId = this.createModal({
                title: options.title || 'Formulario',
                type: 'form',
                size: options.size || 'lg',
                content: `
                    <form id="${formId}" class="modal-form">
                        <div class="form-grid">
                            ${fieldsHTML}
                        </div>
                    </form>
                `,
                buttons: [
                    {
                        text: options.cancelText || 'Cancelar',
                        class: 'btn-secondary',
                        action: 'cancel'
                    },
                    {
                        text: options.submitText || 'Guardar',
                        class: 'btn-primary',
                        action: 'submit',
                        id: 'modalSubmitBtn'
                    }
                ]
            });
            
            const form = document.getElementById(formId);
            const submitBtn = document.getElementById('modalSubmitBtn');
            
            // Validación en tiempo real
            if (options.fields) {
                options.fields.forEach(field => {
                    const input = form.querySelector(`[name="${field.name}"]`);
                    if (input && field.validation) {
                        input.addEventListener('blur', () => this.validateField(input, field));
                    }
                });
            }
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (this.validateForm(form, options.fields)) {
                    const formData = this.getFormData(form);
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
                    
                    try {
                        const result = await options.onSubmit(formData);
                        this.hide();
                        resolve(result);
                    } catch (error) {
                        console.error('Form error:', error);
                        submitBtn.disabled = false;
                        submitBtn.textContent = options.submitText || 'Guardar';
                    }
                }
            });
            
            // Botón cancelar
            document.querySelector(`#${modalId} [data-action="cancel"]`).addEventListener('click', () => {
                this.hide();
                resolve(null);
            });
        });
    }
    
    // Renderizar campo de formulario
    renderField(field) {
        const fieldId = `field-${Helpers.generateId()}`;
        
        switch (field.type) {
            case 'select':
                return `
                    <div class="form-group">
                        <label for="${fieldId}" class="form-label">${field.label}</label>
                        <select class="form-select" id="${fieldId}" name="${field.name}" ${field.required ? 'required' : ''}>
                            ${field.placeholder ? `<option value="">${field.placeholder}</option>` : ''}
                            ${field.options.map(opt => `
                                <option value="${opt.value}" ${field.value === opt.value ? 'selected' : ''}>
                                    ${opt.label}
                                </option>
                            `).join('')}
                        </select>
                        <div class="field-error" id="${fieldId}-error"></div>
                    </div>
                `;
                
            case 'textarea':
                return `
                    <div class="form-group">
                        <label for="${fieldId}" class="form-label">${field.label}</label>
                        <textarea class="form-control" id="${fieldId}" name="${field.name}" 
                                  rows="${field.rows || 3}" 
                                  placeholder="${field.placeholder || ''}"
                                  ${field.required ? 'required' : ''}>${field.value || ''}</textarea>
                        <div class="field-error" id="${fieldId}-error"></div>
                    </div>
                `;
                
            default:
                return `
                    <div class="form-group">
                        <label for="${fieldId}" class="form-label">${field.label}</label>
                        <input type="${field.type}" 
                               class="form-control" 
                               id="${fieldId}" 
                               name="${field.name}"
                               value="${field.value || ''}"
                               placeholder="${field.placeholder || ''}"
                               ${field.min ? `min="${field.min}"` : ''}
                               ${field.max ? `max="${field.max}"` : ''}
                               ${field.step ? `step="${field.step}"` : ''}
                               ${field.required ? 'required' : ''}>
                        <div class="field-error" id="${fieldId}-error"></div>
                    </div>
                `;
        }
    }
    
    // Validar campo individual
    validateField(input, field) {
        const errorElement = document.getElementById(`${input.id}-error`);
        let isValid = true;
        let errorMessage = '';
        
        if (field.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else if (field.validation) {
            const { minLength, maxLength, pattern } = field.validation;
            
            if (minLength && input.value.length < minLength) {
                isValid = false;
                errorMessage = `Mínimo ${minLength} caracteres`;
            }
            
            if (maxLength && input.value.length > maxLength) {
                isValid = false;
                errorMessage = `Máximo ${maxLength} caracteres`;
            }
            
            if (pattern && !new RegExp(pattern).test(input.value)) {
                isValid = false;
                errorMessage = field.validation.message || 'Formato inválido';
            }
        }
        
        if (isValid) {
            input.classList.remove('error');
            errorElement.textContent = '';
        } else {
            input.classList.add('error');
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }
    
    // Validar formulario completo
    validateForm(form, fields) {
        let isValid = true;
        
        fields.forEach(field => {
            const input = form.querySelector(`[name="${field.name}"]`);
            if (input && !this.validateField(input, field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Obtener datos del formulario
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            // Convertir a número si es campo numérico
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type === 'number') {
                data[key] = parseFloat(value);
            } else {
                data[key] = value;
            }
        });
        
        return data;
    }
    
    // Mostrar modal
    show() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Ocultar modal
    hide() {
        this.overlay.classList.remove('active');
        this.overlay.innerHTML = '';
        this.activeModal = null;
        document.body.style.overflow = '';
    }
    
    // Vincular eventos
    bindEvents() {
        // Cerrar al hacer clic en overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
        
        // Cerrar con botón
        const closeBtn = this.overlay.querySelector('[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide();
            }
        });
    }
}

export default new ModalManager();