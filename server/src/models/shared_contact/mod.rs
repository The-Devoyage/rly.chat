use crate::database::Database;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct SharedContact {
    pub address: Uuid,
    pub token: String,
}

impl Database {
    pub async fn save_shared_contact(&self, contact: &SharedContact) -> Result<(), anyhow::Error> {
        let id = Uuid::new_v4().to_string();
        let address = contact.address.to_string();
        let token = contact.token.to_string();
        sqlx::query!(
            r#"
            INSERT INTO shared_contact (id, address, token)
            VALUES (?1, ?2, ?3);
            "#,
            id,
            address,
            token
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
    pub async fn get_shared_contacts(
        &self,
        address: Uuid,
    ) -> Result<Vec<SharedContact>, anyhow::Error> {
        let address = address.to_string();
        let rows = sqlx::query!(
            r#"
            SELECT address, token
            FROM shared_contact
            WHERE address = ?1
            "#,
            address
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .into_iter()
            .map(|row| SharedContact {
                address: Uuid::parse_str(&row.address).unwrap(),
                token: row.token,
            })
            .collect())
    }

    pub async fn delete_shared_contacts(&self, address: Uuid) -> Result<(), anyhow::Error> {
        let address = address.to_string();
        sqlx::query!(
            r#"
            DELETE FROM shared_contact 
            WHERE address = ?1
            "#,
            address
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
