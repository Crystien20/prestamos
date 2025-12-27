const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

router.get('/modules', authMiddleware.authenticate, (req, res) => dashboardController.getModules(req, res));
router.get('/stats', authMiddleware.authenticate, (req, res) => dashboardController.getStats(req, res));

module.exports = router;