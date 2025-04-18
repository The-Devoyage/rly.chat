use crate::{
    app_data::AppData,
    models::{
        encrypted_message::{MessageType, SerializedMessage},
        shared_contact::SharedContact,
    },
};
use actix_web::{rt, web, Error, HttpRequest, HttpResponse};
use actix_ws::AggregatedMessage;
use deeb::{Entity, Query};
use futures_util::StreamExt as _;
use serde_json::json;
use tokio::spawn;

use super::contact_link::SerializedContactMessage;

pub async fn chat(
    req: HttpRequest,
    path: web::Path<String>,
    stream: web::Payload,
    app_data: web::Data<AppData>,
) -> Result<HttpResponse, Error> {
    let (res, session, stream) = actix_ws::handle(&req, stream)?;
    let address = path.into_inner();
    let topic = format!("address_{}", address);

    // Start Socket
    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    // Receive Notifications While Online
    let mut rx = app_data.broker.subscribe(&topic);
    let mut session_clone = session.clone();
    let handler = spawn(async move {
        while let Ok(msg) = rx.recv().await {
            let _ = session_clone.text(msg).await;
        }
    });

    // Handle Fetch Offline Messages On Connect
    let not_received = app_data
        .deeb
        .find_many::<SerializedMessage>(
            &Entity::new("message"),
            Query::eq("address", address.as_str()),
            None,
        )
        .await;

    if let Ok(not_received) = not_received {
        for msg in not_received.iter() {
            let _ = session
                .clone()
                .text(serde_json::to_string(msg).unwrap())
                .await;
        }
        // NOTE: Kinda hacky but okay for now.
        // Should only remove messages that were successfully sent
        let _ = app_data
            .deeb
            .delete_many(
                &Entity::new("message"),
                Query::eq("address", address.as_str()),
                None,
            )
            .await;
    }

    let shared_contact = Entity::new("shared_contact");

    // Handle Fetch New Contacts On Connect
    let new_contacts = app_data
        .deeb
        .find_many::<SharedContact>(
            &shared_contact,
            Query::eq("address", address.as_str()),
            None,
        )
        .await;
    if let Ok(new_contacts) = new_contacts {
        if new_contacts.is_some() {
            for contact in new_contacts.unwrap().iter() {
                let serialized_contact = SerializedContactMessage {
                    message_type: MessageType::Contact,
                    address: contact.address,
                    token: contact.token.clone(),
                };
                let _ = session
                    .clone()
                    .text(serde_json::to_string(&serialized_contact).unwrap())
                    .await;
            }
            // NOTE: Kinda hacky but okay for now.
            let _ = app_data
                .deeb
                .delete_many(
                    &shared_contact,
                    Query::eq("address", address.as_str()),
                    None,
                )
                .await;
        }
    }

    // Handle Live Connection
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
                            // User is offline, save for later delivery
                            let message = Entity::new("message");
                            let saved = app_data
                                .deeb
                                .insert::<SerializedMessage>(
                                    &message,
                                    json!(seralized_message),
                                    None,
                                )
                                .await;

                            match saved {
                                Ok(_) => {}
                                Err(err) => {
                                    log::error!("FAILED TO SAVE MESSAGE: {:?}", err);
                                }
                            }
                        }
                    }
                }
                Ok(AggregatedMessage::Close(_)) => {
                    handler.abort();
                }
                _ => {}
            }
        }
    });

    Ok(res)
}
