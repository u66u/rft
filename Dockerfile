FROM rust:latest as builder

WORKDIR /usr/src/app

COPY . .

RUN cargo build --bin server --release

FROM debian:buster-slim

COPY --from=builder /usr/src/app/target/release/server /usr/local/bin/server

CMD ["server"]
