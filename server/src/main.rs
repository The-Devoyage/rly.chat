use actix_cors::Cors;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use broker::Broker;
use environment::Environment;
use routes::{chat, contact_link};
use service_response::ServiceResponse;

mod app_data;
pub mod broker;
mod environment;
mod routes;
mod service_response;

#[get("/")]
async fn hello() -> impl Responder {
    let response = ServiceResponse {
        success: true,
        data: None,
    };
    HttpResponse::Ok().json(serde_json::to_value(response).unwrap())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let environment = Environment::new().map_err(|e| {
        println!("ERROR: Failed to load environment - {e}");
        std::io::Error::new(std::io::ErrorKind::NotFound, "Failed to load environment.")
    })?;

    pretty_env_logger::init();

    log::info!("RLY Backend Started");

    let broker = Broker::new();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .allowed_origin("http://localhost:3000");


        App::new()
            .wrap(cors)
            .route("/chat/{uuid}", web::get().to(chat::chat))
            .app_data(web::Data::new(broker.clone()))
            .service(hello)
            .service(contact_link::encrypt_contact_link)
            .service(contact_link::decrypt_contact_link)
    })
    .bind((environment.host, environment.port.into()))?
    .run()
    .await
}
