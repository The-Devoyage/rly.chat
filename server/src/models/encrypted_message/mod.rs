use std::str::FromStr;

use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncryptedMessage {
    pub encrypted_data: String,
    pub nonce: String,
    pub sender: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum MessageType {
    Message,
    Contact,
}

impl ToString for MessageType {
    fn to_string(&self) -> String {
        match self {
            MessageType::Message => "message".to_string(),
            MessageType::Contact => "contact".to_string(),
        }
    }
}

impl FromStr for MessageType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "message" => Ok(MessageType::Message),
            "contact" => Ok(MessageType::Contact),
            _ => Err(()),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct SerializedMessage {
    pub address: Uuid,
    pub conversation: Uuid,
    pub encrypted_message: EncryptedMessage,
    pub message_type: MessageType,
}

