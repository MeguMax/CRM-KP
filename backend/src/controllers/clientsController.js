const Client = require('../models/Client');

// @desc    Get all clients for authenticated user
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ createdBy: req.user.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: clients.length,
            data: clients
        });
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
exports.getClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }

        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
    try {
        const { name, email, phone, company, status } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name and email'
            });
        }

        // Check if client with this email already exists for this user
        const existingClient = await Client.findOne({
            email: email.toLowerCase(),
            createdBy: req.user.userId
        });

        if (existingClient) {
            return res.status(400).json({
                success: false,
                error: 'Client with this email already exists'
            });
        }

        const client = await Client.create({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            company: company || '',
            status: status || 'active',
            createdBy: req.user.userId
        });

        res.status(201).json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
    try {
        const { name, email, phone, company, status } = req.body;

        let client = await Client.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }

        // Update fields
        client.name = name || client.name;
        client.email = email ? email.toLowerCase() : client.email;
        client.phone = phone !== undefined ? phone : client.phone;
        client.company = company !== undefined ? company : client.company;
        client.status = status || client.status;
        client.updatedAt = Date.now();

        await client.save();

        res.json({
            success: true,
            data: client
        });
    } catch (error) {
        console.error('Update client error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
