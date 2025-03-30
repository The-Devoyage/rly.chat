use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use environment::Environment;
use routes::chat;
use service_response::ServiceResponse;

mod environment;
mod routes;
mod service_response;

#[get("/")]
async fn hello() -> impl Responder {
    let response = ServiceResponse { success: true };
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

    HttpServer::new(|| {
        App::new()
            .route("/chat", web::get().to(chat::chat))
            .service(hello)
    })
    .bind((environment.host, environment.port.into()))?
    .run()
    .await
}
