const express = require('express');
const {
    getDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal,
} = require('../controllers/dealsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getDeals);
router.get('/:id', getDeal);
router.post('/', createDeal);
router.put('/:id', updateDeal);
router.delete('/:id', deleteDeal);

module.exports = router;
