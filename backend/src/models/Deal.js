const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Deal title is required'],
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    value: {
        type: Number,
        required: [true, 'Deal value is required'],
        min: 0,
    },
    stage: {
        type: String,
        enum: ['lead', 'qualification', 'proposal', 'negotiation', 'closed'],
        default: 'lead',
    },
    expectedCloseDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Deal', dealSchema);
