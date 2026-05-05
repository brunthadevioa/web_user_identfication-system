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
    if (req.user.role !== 'officer') {
      return res.status(403).json({ error: 'Forbidden. Officers only.' });
    }

    const [rows] = await db.query(`
      SELECT s.*, u.name as user_name, u.email as user_email
      FROM System_Audit_Log s
      LEFT JOIN User_Profile u ON s.user_profile_id = u.user_profile_id
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
