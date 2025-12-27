import ApiClient from '../core/ApiClient.js';
import Helpers from '../utils/Helpers.js';

class Chats {
    constructor() {
        this.socket = null;
        this.messages = [];
        this.contacts = [];
        this.currentChat = null;
        this.initialized = false;
    }
    
    // Inicializar chat
    async init() {
        if (this.initialized) return;
        
        try {
            // Cargar contactos
            await this.loadContacts();
            
            // Configurar WebSocket
            this.setupWebSocket();
            
            // Vincular eventos del chat
            this.bindChatEvents();
            
            // Cargar historial si hay chat activo
            if (this.currentChat) {
                await this.loadChatHistory(this.currentChat);
            }
            
            this.initialized = true;
            
        } catch (error) {
            console.error('Error inicializando chat:', error);
        }
    }
    
    // Cargar contactos
    async loadContacts() {
        try {
            const response = await ApiClient.get('/api/chat/contacts');
            this.contacts = response.contacts || [];
            
            // Renderizar lista de contactos
            this.renderContacts();
            
            // Seleccionar primer contacto si no hay chat activo
            if (!this.currentChat && this.contacts.length > 0) {
                this.selectContact(this.contacts[0].id);
            }
            
        } catch (error) {
            console.error('Error cargando contactos:', error);
        }
    }
    
