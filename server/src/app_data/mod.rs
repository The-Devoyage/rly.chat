use deeb::{Deeb, Entity};

use crate::broker::Broker;

#[derive(Clone)]
pub struct AppData {
    pub broker: Broker,
    pub deeb: Deeb,
}

impl AppData {
    pub async fn new() -> Result<Self, anyhow::Error> {
        let deeb = Deeb::new();

        let message = Entity::new("message");
        let shared_contact = Entity::new("shared_contact");
        deeb.add_instance(
            "deeb",
            "./deeb.json",
            vec![message, shared_contact],
        )
        .await?;

        let app_data = AppData {
            broker: Broker::new(),
            deeb,
        };
        Ok(app_data)
    }
}
