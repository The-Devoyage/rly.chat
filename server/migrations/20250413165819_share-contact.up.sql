-- Add up migration script here

CREATE TABLE IF NOT EXISTS shared_contact (
    id TEXT PRIMARY KEY NOT NULL,
    address TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

