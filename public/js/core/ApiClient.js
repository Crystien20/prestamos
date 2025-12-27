import Constants from '../utils/Constants.js';
import Helpers from '../utils/Helpers.js';

class ApiClient {
    constructor() {
        this.baseURL = Constants.API_BASE_URL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }
    
    // Obtiene token del localStorage
    getToken() {
        return localStorage.getItem(Constants.STORAGE_KEYS.TOKEN);
    }
    
    // Configura headers con autenticación
    getHeaders(includeAuth = true) {
        const headers = { ...this.defaultHeaders };
        
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }
    
    // Manejo genérico de peticiones
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders(options.includeAuth !== false);
        
        try {
            const response = await fetch(url, {
                headers,
                ...options
            });
            
            // Si es 401, token expirado
            if (response.status === 401) {
                this.handleUnauthorized();
                return null;
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            this.showError(error.message);
            throw error;
        }
    }
    
    // Métodos HTTP específicos
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    
    // Manejo de token expirado
    handleUnauthorized() {
        localStorage.removeItem(Constants.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(Constants.STORAGE_KEYS.USER_DATA);
        window.location.href = '/';
    }
    
    // Mostrar error
    showError(message) {
        // Se puede integrar con un sistema de notificaciones
        console.error('Error:', message);
        alert(message); // Temporal, se reemplaza por sistema de notificaciones
    }
    
    // Métodos específicos de la aplicación
    
    // Dashboard
    async getDashboardStats() {
        return this.get(Constants.ENDPOINTS.DASHBOARD_STATS);
    }
    
    // Menú
    async getMenu() {
        return this.get(Constants.ENDPOINTS.MENU);
    }
    
    // Clientes
    async getClients(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `${Constants.ENDPOINTS.CLIENTS}?${query}` : Constants.ENDPOINTS.CLIENTS;
        return this.get(endpoint);
    }
    
    async createClient(data) {
        return this.post(Constants.ENDPOINTS.CLIENTS, data);
    }
    
    async updateClient(id, data) {
        return this.put(`${Constants.ENDPOINTS.CLIENTS}/${id}`, data);
    }
    
    async deleteClient(id) {
        return this.delete(`${Constants.ENDPOINTS.CLIENTS}/${id}`);
    }
    
    // Préstamos
    async getLoans(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `${Constants.ENDPOINTS.LOANS}?${query}` : Constants.ENDPOINTS.LOANS;
        return this.get(endpoint);
    }
    
    async createLoan(data) {
        return this.post(Constants.ENDPOINTS.LOANS, data);
    }
    
    // Configuración
    async getSettings() {
        return this.get(Constants.ENDPOINTS.SETTINGS);
    }
    
    async updateSettings(data) {
        return this.put(Constants.ENDPOINTS.SETTINGS, data);
    }
}

export default new ApiClient();