    // Configurar WebSocket
    setupWebSocket() {
        const token = localStorage.getItem('brk_token');
        const wsUrl = `ws://${window.location.host}/ws/chat?token=${token}`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('Chat conectado');
            this.updateConnectionStatus(true);
        };
        
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleIncomingMessage(message);
        };
        
        this.socket.onclose = () => {
            console.log('Chat desconectado');
            this.updateConnectionStatus(false);
            
            // Intentar reconectar después de 5 segundos
            setTimeout(() => this.setupWebSocket(), 5000);
        };
        
        this.socket.onerror = (error) => {
            console.error('Error en WebSocket:', error);
        };
    }
    
    // Vincular eventos del chat
    bindChatEvents() {
        // Envío de mensaje
        const sendBtn = document.getElementById('sendChat');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Toggle chat
        const chatToggle = document.getElementById('chatToggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                const chatWidget = document.getElementById('chatWidget');
                chatWidget.classList.toggle('collapsed');
                
                const icon = chatToggle.querySelector('i');
                if (chatWidget.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-up';
                } else {
                    icon.className = 'fas fa-chevron-down';
                    // Enfocar input cuando se expande
                    if (chatInput) chatInput.focus();
                }
            });
        }
        
        // Buscar en chat
        const chatSearch = document.getElementById('chatSearch');
        if (chatSearch) {
            chatSearch.addEventListener('input', Helpers.debounce((e) => {
                this.searchInChat(e.target.value);
            }, 300));
        }
    }
    
    // Renderizar contactos
    renderContacts() {
        const contactsList = document.getElementById('contactsList');
        if (!contactsList) return;
        
        const contactsHTML = this.contacts.map(contact => `
            <div class="contact-item ${contact.id === this.currentChat ? 'active' : ''}" 
                 data-contact-id="${contact.id}">
                <div class="contact-avatar">
                    <img src="${contact.avatar || '/assets/user.svg'}" alt="${contact.name}">
                    ${contact.online ? '<span class="online-dot"></span>' : ''}
                </div>
                <div class="contact-info">
                    <h4 class="contact-name">${contact.name}</h4>
                    <p class="contact-last-message">${contact.lastMessage || 'No hay mensajes'}</p>
                </div>
                <div class="contact-meta">
                    ${contact.unread > 0 ? `
                    <span class="contact-unread">${contact.unread}</span>
                    ` : ''}
                    <span class="contact-time">${contact.lastTime || ''}</span>
                </div>
            </div>
        `).join('');
        
        contactsList.innerHTML = contactsHTML;
        
        // Vincular eventos de contactos
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', () => {
                const contactId = item.dataset.contactId;
                this.selectContact(contactId);
            });
        });
    }
    
    // Seleccionar contacto
    async selectContact(contactId) {
        // Actualizar UI
        document.querySelectorAll('.contact-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-contact-id="${contactId}"]`)?.classList.add('active');
        
        // Actualizar chat actual
        this.currentChat = contactId;
        
        // Cargar historial
        await this.loadChatHistory(contactId);
        
        // Enfocar input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.focus();
        
        // Marcar mensajes como leídos
        await this.markAsRead(contactId);
    }
    
    // Cargar historial del chat
    async loadChatHistory(contactId) {
        try {
            const response = await ApiClient.get(`/api/chat/history/${contactId}`);
            this.messages = response.messages || [];
            
            // Renderizar mensajes
            this.renderMessages();
            
            // Scroll al final
            this.scrollToBottom();
            
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    }
    
    // Renderizar mensajes
    renderMessages() {
        const chatBody = document.getElementById('chatBody');
        if (!chatBody) return;
        
        if (this.messages.length === 0) {
            chatBody.innerHTML = `
                <div class="empty-chat">
                    <i class="fas fa-comments"></i>
                    <p>No hay mensajes aún</p>
                    <small>Envía un mensaje para comenzar la conversación</small>
                </div>
            `;
            return;
        }
        
        const messagesHTML = this.messages.map(message => this.renderMessage(message)).join('');
        chatBody.innerHTML = messagesHTML;
    }
    
    // Renderizar mensaje individual
    renderMessage(message) {
        const isOutgoing = message.sender_id !== this.currentChat;
        const time = Helpers.formatDate(message.timestamp, 'HH:mm');
        
        return `
            <div class="chat-message ${isOutgoing ? 'outgoing' : 'incoming'}">
                <div class="message-content">
                    ${message.content}
                    ${message.attachment ? `
                    <div class="message-attachment">
                        <a href="${message.attachment.url}" target="_blank">
                            <i class="fas fa-paperclip"></i> ${message.attachment.name}
                        </a>
                    </div>
                    ` : ''}
                </div>
                <div class="message-meta">
                    <span class="message-time">${time}</span>
                    ${isOutgoing ? `
                    <span class="message-status ${message.read ? 'read' : 'sent'}">
                        <i class="fas fa-${message.read ? 'check-double' : 'check'}"></i>
                    </span>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Enviar mensaje
    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput || !chatInput.value.trim() || !this.currentChat) return;
        
        const content = chatInput.value.trim();
        
        // Crear objeto mensaje temporal
        const tempMessage = {
            id: `temp-${Date.now()}`,
            content: content,
            sender_id: 'me',
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Agregar a mensajes y renderizar
        this.messages.push(tempMessage);
        this.renderMessages();
        this.scrollToBottom();
        
        // Limpiar input
        chatInput.value = '';
        
        // Enviar al servidor
        try {
            const messageData = {
                receiver_id: this.currentChat,
                content: content
            };
            
            // Enviar por WebSocket si está disponible
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'message',
                    data: messageData
                }));
            } else {
                // Fallback a API REST
                await ApiClient.post('/api/chat/send', messageData);
            }
            
            // Actualizar mensaje temporal con ID real
            // (esto se manejaría con la respuesta del servidor)
            
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            
            // Marcar mensaje como error
            tempMessage.error = true;
            this.renderMessages();
        }
    }
    
    // Manejar mensaje entrante
    handleIncomingMessage(message) {
        if (message.type === 'new_message') {
            // Agregar mensaje
            this.messages.push(message.data);
            this.renderMessages();
            
            // Scroll si es necesario
            const chatBody = document.getElementById('chatBody');
            if (chatBody.scrollTop + chatBody.clientHeight >= chatBody.scrollHeight - 50) {
                this.scrollToBottom();
            }
            
            // Actualizar notificación si el chat no está activo
            if (message.data.sender_id !== this.currentChat) {
                this.showMessageNotification(message.data);
            }
            
            // Actualizar lista de contactos
            this.updateContactLastMessage(message.data);
            
        } else if (message.type === 'message_read') {
            // Marcar mensajes como leídos
            this.messages.forEach(msg => {
                if (msg.sender_id !== 'me' && !msg.read) {
                    msg.read = true;
                }
            });
            this.renderMessages();
            
        } else if (message.type === 'typing') {
            // Mostrar indicador de escritura
            this.showTypingIndicator(message.data.contact_id);
            
        } else if (message.type === 'online_status') {
            // Actualizar estado en línea
            this.updateOnlineStatus(message.data);
        }
    }
    
    // Mostrar notificación de mensaje
    showMessageNotification(message) {
        const contact = this.contacts.find(c => c.id === message.sender_id);
        if (!contact) return;
        
        // Mostrar notificación nativa
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Nuevo mensaje de ${contact.name}`, {
                body: message.content.length > 50 ? 
                    message.content.substring(0, 50) + '...' : 
                    message.content,
                icon: contact.avatar || '/assets/user.svg'
            });
        }
        
        // Actualizar badge
        const badge = document.getElementById('chatBadge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            badge.style.display = 'block';
        }
    }
    
    // Actualizar último mensaje del contacto
    updateContactLastMessage(message) {
        const contactIndex = this.contacts.findIndex(c => c.id === message.sender_id);
        if (contactIndex !== -1) {
            this.contacts[contactIndex].lastMessage = message.content;
            this.contacts[contactIndex].lastTime = Helpers.formatDate(message.timestamp, 'HH:mm');
            
            if (message.sender_id !== this.currentChat) {
                this.contacts[contactIndex].unread = (this.contacts[contactIndex].unread || 0) + 1;
            }
            
            this.renderContacts();
        }
    }
    
    // Mostrar indicador de escritura
    showTypingIndicator(contactId) {
        const chatBody = document.getElementById('chatBody');
        if (!chatBody || contactId !== this.currentChat) return;
        
        // Remover indicador anterior si existe
        const existingIndicator = chatBody.querySelector('.typing-indicator');
        if (existingIndicator) existingIndicator.remove();
        
        // Agregar nuevo indicador
        const indicator = document.createElement('div');
        indicator.className = 'chat-message incoming typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatBody.appendChild(indicator);
        this.scrollToBottom();
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }
    
    // Actualizar estado en línea
    updateOnlineStatus(data) {
        const contactIndex = this.contacts.findIndex(c => c.id === data.contact_id);
        if (contactIndex !== -1) {
            this.contacts[contactIndex].online = data.online;
            this.renderContacts();
        }
    }
    
    // Actualizar estado de conexión
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('chatStatus');
        if (statusElement) {
            statusElement.className = `chat-status ${connected ? 'connected' : 'disconnected'}`;
            statusElement.innerHTML = `
                <i class="fas fa-circle"></i>
                <span>${connected ? 'Conectado' : 'Desconectado'}</span>
            `;
        }
    }
    
    // Marcar mensajes como leídos
    async markAsRead(contactId) {
        try {
            await ApiClient.put(`/api/chat/read/${contactId}`);
            
            // Actualizar UI
            this.messages.forEach(msg => {
                if (msg.sender_id !== 'me') {
                    msg.read = true;
                }
            });
            this.renderMessages();
            
            // Actualizar contactos
            const contactIndex = this.contacts.findIndex(c => c.id === contactId);
            if (contactIndex !== -1) {
                this.contacts[contactIndex].unread = 0;
                this.renderContacts();
            }
            
        } catch (error) {
            console.error('Error marcando como leído:', error);
        }
    }
    
    // Buscar en chat
    searchInChat(query) {
        if (!query.trim()) {
            this.renderMessages();
            return;
        }
        
        const filteredMessages = this.messages.filter(message => 
            message.content.toLowerCase().includes(query.toLowerCase())
        );
        
        const chatBody = document.getElementById('chatBody');
        if (!chatBody) return;
        
        if (filteredMessages.length === 0) {
            chatBody.innerHTML = `
                <div class="empty-search">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron mensajes con "${query}"</p>
                </div>
            `;
            return;
        }
        
        const messagesHTML = filteredMessages.map(message => this.renderMessage(message)).join('');
        chatBody.innerHTML = messagesHTML;
        
        // Resaltar términos de búsqueda
        chatBody.querySelectorAll('.message-content').forEach(element => {
            const html = element.innerHTML;
            const highlighted = html.replace(
                new RegExp(query, 'gi'),
                match => `<mark>${match}</mark>`
            );
            element.innerHTML = highlighted;
        });
    }
    
    // Scroll al final
    scrollToBottom() {
        const chatBody = document.getElementById('chatBody');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
    
    // Enviar archivo
    async sendFile(file) {
        if (!file || !this.currentChat) return;
        
        const formData = new FormData();
        formData.append('receiver_id', this.currentChat);
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/chat/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('brk_token')}`
                },
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Agregar mensaje con archivo
                const message = {
                    id: result.message.id,
                    content: 'Archivo adjunto',
                    sender_id: 'me',
                    timestamp: new Date().toISOString(),
                    attachment: {
                        name: file.name,
                        url: result.fileUrl,
                        type: file.type,
                        size: file.size
                    }
                };
                
                this.messages.push(message);
                this.renderMessages();
                this.scrollToBottom();
            }
            
        } catch (error) {
            console.error('Error subiendo archivo:', error);
        }
    }
    
    // Cerrar chat
    destroy() {
        if (this.socket) {
            this.socket.close();
        }
        this.initialized = false;
    }
}

export default new Chats();