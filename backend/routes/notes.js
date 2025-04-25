// backend/routes/notes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
router.use(authMiddleware);

// Валидация для создания и обновления заметок
const noteValidation = [
    body('title').notEmpty().withMessage('Заголовок заметки обязателен'),
    body('content').optional()
];

// GET /notes
router.get('/', (req, res) => {
    const userId = req.user.id;

    db.all(
        'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC', [userId],
        (err, notes) => {
            if (err) {
                console.error('Ошибка при получении заметок:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            res.json(notes);
        }
    );
});

// POST /notes
router.post('/', noteValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.id;

    db.run(
        'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content],
        function(err) {
            if (err) {
                console.error('Ошибка при создании заметки:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }
            db.get(
                'SELECT * FROM notes WHERE id = ?', [this.lastID],
                (err, note) => {
                    if (err) {
                        console.error('Ошибка при получении заметки:', err.message);
                        return res.status(500).json({ message: 'Ошибка сервера' });
                    }

                    res.status(201).json(note);
                }
            );
        }
    );
});

// Обновление PUT /notes/:id
router.put('/:id', noteValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.id;
    const noteId = req.params.id;

    // Сначала проверяем, что заметка принадлежит пользователю
    db.get(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId],
        (err, note) => {
            if (err) {
                console.error('Ошибка при проверке заметки:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            if (!note) {
                return res.status(404).json({ message: 'Заметка не найдена' });
            }

            db.run(
                'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, content, noteId],
                function(err) {
                    if (err) {
                        console.error('Ошибка при обновлении заметки:', err.message);
                        return res.status(500).json({ message: 'Ошибка сервера' });
                    }

                    db.get(
                        'SELECT * FROM notes WHERE id = ?', [noteId],
                        (err, updatedNote) => {
                            if (err) {
                                console.error('Ошибка при получении обновленной заметки:', err.message);
                                return res.status(500).json({ message: 'Ошибка сервера' });
                            }

                            res.json(updatedNote);
                        }
                    );
                }
            );
        }
    );
});

// DELETE /notes/:id
router.delete('/:id', (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    db.get(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId],
        (err, note) => {
            if (err) {
                console.error('Ошибка при проверке заметки:', err.message);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }

            if (!note) {
                return res.status(404).json({ message: 'Заметка не найдена' });
            }

            db.run(
                'DELETE FROM notes WHERE id = ?', [noteId],
                function(err) {
                    if (err) {
                        console.error('Ошибка при удалении заметки:', err.message);
                        return res.status(500).json({ message: 'Ошибка сервера' });
                    }

                    res.json({ message: 'Заметка успешно удалена' });
                }
            );
        }
    );
});

module.exports = router;