const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
        req.user = decoded;
        next();
    });
};

router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT * FROM Notification_Queue WHERE user_profile_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await db.query(
      'UPDATE Notification_Queue SET is_read = TRUE WHERE notification_id = ? AND user_profile_id = ?',
      [id, userId]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
