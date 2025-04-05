use super::encrypted_message::SerializedMessage;
use crate::broker::Broker;
use actix_web::{rt, web, Error, HttpRequest, HttpResponse};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;
use tokio::spawn;

pub async fn chat(
    req: HttpRequest,
    path: web::Path<String>,
    stream: web::Payload,
    broker: web::Data<Broker>,
) -> Result<HttpResponse, Error> {
    let (res, session, stream) = actix_ws::handle(&req, stream)?;
    let uuid = path.into_inner();
    let topic = format!("address_{}", uuid);

    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    let mut rx = broker.subscribe(&topic);

    // Consumer (read from topic)
    let mut session_clone = session.clone();
    spawn(async move {
        while let Ok(msg) = rx.recv().await {
            let _ = session_clone.text(msg).await;
        }
    });

    // Producer (write to topic)
    let broker = broker.clone();
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

                    broker.publish(&address_topic, stringified_json.to_string());

                    // Only send back if there are errors!
                    // session.text(stringified_json).await.unwrap();
                }
                _ => {}
            }
        }
    });

    Ok(res)
}



