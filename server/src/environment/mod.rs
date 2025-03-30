use std::env;
use std::error::Error;

pub struct Environment {
    pub host: String,
    pub port: u16,
}

impl Environment {
    pub fn new() -> Result<Environment, Box<dyn Error>> {
        dotenvy::dotenv()?;

        let environment = Environment {
            host: env::var("HOST")?,
            port: env::var("PORT")?.parse::<u16>()?,
        };

        Ok(environment)
    }
}
