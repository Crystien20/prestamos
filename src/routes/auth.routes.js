const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const authController = new AuthController();

// Ruta de login
router.post('/login', (req, res) => authController.login(req, res));

// Ruta para validar token
router.post('/validate', (req, res) => authController.validateToken(req, res));

// Ruta de logout
router.post('/logout', (req, res) => authController.logout(req, res));

// Ruta de verificación de servidor
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor BRK Software funcionando',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        jwtConfigured: !!process.env.JWT_SECRET
    });
});

module.exports = router;