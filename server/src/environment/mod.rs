use std::env;
use std::error::Error;

pub struct Environment {
    pub host: String,
    pub port: u16,
    pub share_contact_jwt_secret: String,
    pub share_contact_encryption_key: String,
}

impl Environment {
    pub fn new() -> Result<Environment, Box<dyn Error>> {
        dotenvy::dotenv()?;

        let environment = Environment {
            host: env::var("HOST")?,
            port: env::var("PORT")?.parse::<u16>()?,
            share_contact_jwt_secret: env::var("SHARE_CONTACT_JWT_SECRET")?,
            share_contact_encryption_key: env::var("SHARE_CONTACT_ENCRYPTION_KEY")?,
        };

        Ok(environment)
    }
}
