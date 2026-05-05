const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./controllers/authController');
const userRoutes = require('./controllers/userController');
const credentialRoutes = require('./controllers/credentialController');
const notificationRoutes = require('./controllers/notificationController');
const auditRoutes = require('./controllers/auditController');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
