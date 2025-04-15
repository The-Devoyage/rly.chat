CREATE TABLE IF NOT EXISTS message (
    id TEXT PRIMARY KEY NOT NULL,
    address TEXT NOT NULL,
    message_type TEXT NOT NULL,
    sender TEXT NOT NULL,
    conversation TEXT NOT NULL,
    encrypted_data TEXT NOT NULL,
    nonce TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

