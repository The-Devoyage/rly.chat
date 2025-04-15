use std::str::FromStr;

use crate::{app_data::AppData, models::encrypted_message::SerializedMessage};
use actix_web::{rt, web, Error, HttpRequest, HttpResponse};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;
use tokio::spawn;

pub async fn chat(
    req: HttpRequest,
    path: web::Path<String>,
    stream: web::Payload,
    app_data: web::Data<AppData>,
) -> Result<HttpResponse, Error> {
    let (res, session, stream) = actix_ws::handle(&req, stream)?;
    let address = path.into_inner();
    let topic = format!("address_{}", address);

    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    let mut rx = app_data.broker.subscribe(&topic);

    // Consumer (read from topic)
    let mut session_clone = session.clone();
    let handler = spawn(async move {
        while let Ok(msg) = rx.recv().await {
            let _ = session_clone.text(msg).await;
        }
    });

    // Handle Fetch Offline Messages
    let address_uuid = match uuid::Uuid::from_str(&address) {
        Ok(uuid) => uuid,
        Err(err) => {
            log::error!("{err}");
            return Ok(HttpResponse::InternalServerError().body("Failed to process address."));
        }
    };
    let not_received = app_data.database.get_cached_messages(address_uuid).await;
    if let Ok(not_received) = not_received {
        for msg in not_received.iter() {
            log::info!("NOT RECEIVED: {:?}", msg);
            let _ = session
                .clone()
                .text(serde_json::to_string(msg).unwrap())
                .await;
        }
        // NOTE: Kinda hacky but okay for now.
        // Should only remove messages that were successfully sent
        let _ = app_data.database.clear_cached_messages(address_uuid).await;
    }

    // Producer (write to topic)
    let broker = app_data.broker.clone();
    rt::spawn(async move {
        while let Some(msg) = stream.next().await {
            match msg {
                Ok(AggregatedMessage::Text(stringified_json)) => {
                    let seralized_message =
                        match serde_json::from_str::<SerializedMessage>(&stringified_json) {
                            Ok(m) => m,
                            Err(err) => {
                                log::error!("{err}");
                                continue;
                            }
                        };

                    let address_topic =
                        format!("address_{}", seralized_message.address.to_string());

                    let sent = broker.publish(&address_topic, stringified_json.to_string());
                    match sent {
                        Ok(_) => {}
                        Err(_) => {
                            let saved = app_data.database.save_message(&seralized_message).await;
                            match saved {
                                Ok(_) => {}
                                Err(err) => {
                                    log::error!("{:?}", err);
                                }
                            }
                        }
                    }
                }
                Ok(AggregatedMessage::Close(_)) => {
                    log::info!("CLOSING");
                    handler.abort();
                }
                _ => {}
            }
        }
    });

    Ok(res)
}
