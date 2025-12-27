// server.js - CON ORDEN CORRECTO
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');

console.log('🚀 BRK Software - MODO PRODUCCIÓN');
console.log('📅 Inicio:', new Date().toISOString());
console.log('🔐 JWT Secret configurado:', !!process.env.JWT_SECRET);
console.log('🗄️  Base de datos:', process.env.DB_NAME || 'No configurada');

const app = express();
const server = http.createServer(app);

// ===========================================
// MIDDLEWARE DE PRODUCCIÓN
// ===========================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"]
        }
    }
}));

// CORS solo para dominios específicos en producción
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400 // 24 horas
};
app.use(cors(corsOptions));

// Compresión GZIP
app.use(compression({ level: 6 }));

// Parseo de JSON con límite
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===========================================
// RATE LIMITING DE PRODUCCIÓN
// ===========================================
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 intentos por IP
    message: { 
        success: false, 
        message: 'Demasiados intentos de login. Intente más tarde.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // 200 peticiones por 15 minutos
    message: { 
        success: false, 
        message: 'Demasiadas solicitudes. Intente más tarde.' 
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Aplicar rate limiting
app.use('/api/auth/login', loginLimiter);
app.use('/api/', apiLimiter);

// ===========================================
// MANEJO DE RUTAS .well-known (IMPORTANTE: ANTES del logger)
// ===========================================
app.get('/.well-known/*', (req, res) => {
    // Responder con 204 (No Content) silenciosamente
    // Esto evita que Chrome y otros servicios vean errores 404
    res.status(204).end();
});

// ===========================================
// SERVIR ARCHIVOS ESTÁTICOS
// ===========================================
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    index: false,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
    maxAge: '7d'
}));

// ===========================================
// LOGGER DE PRODUCCIÓN (OPTIMIZADO)
// ===========================================
app.use((req, res, next) => {
    const start = Date.now();
    const originalUrl = req.originalUrl;
    
    // RUTAS QUE IGNORAMOS COMPLETAMENTE (ni siquiera entran al logger)
    const silentPaths = [
        '/.well-known/',           // Ya manejado arriba, pero por si acaso
        '/favicon.ico',
        '/robots.txt'
    ];
    
    // Si es una ruta silenciosa, solo pasamos
    if (silentPaths.some(path => originalUrl.startsWith(path))) {
        return next();
    }
    
    // Rutas que loggeamos pero con menos detalle
    const quietPaths = [
        '/assets/',
        '.css',
        '.js',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.ico'
    ];
    
    const isQuietPath = quietPaths.some(path => 
        originalUrl.startsWith(path) || originalUrl.endsWith(path)
    );
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        
        // Solo loggear si no es ruta silenciosa
        if (!silentPaths.some(path => originalUrl.startsWith(path))) {
            
            const timestamp = new Date().toISOString();
            const method = req.method.padEnd(7);
            const url = originalUrl.length > 50 ? 
                originalUrl.substring(0, 47) + '...' : 
                originalUrl.padEnd(50);
            const durationStr = `${duration}ms`.padStart(6);
            const ip = req.ip;
            
            let logMessage = `${timestamp} | ${method} ${url} | ${status} | ${durationStr} | ${ip}`;
            
            // Log detallado para rutas importantes
            if (!isQuietPath) {
                if (status >= 500) {
                    console.error(`🔥 ${logMessage}`);
                    console.error(`   🚨 Error grave en: ${originalUrl}`);
                } else if (status >= 400) {
                    console.warn(`⚠️  ${logMessage}`);
                } else if (status >= 300) {
                    console.log(`↪️  ${logMessage}`);
                } else if (status >= 200) {
                    console.log(`✅ ${logMessage}`);
                }
                
                // Info extra para API y dashboard
                if (originalUrl.startsWith('/api/')) {
                    console.log(`   📡 API: ${req.method} ${originalUrl}`);
                }
                if (originalUrl === '/dashboard') {
                    console.log(`   👤 Dashboard acceso desde: ${ip}`);
                }
            } 
            // Log minimalista para assets
            else if (process.env.LOG_ASSETS === 'true') {
                console.log(`📦 ${duration}ms | ${originalUrl}`);
            }
        }
    });
    
    next();
});

// ===========================================
// IMPORTAR RUTAS Y MIDDLEWARE
// ===========================================
const authRoutes = require('./src/routes/auth.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const menuRoutes = require('./src/routes/menu.routes');
const locationRoutes = require('./src/routes/location.routes');
const authMiddleware = require('./src/middleware/auth');

// ===========================================
// RUTAS PÚBLICAS
// ===========================================
app.use('/api/auth', authRoutes);

// ===========================================
// RUTAS PROTEGIDAS
// ===========================================
app.use('/api/dashboard', authMiddleware.authenticate, dashboardRoutes);
app.use('/api/menu', authMiddleware.authenticate, menuRoutes);
app.use('/api/location', authMiddleware.authenticate, locationRoutes);

// ===========================================
// RUTAS DE SISTEMA
// ===========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Ruta de estado del sistema
app.get('/health', (req, res) => {
    res.json({
        status: 'operational',
        service: 'BRK Software API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'production',
        database: process.env.DB_NAME ? 'configured' : 'not-configured'
    });
});

// Ruta de prueba API
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API BRK Software funcionando',
        timestamp: new Date().toISOString(),
        environment: 'production'
    });
});

// Verificación de autenticación
app.get('/api/verify-auth', authMiddleware.authenticate, (req, res) => {
    res.json({
        success: true,
        authenticated: true,
        user: {
            id: req.userId,
            level: req.userLevel,
            identifier: req.userIdentifier,
            fullName: req.userFullName
        }
    });
});

// ===========================================
// MANEJO DE ERRORES
// ===========================================
app.use((req, res) => {
    console.warn(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl} desde ${req.ip}`);
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error('🔥 ERROR DEL SISTEMA:', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: 'Error interno del servidor',
        errorId: Date.now().toString(36)
    });
});

// ===========================================
// CONFIGURACIÓN DEL SERVIDOR
// ===========================================
server.setTimeout(30000);
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// ===========================================
// INICIAR SERVIDOR
// ===========================================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log('\n🔌 Conectando a base de datos...');
        const database = require('./src/config/database');
        await database.connect();
        
        server.listen(PORT, '0.0.0.0', () => {
            console.log('\n' + '='.repeat(50));
            console.log('🚀 BRK SOFTWARE - PRODUCCIÓN');
            console.log('='.repeat(50));
            console.log(`📡 URL Principal: http://localhost:${PORT}`);
            console.log(`🔐 Dashboard: http://localhost:${PORT}/dashboard`);
            console.log(`📊 API Health: http://localhost:${PORT}/health`);
            console.log(`🔧 API Test: http://localhost:${PORT}/api/test`);
            console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
            console.log(`🕐 Inicio: ${new Date().toISOString()}`);
            console.log('='.repeat(50) + '\n');
        });
        
    } catch (error) {
        console.error('❌ ERROR CRÍTICO AL INICIAR:', error.message);
        process.exit(1);
    }
};

startServer();