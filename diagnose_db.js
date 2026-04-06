const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'webuser_db'
};

async function diagnose() {
    let connection;
    try {
        console.log('--- DATABASE DIAGNOSIS ---');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL successfully.');

        console.log('\n--- ALL TABLES ---');
        const [tables] = await connection.execute('SHOW TABLES');
        tables.forEach(row => {
            console.log(`- ${Object.values(row)[0]}`);
        });

        const targetTables = ['users', 'login_history', 'user_profiles', 'trusted_devices', 'notifications'];
        console.log('\n--- TABLE CHECKS ---');
        for (const table of targetTables) {
            try {
                const [desc] = await connection.execute(`DESCRIBE ${table}`);
                console.log(`[OK] Table '${table}' exists and is readable.`);
            } catch (err) {
                console.error(`[ERROR] Table '${table}': ${err.message}`);
            }
        }

    } catch (err) {
        console.error('CRITICAL CONNECTION ERROR:', err.message);
    } finally {
        if (connection) await connection.end();
        console.log('\nDiagnosis complete.');
    }
}

diagnose();
