const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// User: Upload credential
router.post('/upload', authenticate, upload.single('document_image'), async (req, res, next) => {
    try {
        if (req.user.role !== 'user') return res.status(403).json({ error: 'Forbidden' });
        
        const { credential_type, issue_date } = req.body;
        const document_image = req.file ? req.file.path : null;

        if (!document_image) return res.status(400).json({ error: 'Image is required' });

        const [credResult] = await db.query(
            'INSERT INTO Credential_Data (user_profile_id, credential_type, document_image, issue_date) VALUES (?, ?, ?, ?)',
            [req.user.id, credential_type, document_image, issue_date]
        );

        await db.query(
            'INSERT INTO Credential_Verification (credential_id, user_profile_id, status) VALUES (?, ?, ?)',
            [credResult.insertId, req.user.id, 'Pending']
        );

        res.status(201).json({ message: 'Credential uploaded successfully' });
    } catch (err) {
        next(err);
    }
});

// Officer: Get all pending verifications
router.get('/pending', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'officer') return res.status(403).json({ error: 'Forbidden' });
        const query = `
            SELECT cv.verification_log_id, cv.status, cd.credential_id, cd.credential_type, cd.document_image, cd.issue_date, up.name, up.email 
            FROM Credential_Verification cv 
            JOIN Credential_Data cd ON cv.credential_id = cd.credential_id 
            JOIN User_Profile up ON cv.user_profile_id = up.user_profile_id 
            WHERE cv.status = 'Pending'
        `;
        const [verifications] = await db.query(query);
        res.json(verifications);
    } catch (err) {
        next(err);
    }
});

// Officer: Verify credential (Approve or Deny)
router.put('/verify/:id', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'officer') return res.status(403).json({ error: 'Forbidden' });
        const { status } = req.body; // 'Approved' or 'Denied'
        const { id } = req.params; // verification_log_id

        await db.query(
            'UPDATE Credential_Verification SET status = ?, officer_id = ? WHERE verification_log_id = ?',
            [status, req.user.id, id]
        );

        res.json({ message: 'Verification status updated' });
    } catch (err) {
        next(err);
    }
});

// User: Get their own credentials
router.get('/mycredentials', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'user') return res.status(403).json({ error: 'Forbidden' });
        const query = `
            SELECT cd.credential_type, cd.document_image, cd.issue_date, cv.status, cv.verification_timestamp 
            FROM Credential_Data cd 
            LEFT JOIN Credential_Verification cv ON cd.credential_id = cv.credential_id 
            WHERE cd.user_profile_id = ?
        `;
        const [credentials] = await db.query(query, [req.user.id]);
        res.json(credentials);
    } catch (err) {
        next(err);
    }
});

// Officer: Get verification summary history
router.get('/summary', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'officer') return res.status(403).json({ error: 'Forbidden' });
        const [summary] = await db.query('SELECT * FROM View_User_Verification_Summary ORDER BY verification_timestamp DESC');
        res.json(summary);
    } catch (err) {
        next(err);
    }
});

module.exports = router;