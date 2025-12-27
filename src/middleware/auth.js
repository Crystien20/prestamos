// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticate(req, res, next) {
    try {
        // Verificar header de autorización
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.warn('🔒 Intento de acceso sin token:', req.ip, req.originalUrl);
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación requerido'
            });
        }

        // Validar formato Bearer
        if (!authHeader.startsWith('Bearer ')) {
            console.warn('🔒 Formato de token inválido:', req.ip);
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido'
            });
        }

        // Extraer y validar token
        const token = authHeader.substring(7);
        
        if (!token || token === 'null' || token === 'undefined') {
            console.warn('🔒 Token vacío recibido:', req.ip);
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        // Verificar token JWT
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (jwtError) {
            console.warn('🔒 Token inválido:', jwtError.message, 'desde IP:', req.ip);
            
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Sesión expirada'
                });
            }
            
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación inválido'
            });
        }

        // Adjuntar información del usuario
        req.userId = decoded.id;
        req.userLevel = decoded.level;
        req.userIdentifier = decoded.identifier;
        req.userFullName = decoded.fullName || decoded.username;

        next();

    } catch (error) {
        console.error('🔥 ERROR EN AUTENTICACIÓN:', {
            error: error.message,
            ip: req.ip,
            url: req.originalUrl
        });
        
        res.status(500).json({
            success: false,
            message: 'Error interno de autenticación'
        });
    }
}

function requireLevel(allowedLevels) {
    return (req, res, next) => {
        if (!req.userLevel) {
            console.warn('⚠️ Intento de acceso sin nivel de usuario:', req.ip);
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }
        
        if (!allowedLevels.includes(req.userLevel)) {
            console.warn('🚫 Permiso denegado:', {
                userLevel: req.userLevel,
                allowedLevels: allowedLevels,
                ip: req.ip,
                url: req.originalUrl
            });
            return res.status(403).json({
                success: false,
                message: 'Permisos insuficientes para esta acción'
            });
        }
        
        next();
    };
}

module.exports = {
    authenticate,
    requireLevel
};