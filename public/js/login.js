// login.js - CON UX DE CARGA
class LoginSystem {
    constructor() {
        this.apiUrl = '/api/auth';
        this.isLoggingIn = false;
        this.steps = [
            { id: 1, text: "Verificando credenciales..." },
            { id: 2, text: "Conectando con el servidor..." },
            { id: 3, text: "Preparando dashboard..." }
        ];
        this.currentStep = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.autoFocus();
        console.log('✅ Sistema de login inicializado - MODO PRODUCCIÓN');
    }

    bindEvents() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('username')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('password')?.focus();
            }
        });

        document.getElementById('password')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.login();
            }
        });
    }

    autoFocus() {
        setTimeout(() => {
            const username = document.getElementById('username');
            if (username) {
                username.focus();
                username.select();
            }
        }, 300);
    }

    showNotification(type, message) {
        const elementId = type === 'success' ? 'message-approve' : 'message-error';
        const element = document.getElementById(elementId);
        
        if (element) {
            const textElement = element.querySelector('.notify__text-content');
            if (textElement) {
                textElement.textContent = message;
                element.classList.add('show');
                
                setTimeout(() => element.classList.remove('show'), 3000);
            }
        }
    }

    updateStep(step) {
        this.currentStep = step;
        
        // Actualizar número de paso
        const stepElement = document.getElementById('current-step');
        if (stepElement) stepElement.textContent = step;
        
        // Actualizar barra de progreso
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const percentage = (step / this.steps.length) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        // Actualizar pasos activos
        document.querySelectorAll('.progress-step').forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            if (stepNum <= step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    showProgressOverlay() {
        // Eliminar overlay existente
        const existing = document.getElementById('login-progress-overlay');
        if (existing) existing.remove();

        // Crear nuevo overlay
        const overlay = document.createElement('div');
        overlay.id = 'login-progress-overlay';
        overlay.className = 'login-progress-overlay';
        overlay.innerHTML = `
            <div class="progress-container">
                <div class="progress-header">
                    <div class="progress-spinner"></div>
                    <h3>Iniciando sesión</h3>
                    <p class="progress-subtitle">Por favor, espere mientras configuramos su entorno</p>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                
                <div class="progress-steps" id="progress-steps">
                    ${this.steps.map(step => `
                        <div class="progress-step" data-step="${step.id}">
                            <span class="step-number">${step.id}</span>
                            <span class="step-text">${step.text}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="progress-status">
                    Paso <span id="current-step">0</span> de ${this.steps.length}
                </div>
                
                <div class="progress-message" id="login-progress">
                    • Iniciando proceso de autenticación...
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animar entrada
        setTimeout(() => {
            overlay.classList.add('active');
            this.updateStep(1);
            this.updateProgressMessage('Verificando credenciales...');
        }, 10);
    }

    hideProgressOverlay() {
        const overlay = document.getElementById('login-progress-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    updateProgressMessage(message) {
        const element = document.getElementById('login-progress');
        if (element) {
            element.textContent = `• ${message}`;
        }
    }

    setLoading(loading) {
        const btn = document.getElementById('login-btn');
        if (!btn) return;

        btn.disabled = loading;
        
        if (loading) {
            this.isLoggingIn = true;
            btn.classList.add('loading');
        } else {
            this.isLoggingIn = false;
            btn.classList.remove('loading');
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async login() {
        if (this.isLoggingIn) {
            console.log('⚠️ Ya hay un login en proceso');
            return;
        }

        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;

        // Validaciones inmediatas
        if (!username) {
            this.showNotification('error', 'Por favor, ingrese su usuario');
            document.getElementById('username')?.focus();
            return;
        }

        if (!password) {
            this.showNotification('error', 'Por favor, ingrese su contraseña');
            document.getElementById('password')?.focus();
            return;
        }

        // Iniciar proceso con simulador de carga visual
        this.setLoading(true);
        this.showProgressOverlay();

        try {
            // PASO 1: Verificar credenciales (animación)
            this.updateStep(1);
            this.updateProgressMessage('Verificando usuario y contraseña...');
            await this.delay(800); // Simulación visual corta
            
            // PASO 2: Conectar con servidor (animación)
            this.updateStep(2);
            this.updateProgressMessage('Conectando con el servidor...');
            await this.delay(600); // Simulación visual

            // Hacer petición REAL al servidor
            const loginData = {
                username,
                password
            };

            this.updateProgressMessage('Validando con el servidor...');
            
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            // Si hay error en las credenciales, detener aquí
            if (!response.ok || !data.success) {
                this.hideProgressOverlay();
                this.setLoading(false);
                
                this.showNotification('error', data.message || 'Credenciales incorrectas');
                document.getElementById('password')?.focus();
                document.getElementById('password').value = '';
    document.getElementById('password').value = "123456"; // borrar
                return;
            }

            // Credenciales correctas - continuar con animación
            this.updateProgressMessage('✓ Credenciales válidas');
            await this.delay(300);

            // PASO 3: Preparar dashboard (animación)
            this.updateStep(3);
            this.updateProgressMessage('Preparando dashboard personalizado...');
            await this.delay(600);
            
            this.updateProgressMessage('✓ Configuración completada');
            await this.delay(300);
            
            // Guardar token y datos del usuario
            localStorage.setItem('brk_token', data.data.token);
            localStorage.setItem('brk_user', JSON.stringify(data.data.user));
            
            // Mostrar notificación de éxito
            this.showNotification('success', `¡Bienvenido ${data.data.user.fullName}!`);
            
            // Pequeña pausa para mostrar el mensaje
            await this.delay(800);
            
            // Redirigir al dashboard
            window.location.href = '/dashboard';

        } catch (error) {
            console.error('❌ Error en login:', error);
            
            this.hideProgressOverlay();
            this.setLoading(false);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showNotification('error', 'Error de conexión con el servidor');
            } else {
                this.showNotification('error', 'Error en el proceso de autenticación');
            }
            
            document.getElementById('password')?.focus();
        }
    }

    // Verificar si ya hay una sesión activa
    checkExistingSession() {
        const token = localStorage.getItem('brk_token');
        const user = localStorage.getItem('brk_user');
        
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                console.log('✅ Sesión existente para:', userData.username);
            } catch (e) {
                localStorage.clear();
            }
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.loginSystem = new LoginSystem();
    window.loginSystem.checkExistingSession();
    
    document.getElementById('username').value = "master_MASTER"; // borrar
    document.getElementById('password').value = "123456"; // borrar
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.loginSystem) {
            window.loginSystem = new LoginSystem();
            window.loginSystem.checkExistingSession();
        }
    }, 100);
}