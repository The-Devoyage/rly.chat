use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncryptedMessage {
    encrypted_data: String,
    nonce: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedMessage {
    pub address: Uuid,
    conversation: Uuid,
    encrypted_message: EncryptedMessage,
}
