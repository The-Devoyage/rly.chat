use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

#[derive(Clone)]
pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new(url: &str) -> Result<Self, anyhow::Error> {
        let pool = SqlitePoolOptions::new()
            .max_connections(10)
            .connect(url)
            .await?;
        let database = Database { pool: pool.clone() };

        // Run embedded migrations
        sqlx::migrate!().run(&pool).await?;

        Ok(database)
    }
}
