const authenticate = (req, res, next) => {
    try {
        // Получаем API ключ из заголовка x-api-key
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            console.warn('⚠️ No API key provided in request');
            return res.status(401).json({ error: 'No API key provided' });
        }

        // Проверяем API ключ из .env
        const validApiKey = process.env.API_KEY || 'crm-system-secure-api-key-2024';

        if (apiKey !== validApiKey) {
            console.warn('⚠️ Invalid API key provided:', apiKey.substring(0, 10) + '...');
            return res.status(401).json({ error: 'Invalid API key' });
        }

        console.log('✅ API key validated successfully');
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = { authenticate };
