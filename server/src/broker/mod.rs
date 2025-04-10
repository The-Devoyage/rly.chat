use anyhow::anyhow;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;

#[derive(Clone)]
pub struct Broker {
    topics: Arc<Mutex<HashMap<String, broadcast::Sender<String>>>>,
}

impl Broker {
    pub fn new() -> Self {
        Self {
            topics: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn subscribe(&self, topic: &str) -> broadcast::Receiver<String> {
        let mut topics = self.topics.lock().unwrap();
        topics
            .entry(topic.to_string())
            .or_insert_with(|| broadcast::channel(100).0)
            .subscribe()
    }

    pub fn publish(&self, topic: &str, message: String) -> Result<(), anyhow::Error> {
        let topics = self.topics.lock().unwrap();
        if let Some(sender) = topics.get(topic) {
            let sent = sender.send(message); // Ignore send errors
            match sent {
                Ok(_) => Ok(()),
                Err(_) => Err(anyhow!("User has logged off.")),
            }
        } else {
            Err(anyhow!("User Offline"))
        }
    }
}
