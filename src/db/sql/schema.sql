CREATE TABLE IF NOT EXISTS accounts
(
    seq_no     INT AUTO_INCREMENT PRIMARY KEY,
    id         VARCHAR(36) COLLATE utf8_bin UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(255),
    best_score  INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
