const express = require('express');
const mysql = require('mysql2/promise'); // Using mysql2 promise wrapper
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

// Global Error Handling
process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static frontend files from this directory
app.use(express.static(__dirname));

// MySQL Database configuration
// IMPORTANT: Change 'YOUR_DATABASE_NAME' to the actual name of your phpMyAdmin database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Usually empty on local phpMyAdmin
    database: 'webuser_db'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 1. Insert into 'users' table
        console.log('Inserting into users...');
        const [result] = await pool.execute(
            'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
            [fullname, email, hashedPassword]
        );
        const userId = result.insertId;
        console.log('User created with ID:', userId);

        // 2. Insert initial row into 'user_profiles'
        console.log('Creating user profile...');
        await pool.execute(
            'INSERT INTO user_profiles (user_id, phone, address, bio) VALUES (?, ?, ?, ?)',
            [userId, '', '', 'Hey there! I am new here.']
        );

        // 3. Insert welcome message into 'notifications'
        console.log('Creating notification...');
        await pool.execute(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId, 'Welcome!', 'Thanks for joining IdentityOS. Explore your dashboard to get started.', 'success']
        );

        const user = {
            id: userId,
            fullname: fullname,
            email: email
        };

        res.status(201).json({ 
            message: 'User registered successfully!', 
            user: user 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already in use.' });
        }
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = rows[0];

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 1. Insert into 'login_history'
        console.log('Logging session for user:', user.id);
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
        await pool.execute(
            'INSERT INTO login_history (user_id, ip_address, status) VALUES (?, ?, ?)',
            [user.id, ipAddress, 'Success']
        );

        // 2. Insert into 'trusted_devices'
        console.log('Tracking device info...');
        const userAgent = req.headers['user-agent'] || 'Unknown Browser';
        const browser = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : 'Safari';
        const os = userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'MacOS' : 'Mobile';

        await pool.execute(
            'INSERT INTO trusted_devices (user_id, device_name, browser, os) VALUES (?, ?, ?, ?)',
            [user.id, 'Main Device', browser, os]
        );

        console.log('Login logic complete for:', user.email);

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// Fetch History Endpoint
app.get('/api/history', async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
    
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT 15', 
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});

// Fetch Profile Endpoint
app.get('/api/profile', async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    
    try {
        const [rows] = await pool.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Profile not found.' });
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

// Update Profile Endpoint
app.post('/api/profile/update', async (req, res) => {
    console.log('--- Profile Update Request ---');
    console.log('Body:', req.body);
    const { user_id, phone, address, bio, avatar_url } = req.body;
    if (!user_id) {
        console.error('Error: missing user_id');
        return res.status(400).json({ error: 'User ID is required.' });
    }
    try {
        // Use a more universally compatible UPSERT logic (Standard SQL)
        const [rows] = await pool.execute('SELECT * FROM user_profiles WHERE user_id = ?', [user_id]);
        
        if (rows.length > 0) {
            // Update existing
            await pool.execute(
                'UPDATE user_profiles SET phone = ?, address = ?, bio = ?, avatar_url = ? WHERE user_id = ?',
                [phone || '', address || '', bio || '', avatar_url || '', user_id]
            );
        } else {
            // Insert new
            await pool.execute(
                'INSERT INTO user_profiles (user_id, phone, address, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
                [user_id, phone || '', address || '', bio || '', avatar_url || '']
            );
        }
        
        console.log('Profile updated successfully in DB');
        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Database error during profile update:', error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// Fetch Notifications Endpoint
app.get('/api/notifications', async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    
    try {
        const [rows] = await pool.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
});

// Fetch Trusted Devices Endpoint
app.get('/api/devices', async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    
    try {
        const [rows] = await pool.execute('SELECT * FROM trusted_devices WHERE user_id = ? ORDER BY last_active DESC', [userId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch devices.' });
    }
});



// Test DB Connection before starting
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database!');
        connection.release();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MySQL. Did you update the database name in server.js?', err.message);
        console.log('Starting server anyway so you can view static files...');
        app.listen(PORT, () => console.log(`Server running without DB on http://localhost:${PORT}`));
    });
