const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seed() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'user_verification_db'
        });

        // Seed a default User
        const userPass = await bcrypt.hash('123456', 10);
        await connection.query(
            'INSERT IGNORE INTO User_Profile (name, email, password_hash, phone_number, date_of_birth) VALUES (?, ?, ?, ?, ?)',
            ['Bruntha', 'brunthadevioa.24csd@kongu.edu', userPass, '1234567890', '2000-01-01']
        );

        // Seed a default Admin/Officer
        const adminPass = await bcrypt.hash('admin123', 10);
        await connection.query(
            'INSERT IGNORE INTO Verification_Officer (officer_name, email, password_hash, department) VALUES (?, ?, ?, ?)',
            ['Admin Officer', 'admin@kongu.edu', adminPass, 'Security']
        );

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}
seed();
