const Deal = require('../models/Deal');
const Client = require('../models/Client');

// @desc    Get all deals for authenticated user
// @route   GET /api/deals
// @access  Private
exports.getDeals = async (req, res) => {
    try {
        const deals = await Deal.find({ createdBy: req.user.userId })
            .populate('clientId', 'name email company')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: deals.length,
            data: deals
        });
    } catch (error) {
        console.error('Get deals error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single deal
// @route   GET /api/deals/:id
// @access  Private
exports.getDeal = async (req, res) => {
    try {
        const deal = await Deal.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        }).populate('clientId', 'name email company');

        if (!deal) {
            return res.status(404).json({
                success: false,
                error: 'Deal not found'
            });
        }

        res.json({
            success: true,
            data: deal
        });
    } catch (error) {
        console.error('Get deal error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
exports.createDeal = async (req, res) => {
    try {
        const { title, clientId, value, stage, expectedCloseDate, description } = req.body;

        // Validation
        if (!title || !clientId || !value) {
            return res.status(400).json({
                success: false,
                error: 'Please provide title, client, and value'
            });
        }

        // Verify client belongs to user
        const client = await Client.findOne({
            _id: clientId,
            createdBy: req.user.userId
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                error: 'Client not found'
            });
        }

        const deal = await Deal.create({
            title,
            clientId,
            value,
            stage: stage || 'lead',
            expectedCloseDate: expectedCloseDate || new Date(Date.now() + 30*24*60*60*1000), // 30 days default
            description: description || '',
            createdBy: req.user.userId
        });

        // Populate client info
        await deal.populate('clientId', 'name email company');

        res.status(201).json({
            success: true,
            data: deal
        });
    } catch (error) {
        console.error('Create deal error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
exports.updateDeal = async (req, res) => {
    try {
        const { title, value, stage, expectedCloseDate, description } = req.body;

        let deal = await Deal.findOne({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                error: 'Deal not found'
            });
        }

        // Update fields
        deal.title = title || deal.title;
        deal.value = value !== undefined ? value : deal.value;
        deal.stage = stage || deal.stage;
        deal.expectedCloseDate = expectedCloseDate || deal.expectedCloseDate;
        deal.description = description !== undefined ? description : deal.description;
        deal.updatedAt = Date.now();

        await deal.save();
        await deal.populate('clientId', 'name email company');

        res.json({
            success: true,
            data: deal
        });
    } catch (error) {
        console.error('Update deal error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
exports.deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.userId
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                error: 'Deal not found'
            });
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Delete deal error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
