const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Register User
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, phone_number, date_of_birth, profile_picture } = req.body;
        
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM User_Profile WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO User_Profile (name, email, password_hash, phone_number, date_of_birth, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone_number, date_of_birth, profile_picture]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Login User
router.post('/login', async (req, res, next) => {
    try {
        const { email, password, isOfficer } = req.body;

        const tableName = isOfficer ? 'Verification_Officer' : 'User_Profile';
        const [users] = await db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            id: isOfficer ? user.officer_id : user.user_profile_id,
            role: isOfficer ? 'officer' : 'user',
            type: user.officer_type || 'user'
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login successful', token, user: { name: user.name || user.officer_name, role: payload.role } });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
