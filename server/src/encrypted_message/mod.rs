use crate::database::Database;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncryptedMessage {
    pub encrypted_data: String,
    pub nonce: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct SerializedMessage {
    pub address: Uuid,
    pub conversation: Uuid,
    pub encrypted_message: EncryptedMessage,
}

impl Database {
    pub async fn save_message(&self, msg: &SerializedMessage) -> Result<(), anyhow::Error> {
        let id = Uuid::new_v4().to_string();
        let address = msg.address.to_string();
        let conversation = msg.conversation.to_string();
        sqlx::query!(
            r#"
            INSERT INTO message (id, address, conversation, encrypted_data, nonce)
            VALUES (?1, ?2, ?3, ?4, ?5)
            "#,
            id,
            address,
            conversation,
            msg.encrypted_message.encrypted_data,
            msg.encrypted_message.nonce,
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_cached_messages(
        &self,
        address: Uuid,
    ) -> Result<Vec<SerializedMessage>, anyhow::Error> {
        let address = address.to_string();
        let rows = sqlx::query!(
            r#"
            SELECT address, conversation, encrypted_data, nonce
            FROM message
            WHERE address = ?1
            ORDER BY created_at ASC
            "#,
            address,
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| SerializedMessage {
                address: Uuid::parse_str(&row.address).unwrap(),
                conversation: Uuid::parse_str(&row.conversation).unwrap(),
                encrypted_message: EncryptedMessage {
                    encrypted_data: row.encrypted_data,
                    nonce: row.nonce,
                },
            })
            .collect())
    }

    pub async fn clear_cached_messages(&self, address: Uuid) -> Result<(), anyhow::Error> {
        let address = address.to_string();
        sqlx::query!(
            r#"
            DELETE FROM message
            WHERE address = ?1
            "#,
            address
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
