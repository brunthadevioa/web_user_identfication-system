const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        console.log('Connecting cleanly to MySQL via Node.js...');
        
        // Connect to the generic MySQL environment first (without selecting a DB)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true // Allow running the entire .sql file at once
        });

        // Read the schema file
        const schemaPath = path.join(__dirname, 'database_schema.sql');
        const sqlStatements = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing SQL schema...');
        await connection.query(sqlStatements);
        
        console.log('Database user_verification_db successfully created and populated!');
        process.exit(0);
    } catch (error) {
        console.error('\n[Database Error]: Make sure your MySQL Server itself (like XAMPP or MySQL Server) is running on port 3306!\n', error.message);
        process.exit(1);
    }
}

setupDatabase();
