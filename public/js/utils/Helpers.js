// Funciones utilitarias reutilizables
const Helpers = {
    // Formatea fecha
    formatDate(date, format = 'DD/MM/YYYY') {
        if (!date) return '';
        
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        const formats = {
            'DD/MM/YYYY': `${day}/${month}/${year}`,
            'YYYY-MM-DD': `${year}-${month}-${day}`,
            'DD/MM/YYYY HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
            'full': d.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        return formats[format] || formats['DD/MM/YYYY'];
    },
    
    // Formatea moneda
    formatCurrency(amount, currency = 'COP') {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    // Valida email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Valida teléfono
    validatePhone(phone) {
        const re = /^[\d\s\+\-\(\)]{7,15}$/;
        return re.test(phone);
    },
    
    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para limitar frecuencia
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Capitaliza texto
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    // Trunca texto
    truncate(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },
    
    // Genera ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Copia texto al portapapeles
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error al copiar:', err);
            return false;
        }
    },
    
    // Descarga archivo
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

export default Helpers;