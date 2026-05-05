const mysql = require('mysql2/promise');
require('dotenv').config();

const extensionQueries = `
-- Extra Table 1
CREATE TABLE IF NOT EXISTS System_Audit_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_profile_id INT,
    action_type VARCHAR(100),
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES User_Profile(user_profile_id) ON DELETE CASCADE
);

-- Extra Table 2
CREATE TABLE IF NOT EXISTS Notification_Queue (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_profile_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES User_Profile(user_profile_id) ON DELETE CASCADE
);

-- Extra View
CREATE OR REPLACE VIEW View_User_Verification_Summary AS
SELECT 
    up.user_profile_id,
    up.name,
    up.email,
    cd.credential_type,
    cd.issue_date,
    cv.status,
    vo.officer_name AS approved_by,
    cv.verification_timestamp
FROM User_Profile up
JOIN Credential_Verification cv ON up.user_profile_id = cv.user_profile_id
JOIN Credential_Data cd ON cv.credential_id = cd.credential_id
LEFT JOIN Verification_Officer vo ON cv.officer_id = vo.officer_id;
`;

async function injectExtensions() {
    try {
        console.log('Connecting to user_verification_db...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'user_verification_db',
            multipleStatements: true
        });

        console.log('Injecting 2 new Tables and 1 new View...');
        await connection.query(extensionQueries);
        
        console.log('Extensions perfectly deployed!');
        process.exit(0);
    } catch (error) {
        console.error('Error injecting extensions:', error);
        process.exit(1);
    }
}
injectExtensions();
