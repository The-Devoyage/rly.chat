# Rly Chat

A privacy focused, end to end encrypted chat application built with NextJS, Python, and Kafka.

Features:
- No Accounts
- No Personal Identifiable Data Stored
- End to End Encrypted Messaging - All messages are encrypted with a private/public key pair before leaving the client side application.
- No Public Identifiers - Only people who have received your contact identifer can message you.

## Getting Started

### Client Side Application

Start the client side application with `npm run dev` from the `/client` folder.

### Server Side Application

Start the server with `cargo run` from the `/server` directory.

## User Flow

### Users

- Nick
- Bongo
- Oakley

**Two Existing Users**

1. Nick and Bongo creates a sim. They are now existing users. Oakley does not register.
2. Bongo clicks "share contact". 
3. HTTP request is sent to the server, a record for a shared contact with a UUID is stoerd in DB. Nick's "Address" is encrypted and stored in a JWT with the UUID identifier.
4. A QR code pops on his phone screen/Link is given to nick with the JWT.
5. Bongo scans it and is redirected to import contact endpoint. JWT is pulled from URL bar and sent to server at `/import_contact`
6. Contact/Address is decrypted and sent back to Bongo so he can add it to his contact list. The tracked UUID is expired in the DB and the JWT is invalidated.
7. Bongo now has Nick's "Address" and "Public Key" - He can now chat with Nick.
8. A Kafka message is posted to nick, sharing Bongo's address and public key, encrypted with nicks public key - so that nick can get bongo's contact.

**One Existing User**
1. Nick clicks "share contact".
2. Oakley scans it. Tab opens, but Oakley does not have a SIM.
3. Create SIM workflow opens. Sim is created/downloaded and regular process initiates.


## To Do

### Client

[ ] - Allow users to share their contact with a signed link/QR code.
[ ] - Allow users to start a new sim without a password so they can quickly import a received contact on init sim.
[ ] - Create an invite link, that allows users to send initial private message, and provide the signed link to other user who can quickly jump in and read it.
[ ] - Improved create sim workflow for non-exsiting sims importing a contact for first time

### Server

[ ] - Build a Python HTTP Server with Fast API
[ ] - Build a health check route.
[ ] - Start a MongoDB to store meta data.
[ ] - Build a base Beanie Model for database schemas
[ ] - Create a `register sim` route, which seals the "address" property of the sim in a non-expiring JWT.
[ ] - Create a `share contact` route, which generates a JWT sealed with the encrypted "address" of the contact.
[ ] - Create a `add contact` route, which when provided with the JWT expires the shared JWT contact in the database and returns the decrypted "address" of the contact.
[ ] - Create an `invite_link` flow, similar to the contact flow.
[ ] - Create chat endpoint
[ ] - Configure Kafka relay server to hold and send chats on chat endpoint connections.

### Kafka 

[ ] - Configure kafka container with
