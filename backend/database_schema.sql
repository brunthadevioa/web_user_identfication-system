CREATE DATABASE IF NOT EXISTS user_verification_db;
USE user_verification_db;

CREATE TABLE IF NOT EXISTS User_Profile (
    user_profile_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    date_of_birth DATE,
    profile_picture VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS Credential_Data (
    credential_id INT AUTO_INCREMENT PRIMARY KEY,
    user_profile_id INT,
    credential_type VARCHAR(100),
    document_image VARCHAR(255),
    issue_date DATE,
    FOREIGN KEY (user_profile_id) REFERENCES User_Profile(user_profile_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Verification_Officer (
    officer_id INT AUTO_INCREMENT PRIMARY KEY,
    officer_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    officer_type VARCHAR(50) DEFAULT 'Tier1'
);

CREATE TABLE IF NOT EXISTS Credential_Verification (
    verification_log_id INT AUTO_INCREMENT PRIMARY KEY,
    credential_id INT,
    user_profile_id INT,
    officer_id INT,
    status VARCHAR(50) DEFAULT 'Pending',
    verification_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (credential_id) REFERENCES Credential_Data(credential_id) ON DELETE CASCADE,
    FOREIGN KEY (user_profile_id) REFERENCES User_Profile(user_profile_id) ON DELETE CASCADE,
    FOREIGN KEY (officer_id) REFERENCES Verification_Officer(officer_id) ON DELETE SET NULL
);

-- Extra Project Extensions

CREATE TABLE IF NOT EXISTS System_Audit_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_profile_id INT,
    action_type VARCHAR(100),
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES User_Profile(user_profile_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notification_Queue (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_profile_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES User_Profile(user_profile_id) ON DELETE CASCADE
);

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
