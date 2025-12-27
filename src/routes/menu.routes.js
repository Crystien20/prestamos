const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.authenticate, (req, res) => menuController.getMenu(req, res));

module.exports = router;