const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.authenticate);

router.post('/update', (req, res) => locationController.updateLocation(req, res));
router.get('/collectors', (req, res) => locationController.getCollectorLocations(req, res));
router.get('/clients', (req, res) => locationController.getClientLocations(req, res));

module.exports = router;