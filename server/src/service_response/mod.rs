use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct ServiceResponse {
    pub success: bool,
    pub data: Option<Value>,
}
