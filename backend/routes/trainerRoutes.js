const express = require('express');
const { getTrainerClients, getClientDetails } = require('../controllers/trainerController');
const { protectMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// All trainer routes are protected
router.use(protectMiddleware);

// Get all clients for the logged-in trainer
router.get('/clients', authorizeRoles('trainer', 'admin'), getTrainerClients);

// Get a single client's details (diet + workout plans) for the logged-in trainer
router.get('/clients/:id', authorizeRoles('trainer', 'admin'), getClientDetails);

module.exports = router;

