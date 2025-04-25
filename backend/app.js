// backend/app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./database');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Разрешаем запросы с фронтенда, который работает на порту 5173
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Инициализация базы данных
initializeDatabase();

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('API для приложения заметок работает');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;