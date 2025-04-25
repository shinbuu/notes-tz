// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { db } = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const authValidation = [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов')
];

// POST /register
router.post('/register', authValidation, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async(err, user) => {
            if (err) {
                console.error('Ошибка при проверке пользователя:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            if (user) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            db.run(
                'INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('Ошибка при создании пользователя:', err.message);
                        return res.status(500).json({ message: 'Ошибка при регистрации' });
                    }

                    // Создаем JWT токен
                    const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '1d' });

                    // Отправляем токен в cookie
                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000 // на 1 день
                    });

                    res.status(201).json({
                        message: 'Пользователь успешно зарегистрирован',
                        userId: this.lastID
                    });
                }
            );
        });
    } catch (error) {
        console.error('Ошибка при регистрации:', error.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// POST /login
router.post('/login', authValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async(err, user) => {
            if (err) {
                console.error('Ошибка при поиске пользователя:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            if (!user) {
                return res.status(400).json({ message: 'Неверный email или пароль' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Неверный email или пароль' });
            }
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // на 1 день
            });

            res.json({
                message: 'Вход выполнен успешно',
                userId: user.id
            });
        });
    } catch (error) {
        console.error('Ошибка при входе:', error.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Выход выполнен успешно' });
});

module.exports = router;