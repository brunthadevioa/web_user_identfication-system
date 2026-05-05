const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Middleware to authenticate
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

// Get user profile
router.get('/profile', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'user') return res.status(403).json({ error: 'Forbidden' });
        const [users] = await db.query('SELECT user_profile_id, name, email, phone_number, date_of_birth, profile_picture, status FROM User_Profile WHERE user_profile_id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (err) {
        next(err);
    }
});

// Admin: Get all users
router.get('/', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'officer') return res.status(403).json({ error: 'Forbidden' });
        const [users] = await db.query('SELECT user_profile_id, name, email, status FROM User_Profile');
        res.json(users);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
