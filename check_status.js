const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'webuser_db'
};

async function checkAll() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const tables = ['users', 'login_history', 'user_profiles', 'trusted_devices', 'notifications'];
        for (const table of tables) {
            try {
                await connection.execute(`SELECT 1 FROM ${table} LIMIT 1`);
                console.log(`STATUS_CHECK: ${table} is OK`);
            } catch (err) {
                console.log(`STATUS_CHECK: ${table} is FAILED (${err.message})`);
            }
        }
    } catch (err) {
        console.log(`STATUS_CHECK: CONNECTION_FAILED (${err.message})`);
    } finally {
        if (connection) await connection.end();
    }
}

checkAll();
