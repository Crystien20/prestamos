import ApiClient from './ApiClient.js';
import ModalManager from './ModalManager.js';
import Helpers from '../utils/Helpers.js';
import Constants from '../utils/Constants.js';

class FormManager {
    constructor() {
        this.forms = new Map();
        this.formTemplates = Constants.FORM_TEMPLATES;
    }
    
    // Inicializar formulario
    init(formId, config) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Formulario ${formId} no encontrado`);
            return;
        }
        
        const defaultConfig = {
            template: null,
            endpoint: '',
            method: 'POST',
            onSubmit: null,
            onSuccess: null,
            onError: null,
            fields: [],
            validation: true,
            resetOnSubmit: true
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        this.forms.set(formId, finalConfig);
        
        // Si hay template, renderizar campos
        if (finalConfig.template) {
            this.renderFormFromTemplate(formId, finalConfig.template);
        }
        
        // Vincular eventos
        this.bindFormEvents(formId);
        
        // Inicializar validación
        if (finalConfig.validation) {
            this.initValidation(formId);
        }
    }
    
    // Renderizar formulario desde template
    renderFormFromTemplate(formId, templateName) {
        const config = this.forms.get(formId);
        const form = document.getElementById(formId);
        const template = this.formTemplates[templateName];
        
        if (!template) {
            console.error(`Template ${templateName} no encontrado`);
            return;
        }
        
        // Renderizar campos
        const fieldsHTML = template.fields.map(field => this.renderField(field)).join('');
        form.innerHTML = fieldsHTML;
        
        // Actualizar configuración
        this.forms.set(formId, { ...config, fields: template.fields });
    }
    
    // Renderizar campo
    renderField(field) {
        const fieldId = `field-${field.name}-${Helpers.generateId()}`;
        
        let fieldHTML = '';
        
        switch (field.type) {
            case 'select':
                fieldHTML = `
                    <div class="form-group" data-field="${field.name}">
                        <label for="${fieldId}" class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                        </label>
                        <select id="${fieldId}" 
                                name="${field.name}" 
                                class="form-control form-select"
                                ${field.required ? 'required' : ''}>
                            ${field.placeholder ? `<option value="">${field.placeholder}</option>` : ''}
                            ${field.options ? field.options.map(opt => `
                                <option value="${opt.value}" ${field.value === opt.value ? 'selected' : ''}>
                                    ${opt.label}
                                </option>
                            `).join('') : ''}
                        </select>
                        <div class="form-error" id="${fieldId}-error"></div>
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
                break;
                
            case 'textarea':
                fieldHTML = `
                    <div class="form-group" data-field="${field.name}">
                        <label for="${fieldId}" class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                        </label>
                        <textarea id="${fieldId}" 
                                  name="${field.name}" 
                                  class="form-control"
                                  rows="${field.rows || 3}"
                                  ${field.required ? 'required' : ''}
                                  ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}>${field.value || ''}</textarea>
                        <div class="form-error" id="${fieldId}-error"></div>
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
                break;
                
            case 'checkbox':
            case 'radio':
                fieldHTML = `
                    <div class="form-group" data-field="${field.name}">
                        <label class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                        </label>
                        <div class="form-${field.type}-group">
                            ${field.options ? field.options.map(opt => `
                                <label class="form-${field.type}-label">
                                    <input type="${field.type}" 
                                           name="${field.name}" 
                                           value="${opt.value}"
                                           class="form-${field.type}"
                                           ${field.value === opt.value ? 'checked' : ''}
                                           ${field.required ? 'required' : ''}>
                                    <span>${opt.label}</span>
                                </label>
                            `).join('') : ''}
                        </div>
                        <div class="form-error" id="${fieldId}-error"></div>
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
                break;
                
