// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const database = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'brk_software_secret_key_2023';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            
            console.log('🔐 Intento de login para:', username, 'desde IP:', req.ip);

            if (!username || !password) {
                console.warn('⚠️ Credenciales incompletas desde IP:', req.ip);
                return res.status(400).json({
                    success: false,
                    message: 'Usuario y contraseña son requeridos'
                });
            }

            // Validar longitud de credenciales
            if (username.length > 50 || password.length > 100) {
                console.warn('⚠️ Credenciales demasiado largas:', username);
                return res.status(400).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Buscar usuario en base de datos
            const user = await database.getUserByCredentials(username, password);
            
            if (!user) {
                console.warn('❌ Login fallido para:', username, 'desde IP:', req.ip);
                return res.status(401).json({
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                });
            }

            console.log('✅ Login exitoso para:', user.usuario);

            // Crear payload del token
            const tokenData = {
                id: user.idusuario,
                username: user.usuario,
                level: user.nivel,
                identifier: user.ididentificador,
                fullName: user.nombre_completo || user.usuario,
                loginTime: Date.now()
            };

            // Generar token JWT
            const token = jwt.sign(tokenData, JWT_SECRET, { 
                expiresIn: JWT_EXPIRES_IN 
            });
            
            console.log('✅ Token generado para:', user.usuario);

            res.json({
                success: true,
                message: 'Autenticación exitosa',
                data: {
                    token,
                    user: tokenData
                }
            });

        } catch (error) {
            console.error('🔥 ERROR EN LOGIN:', {
                error: error.message,
                ip: req.ip,
                username: req.body.username
            });
            
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    async validateToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    valid: false,
                    message: 'Token no proporcionado'
                });
            }

            // Verificar token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            res.json({
                success: true,
                valid: true,
                user: {
                    id: decoded.id,
                    username: decoded.username,
                    level: decoded.level,
                    identifier: decoded.identifier,
                    fullName: decoded.fullName || decoded.username
                }
            });

        } catch (error) {
            console.warn('❌ Validación de token fallida:', error.message);
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    valid: false,
                    message: 'Token inválido'
                });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    valid: false,
                    message: 'Token expirado'
                });
            }
            
            res.status(500).json({
                success: false,
                valid: false,
                message: 'Error validando token'
            });
        }
    }
    
    async logout(req, res) {
        console.log('🔓 Logout solicitado para usuario:', req.userId);
        
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    }
}

module.exports = AuthController;