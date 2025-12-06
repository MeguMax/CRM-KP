const Joi = require('joi');

const emailSchema = Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().min(1).max(200).required(),
    html: Joi.string().min(1).required(),
    text: Joi.string().optional()
});

const clientSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().allow(''),
    company: Joi.string().optional().allow(''),
    status: Joi.string().valid('active', 'inactive').required()
});

const dealSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    value: Joi.number().min(0).required(),
    stage: Joi.string().valid('lead', 'qualification', 'proposal', 'negotiation', 'closed').required(),
    clientId: Joi.string().required(),
    expectedCloseDate: Joi.date().required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

module.exports = {
    validateEmail: validate(emailSchema),
    validateClient: validate(clientSchema),
    validateDeal: validate(dealSchema)
};