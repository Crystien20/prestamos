// Constantes del sistema
const Constants = {
    // API Endpoints
    API_BASE_URL: '/api',
    ENDPOINTS: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        DASHBOARD_STATS: '/dashboard/stats',
        MENU: '/menu',
        CLIENTS: '/clients',
        LOANS: '/loans',
        PAYMENTS: '/payments',
        USERS: '/users',
        SETTINGS: '/settings',
        CHAT: '/chat'
    },
    
    // Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'brk_token',
        USER_DATA: 'brk_user_data',
        THEME: 'brk_theme',
        SETTINGS: 'brk_settings'
    },
    
    // Table Configurations
    TABLE_CONFIGS: {
        CLIENTS: {
            columns: [
                { key: 'id', label: 'ID', sortable: true },
                { key: 'nombre', label: 'Nombre', sortable: true },
                { key: 'telefono', label: 'Teléfono' },
                { key: 'email', label: 'Email' },
                { key: 'estado', label: 'Estado', sortable: true },
                { key: 'acciones', label: 'Acciones' }
            ],
            pageSize: 10
        },
        LOANS: {
            columns: [
                { key: 'id', label: 'ID', sortable: true },
                { key: 'cliente', label: 'Cliente', sortable: true },
                { key: 'monto', label: 'Monto', sortable: true },
                { key: 'interes', label: 'Interés' },
                { key: 'plazo', label: 'Plazo' },
                { key: 'estado', label: 'Estado', sortable: true },
                { key: 'acciones', label: 'Acciones' }
            ],
            pageSize: 10
        }
    },
    
    // Form Configurations
    FORM_TEMPLATES: {
        CLIENT: {
            title: 'Nuevo Cliente',
            fields: [
                {
                    type: 'text',
                    name: 'nombre',
                    label: 'Nombre Completo',
                    required: true,
                    placeholder: 'Ingrese el nombre',
                    validation: {
                        minLength: 3,
                        maxLength: 100
                    }
                },
                {
                    type: 'email',
                    name: 'email',
                    label: 'Correo Electrónico',
                    required: false,
                    placeholder: 'correo@ejemplo.com'
                },
                {
                    type: 'tel',
                    name: 'telefono',
                    label: 'Teléfono',
                    required: true,
                    placeholder: 'Ingrese el teléfono'
                },
                {
                    type: 'select',
                    name: 'tipo_documento',
                    label: 'Tipo Documento',
                    options: [
                        { value: 'CC', label: 'Cédula' },
                        { value: 'CE', label: 'Cédula Extranjería' },
                        { value: 'NIT', label: 'NIT' }
                    ],
                    required: true
                },
                {
                    type: 'text',
                    name: 'documento',
                    label: 'Número Documento',
                    required: true
                }
            ]
        },
        LOAN: {
            title: 'Nuevo Préstamo',
            fields: [
                {
                    type: 'select',
                    name: 'cliente_id',
                    label: 'Cliente',
                    required: true,
                    options: [], // Se llena dinámicamente
                    placeholder: 'Seleccione un cliente'
                },
                {
                    type: 'number',
                    name: 'monto',
                    label: 'Monto',
                    required: true,
                    min: 10000,
                    step: 1000
                },
                {
                    type: 'number',
                    name: 'interes',
                    label: 'Tasa de Interés (%)',
                    required: true,
                    min: 1,
                    max: 50,
                    step: 0.5
                },
                {
                    type: 'select',
                    name: 'plazo',
                    label: 'Plazo (meses)',
                    options: [
                        { value: 3, label: '3 meses' },
                        { value: 6, label: '6 meses' },
                        { value: 12, label: '12 meses' },
                        { value: 24, label: '24 meses' }
                    ],
                    required: true
                }
            ]
        }
    }
};

export default Constants;