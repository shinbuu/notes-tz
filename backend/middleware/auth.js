// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization') ? .replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Требуется авторизация' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId };

        next();
    } catch (error) {
        console.error('Ошибка авторизации:', error.message);
        res.status(401).json({ message: 'Недействительный токен' });
    }
};

module.exports = {
    authMiddleware,
    JWT_SECRET
};