const express = require('express');
const {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
} = require('../controllers/clientsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getClients);
router.get('/:id', getClient);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
