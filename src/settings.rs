use dotenvy::dotenv;
use lazy_static::lazy_static;

pub struct Settings {
    pub auth_cookie_name: String,
    pub cookie_secret: String,
    pub implicit_assertion: String,

    pub database_url: String,

    pub email_host: String,
    pub email_user: String,
    pub email_password: String,
}

lazy_static! {
    pub static ref SETTINGS: Settings = {
        dotenv().ok();
        let database_url = format!(
            "postgres://{}:{}@{}:{}/{}",
            std::env::var("POSTGRES_USER").unwrap(),
            std::env::var("POSTGRES_PASSWORD").unwrap(),
            std::env::var("DATABASE_HOST").unwrap(),
            std::env::var("DATABASE_PORT").unwrap(),
            std::env::var("DATABASE_NAME").unwrap()
        );
        Settings {
            auth_cookie_name: "auth".to_string(),
            cookie_secret: std::env::var("SYMMETRIC_KEY").unwrap(), // need to_string here?
            implicit_assertion: "abc".to_string(),
            email_host: "smtp.gmail.com".to_string(),
            email_user: std::env::var("APP_USER").unwrap(),
            email_password: std::env::var("APP_PASS").unwrap(),
            database_url,
        }
    };
}

pub fn get_settings() -> &'static Settings {
    &SETTINGS
}