            default:
                fieldHTML = `
                    <div class="form-group" data-field="${field.name}">
                        <label for="${fieldId}" class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                        </label>
                        <input type="${field.type}" 
                               id="${fieldId}" 
                               name="${field.name}" 
                               class="form-control"
                               value="${field.value || ''}"
                               ${field.required ? 'required' : ''}
                               ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                               ${field.min ? `min="${field.min}"` : ''}
                               ${field.max ? `max="${field.max}"` : ''}
                               ${field.step ? `step="${field.step}"` : ''}
                               ${field.pattern ? `pattern="${field.pattern}"` : ''}
                               ${field.readonly ? 'readonly' : ''}
                               ${field.disabled ? 'disabled' : ''}>
                        <div class="form-error" id="${fieldId}-error"></div>
                        ${field.help ? `<small class="form-help">${field.help}</small>` : ''}
                    </div>
                `;
        }
        
        return fieldHTML;
    }
    
    // Vincular eventos del formulario
    bindFormEvents(formId) {
        const form = document.getElementById(formId);
        const config = this.forms.get(formId);
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(formId);
        });
        
        // Validación en tiempo real
        if (config.validation) {
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }
    
    // Inicializar validación
    initValidation(formId) {
        const form = document.getElementById(formId);
        
        // Agregar estilos de error
        const style = document.createElement('style');
        style.textContent = `
            .form-control.error {
                border-color: #f72585;
                box-shadow: 0 0 0 0.2rem rgba(247, 37, 133, 0.25);
            }
            .form-error {
                color: #f72585;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: none;
            }
            .form-error.show {
                display: block;
            }
            .required {
                color: #f72585;
                margin-left: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Validar campo individual
    validateField(input) {
        const fieldName = input.name;
        const config = this.forms.get(input.closest('form').id);
        const fieldConfig = config.fields.find(f => f.name === fieldName);
        
        if (!fieldConfig) return true;
        
        const errorElement = document.getElementById(`${input.id}-error`);
        let isValid = true;
        let errorMessage = '';
        
        // Validar requerido
        if (fieldConfig.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        }
        
        // Validar según tipo
        if (input.value.trim() && fieldConfig.validation) {
            const { minLength, maxLength, pattern } = fieldConfig.validation;
            
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
                errorMessage = fieldConfig.validation.message || 'Formato inválido';
            }
        }
        
        // Validaciones específicas por tipo
        if (input.value.trim()) {
            switch (input.type) {
                case 'email':
                    if (!Helpers.validateEmail(input.value)) {
                        isValid = false;
                        errorMessage = 'Correo electrónico inválido';
                    }
                    break;
                    
                case 'tel':
                    if (!Helpers.validatePhone(input.value)) {
                        isValid = false;
                        errorMessage = 'Teléfono inválido';
                    }
                    break;
                    
                case 'number':
                    if (fieldConfig.min && parseFloat(input.value) < fieldConfig.min) {
                        isValid = false;
                        errorMessage = `El valor mínimo es ${fieldConfig.min}`;
                    }
                    if (fieldConfig.max && parseFloat(input.value) > fieldConfig.max) {
                        isValid = false;
                        errorMessage = `El valor máximo es ${fieldConfig.max}`;
                    }
                    break;
            }
        }
        
        // Actualizar UI
        if (isValid) {
            input.classList.remove('error');
            if (errorElement) errorElement.classList.remove('show');
        } else {
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }
        
        return isValid;
    }
    
    // Limpiar error de campo
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) errorElement.classList.remove('show');
    }
    
    // Validar formulario completo
    validateForm(formId) {
        const form = document.getElementById(formId);
        const config = this.forms.get(formId);
        let isValid = true;
        
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Manejar envío del formulario
    async handleSubmit(formId) {
        const form = document.getElementById(formId);
        const config = this.forms.get(formId);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validar formulario
        if (config.validation && !this.validateForm(formId)) {
            this.showFormError(formId, 'Por favor, corrige los errores en el formulario');
            return;
        }
        
        // Obtener datos del formulario
        const formData = this.getFormData(form);
        
        // Mostrar loading
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        }
        
        try {
            let result;
            
            // Si hay función personalizada, usarla
            if (config.onSubmit && typeof config.onSubmit === 'function') {
                result = await config.onSubmit(formData);
            } 
            // Si hay endpoint, hacer petición HTTP
            else if (config.endpoint) {
                switch (config.method.toUpperCase()) {
                    case 'POST':
                        result = await ApiClient.post(config.endpoint, formData);
                        break;
                    case 'PUT':
                        result = await ApiClient.put(config.endpoint, formData);
                        break;
                    default:
                        throw new Error(`Método ${config.method} no soportado`);
                }
            } else {
                throw new Error('No se configuró método de envío para el formulario');
            }
            
            // Éxito
            if (config.onSuccess) {
                config.onSuccess(result, formData);
            } else {
                this.showFormSuccess(formId, 'Operación completada exitosamente');
            }
            
            // Resetear formulario si está configurado
            if (config.resetOnSubmit) {
                form.reset();
                form.querySelectorAll('.form-control.error').forEach(el => {
                    el.classList.remove('error');
                });
                form.querySelectorAll('.form-error.show').forEach(el => {
                    el.classList.remove('show');
                });
            }
            
        } catch (error) {
            console.error('Error en formulario:', error);
            
            if (config.onError) {
                config.onError(error);
            } else {
                this.showFormError(formId, error.message || 'Error al procesar el formulario');
            }
        } finally {
            // Restaurar botón
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }
    
    // Obtener datos del formulario
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            // Manejar múltiples valores (checkboxes)
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                // Convertir a número si es campo numérico
                const input = form.querySelector(`[name="${key}"]`);
                if (input && (input.type === 'number' || input.type === 'range')) {
                    data[key] = value ? parseFloat(value) : null;
                } else {
                    data[key] = value;
                }
            }
        });
        
        return data;
    }
    
    // Mostrar error en formulario
    showFormError(formId, message) {
        const form = document.getElementById(formId);
        let errorContainer = form.querySelector('.form-global-error');
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-global-error alert alert-danger';
            form.prepend(errorContainer);
        }
        
        errorContainer.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorContainer) {
                errorContainer.remove();
            }
        }, 5000);
    }
    
    // Mostrar éxito en formulario
    showFormSuccess(formId, message) {
        const form = document.getElementById(formId);
        let successContainer = form.querySelector('.form-global-success');
        
        if (!successContainer) {
            successContainer = document.createElement('div');
            successContainer.className = 'form-global-success alert alert-success';
            form.prepend(successContainer);
        }
        
        successContainer.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (successContainer) {
                successContainer.remove();
            }
        }, 5000);
    }
    
    // Setear valores del formulario
    setFormValues(formId, data) {
        const form = document.getElementById(formId);
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    // Para checkboxes y radios
                    form.querySelectorAll(`[name="${key}"]`).forEach(option => {
                        option.checked = option.value == data[key];
                    });
                } else if (input.type === 'select-multiple') {
                    // Para select múltiple
                    const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                    Array.from(input.options).forEach(option => {
                        option.selected = values.includes(option.value);
                    });
                } else {
                    // Para otros tipos
                    input.value = data[key];
                }
            }
        });
    }
    
    // Resetear formulario
    resetForm(formId) {
        const form = document.getElementById(formId);
        form.reset();
        
        // Limpiar errores
        form.querySelectorAll('.form-control.error').forEach(el => {
            el.classList.remove('error');
        });
        form.querySelectorAll('.form-error.show').forEach(el => {
            el.classList.remove('show');
        });
        
        const errorContainer = form.querySelector('.form-global-error');
        if (errorContainer) errorContainer.remove();
        
        const successContainer = form.querySelector('.form-global-success');
        if (successContainer) successContainer.remove();
    }
    
    // Habilitar/deshabilitar formulario
    setFormDisabled(formId, disabled) {
        const form = document.getElementById(formId);
        form.querySelectorAll('input, select, textarea, button').forEach(el => {
            if (el.type !== 'submit' && el.type !== 'button') {
                el.disabled = disabled;
            }
        });
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = disabled;
            if (disabled) {
                submitBtn.innerHTML = '<i class="fas fa-lock"></i> Bloqueado';
            }
        }
    }
}

export default new FormManager();