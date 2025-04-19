# Rly Chat

**A privacy-focused, end-to-end encrypted chat application built with NextJS and Rust.**

Rly Chat is designed for secure and private communication, prioritizing user anonymity and data protection. 
We believe that your conversations should remain yours, and we've built this application with that principle at its core.

## Key Features:

* **No Accounts Required:** Get started chatting instantly without the hassle of creating and managing accounts. Your privacy begins from the moment you open the application.
* **Zero Personal Identifiable Information Stored:** We don't collect or store any personal data. Your identity remains private.
* **End-to-End Encrypted Messaging:** All messages are encrypted directly on your device before being sent and are only decrypted on the recipient's device. This ensures that no one, including us, can read your conversations.
* **Self-Hostable:** Take complete control of your communication infrastructure by self-hosting both the client and server components. This allows for maximum privacy and customization. (Coming Soon)

## Getting Started

This guide will walk you through the steps to get Rly Chat running in development mode.

### Client Side Application (Development)

The client-side application is built using Next.js, a popular React framework known for its performance and developer experience.

1.  **Navigate to the Client Directory:**
    ```bash
    cd client
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Set up Env Vars**

    Use the provided `example.env` as a guide.

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

    This command will start the Next.js development server. You can usually access the application in your browser at `http://localhost:3000`.

### Server Side Application (Development)

The server-side application is built using Rust, a language known for its speed, safety, and concurrency.

1.  **Ensure Rust is Installed:** If you don't have Rust installed, follow the instructions on the official Rust website: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install).

2.  **Navigate to the Server Directory:**
    ```bash
    cd server
    ```

3.  **Set up Env Vars**

    Use the provided `example.env` as a guide.

4.  **Run the Server:**
    ```bash
    cargo run
    ```

    This command will compile and run the Rust server. You should see output indicating that the server has started, typically listening on a specific port (e.g., `localhost:8080`).

## Running Container with Volume Mounts

```
docker run -p 5000:5000 --env-file ./.env -v deeb.json:/deeb.json thedevoyage/rly-server:0.x.x
```

## Next Steps and Considerations:

* **Self-Hosting Guide:** A more comprehensive guide on self-hosting, including configuration options and potential challenges, would be valuable for users who choose this route.
* **Multi Device Managemnt** Incorporate an association between devices allowing all devices to stay in sync without a need for a centralized database.

## Disclaimer:

Rly Chat is currently in development and may have limitations or bugs. Use it at your own discretion. We are continuously working to improve its security and features.

