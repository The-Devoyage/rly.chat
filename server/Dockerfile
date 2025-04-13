# === Stage 1: Build the application ===
FROM rust:latest AS builder

# Create a new empty shell project
WORKDIR /app

# Install system dependencies (for OpenSSL, etc. if needed)
RUN apt-get update && apt-get install -y pkg-config libssl-dev

# # Copy only the Cargo.toml and Cargo.lock to cache dependencies
# COPY Cargo.toml Cargo.lock ./

# # Create a dummy src/lib.rs to build dependencies
# RUN mkdir src && echo "fn main() {println!(\"Hey now, nothing here.\");}" > src/main.rs

# # Build dependencies to cache them
# RUN cargo build --release && rm -rf src

# Copy actual source code
COPY . .

# Build the actual binary
RUN cargo build --release

# === Stage 2: Create a minimal runtime image ===
FROM debian:bookworm-slim AS runtime

# Install SSL libraries if needed (for HTTPS, etc.)
RUN apt-get update && apt-get install -y libssl-dev 

# Set the working directory
WORKDIR /app

# Copy the built binary from the builder
COPY --from=builder /app/target/release/rly-server  .

# Set the command to run your server
CMD ["./rly-server"]

