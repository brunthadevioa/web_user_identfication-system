const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'webuser_db'
};

async function fixTable() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');

        console.log('Dropping table login_history (if exists in engine)...');
        await connection.execute('DROP TABLE IF EXISTS login_history');
        console.log('Recreating table login_history...');
        await connection.execute(`
            CREATE TABLE login_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                status VARCHAR(50) DEFAULT 'Success',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Table login_history recreated successfully!');

    } catch (err) {
        console.error('Error fixing table:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixTable();
