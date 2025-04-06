use crate::broker::Broker;
use crate::database::Database;

#[derive(Clone)]
pub struct AppData {
    pub broker: Broker,
    pub database: Database,
}

impl AppData {
    pub async fn new() -> Result<Self, anyhow::Error> {
        let app_data = AppData {
            broker: Broker::new(),
            database: Database::new(&std::env::var("DATABASE_URL")?).await?,
        };
        Ok(app_data)
    }
}
