use std::str::FromStr;

use crate::{
    app_data::AppData,
    models::{encrypted_message::MessageType, shared_contact::SharedContact},
    ServiceResponse,
};
use actix_web::{post, web, HttpResponse, Responder};
use aes_gcm::{
    aead::{Aead, OsRng},
    AeadCore, Aes256Gcm, Key, KeyInit,
};
use anyhow::anyhow;
use base64::{engine::general_purpose, prelude::*};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    exp: usize,
    encrypted_contact: String,
}

fn encrypt_data(data: &str) -> Result<String, anyhow::Error> {
    let secret =
        std::env::var("SHARE_CONTACT_ENCRYPTION_KEY").expect("Encryption key must be set.");
    let key = Key::<Aes256Gcm>::from_slice(secret.as_bytes().into());
    let cipher = Aes256Gcm::new(&key);

    let nonce = Aes256Gcm::generate_nonce(&mut OsRng);

    let ciphertext = cipher.encrypt(&nonce, data.as_ref()).map_err(|e| {
        log::error!("ERROR: Failed to encrypt - {e}");
        anyhow!("Failed to encrypt.")
    })?;

    let mut combined = Vec::new();
    combined.extend_from_slice(&nonce);
    combined.extend_from_slice(&ciphertext);

    // Store nonce + ciphertext together (Base64 encoded)
    let encrypted_data = general_purpose::URL_SAFE.encode(combined);
    Ok(encrypted_data)
}

fn decrypt_data(encrypted_data: &str) -> Result<EncryptContactLinkBody, anyhow::Error> {
    let bytes = general_purpose::URL_SAFE.decode(encrypted_data)?;
    let (nonce_bytes, ciphertext_bytes) = bytes.split_at(12);
    let nonce: [u8; 12] = nonce_bytes.try_into().expect("Nonce must be 12 bytes");

    let secret =
        std::env::var("SHARE_CONTACT_ENCRYPTION_KEY").expect("Encryption key must be set.");
    let key = Key::<Aes256Gcm>::from_slice(secret.as_bytes().into());
    let cipher = Aes256Gcm::new(&key);

    let stringified_json = cipher
        .decrypt(&nonce.into(), ciphertext_bytes.as_ref())
        .map_err(|e| {
            log::error!("Failed to decrypt contact: {e}");
            anyhow!("Failed to decrypt contact.")
        })?;

    let contact_details =
        serde_json::from_str::<EncryptContactLinkBody>(&String::from_utf8(stringified_json)?)?;
    log::info!("CONTACT DETAILS: {:?}", contact_details);

    Ok(contact_details)
}

#[derive(Deserialize, Serialize)]
struct DecryptContactLinkBody {
    token: String,
}

#[post("/contact-link/decrypt")]
async fn decrypt_contact_link(req_body: web::Json<DecryptContactLinkBody>) -> impl Responder {
    let bytes = match general_purpose::URL_SAFE.decode(&req_body.token) {
        Ok(b) => b,
        Err(err) => {
            log::error!("Failed to decode base64 token: {err}");
            return HttpResponse::InternalServerError().body("Failed to decode base64 token.");
        }
    };

    let token = match String::from_utf8(bytes) {
        Ok(t) => t,
        Err(err) => {
            log::error!("Failed to convert token: {err}");
            return HttpResponse::InternalServerError().body("Failed to convert token.");
        }
    };

    // Validate the token
    let jwt = match decode::<Claims>(
        &token,
        &DecodingKey::from_secret(&std::env::var("SHARE_CONTACT_JWT_SECRET").unwrap().as_ref()),
        &Validation::default(),
    ) {
        Ok(c) => c,
        Err(err) => {
            log::error!("FAILED TO DECODE TOKEN: {err}");
            return HttpResponse::InternalServerError().body("Failed to decode token.");
        }
    };
    let contact = match decrypt_data(&jwt.claims.encrypted_contact) {
        Ok(c) => c,
        Err(err) => {
            log::error!("Failed to get contact: {err}");
            return HttpResponse::InternalServerError().body("Failed to get contact.");
        }
    };

    log::info!("CONTACT: {:?}", contact);

    let service_response = ServiceResponse {
        success: true,
        data: Some(serde_json::to_value(contact).unwrap()),
    };

    HttpResponse::Ok().json(service_response)
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct EncryptContactLinkBody {
    pub sim_uuid: String,
    pub address: String,
    pub public_key: String,
    pub identifier: String,
}

#[post("/contact-link/encrypt")]
async fn encrypt_contact_link(req_body: web::Json<EncryptContactLinkBody>) -> impl Responder {
    let stringified = match serde_json::to_string(&req_body) {
        Ok(s) => s,
        Err(err) => {
            log::error!("{err}");
            return HttpResponse::InternalServerError().body("Failed to seralize request body.");
        }
    };
    let encrypted_contact = match encrypt_data(&stringified) {
        Ok(e) => e,
        Err(err) => {
            log::error!("{err}");
            return HttpResponse::InternalServerError().body("Failed to encrypt request body.");
        }
    };

    let exp = Utc::now()
        .checked_add_signed(Duration::weeks(1)) // Add 1 week
        .expect("Valid expiration date")
        .timestamp() as usize;

    let claims = Claims {
        exp,
        encrypted_contact,
    };

    let token = match encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(&std::env::var("SHARE_CONTACT_JWT_SECRET").unwrap().as_ref()),
    ) {
        Ok(t) => t,
        Err(err) => {
            log::error!("Failed to create token: {err}");
            return HttpResponse::InternalServerError().body("Failed to create token.");
        }
    };

    let token = general_purpose::URL_SAFE.encode(token);

    let response = ServiceResponse {
        data: Some(json!({ "token": token })),
        success: true,
    };

    HttpResponse::Ok().json(response)
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct ShareContactLinkBody {
    pub address: String,
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SerializedContactMessage {
    pub address: Uuid,
    pub token: String,
    pub message_type: MessageType,
}

#[post("/contact-link/share")]
async fn share_contact_link(
    req_body: web::Json<ShareContactLinkBody>,
    app_data: web::Data<AppData>,
) -> impl Responder {
    let share_contact_link_body = req_body.into_inner();
    let address = match Uuid::from_str(&share_contact_link_body.address) {
        Ok(a) => a,
        Err(err) => {
            log::error!("ERROR: {err}");
            return HttpResponse::InternalServerError().body("Invalid address format.");
        }
    };

    // Try sending first
    let broker = app_data.broker.clone();
    let address_topic = format!("address_{}", address.to_string());
    let serialized_contact_message = SerializedContactMessage {
        address,
        token: share_contact_link_body.token.clone(),
        message_type: MessageType::Contact,
    };
    let stringified_json = serde_json::to_string(&serialized_contact_message).unwrap();
    let sent = broker.publish(&address_topic, stringified_json.to_string());

    // If not sent, cache it.
    if sent.is_err() {
        let saved = app_data
            .database
            .save_shared_contact(&SharedContact {
                address,
                token: share_contact_link_body.token,
            })
            .await;
        match saved {
            Ok(_) => {}
            Err(err) => {
                log::error!("{:?}", err);
                return HttpResponse::InternalServerError().body("Failed to send contact.");
            }
        }
    }

    HttpResponse::Ok().json(ServiceResponse {
        success: true,
        data: None,
    })
}
