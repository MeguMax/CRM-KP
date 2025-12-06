const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validateEmail, validateClient } = require('../middleware/validation');
const emailService = require('../services/emailService');

const router = express.Router();

router.use(authenticate);

// Test email connection
router.get('/test', async (req, res) => {
    try {
        const result = await emailService.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send custom email
router.post('/send', validateEmail, async (req, res) => {
    try {
        const { to, subject, html, text } = req.body;
        const result = await emailService.sendEmail({ to, subject, html, text });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send welcome email to client
router.post('/welcome', validateClient, async (req, res) => {
    try {
        const client = req.body;
        const result = await emailService.sendWelcomeEmail(client);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send deal notification email
router.post('/deal-notification', async (req, res) => {
    try {
        const { client, deal } = req.body;
        const result = await emailService.sendDealNotification(client, deal);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;