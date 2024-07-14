use lettre::message::{header, Mailbox, MultiPart, SinglePart};
use lettre::transport::smtp;
use lettre::{AsyncSmtpTransport, AsyncTransport, Tokio1Executor};

pub fn validate_email(email: &str) -> Result<(), Vec<&str>> {
    let mut errors = vec![];
    if !email.contains('@') {
        errors.push("Email must contain an @ symbol");
    }

    if errors.is_empty() {
        Ok(())
    } else {
        Err(errors)
    }
}

pub async fn send_password_reset_email(user_email: &str) -> Result<(), String> {
    let settings = crate::settings::get_settings();

    let sender_mailbox: Mailbox = format!("This is from me <{}>", settings.email_user)
        .parse()
        .unwrap();
    let receiver_mailbox: Mailbox = format!("You <{}>", user_email).parse().unwrap();

    // TODO: This token should have an expiration time
    let secure_token = crate::secure_token::generate_token(user_email);

    let content = format!(
        "<h1>Reset your password</h1><a href=\"http://localhost:8080/reset?token={secure_token}\">Click here to reset your password</a>"
    );

    let email = lettre::Message::builder()
        .from(sender_mailbox)
        .to(receiver_mailbox)
        .subject("Forgotten password for RustMX")
        .singlepart(
            lettre::message::SinglePart::builder()
                .header(header::ContentType::TEXT_HTML)
                .body(content),
        )
        .unwrap();

    let credentials = smtp::authentication::Credentials::new(
        settings.email_user.clone(),
        settings.email_password.clone(),
    );

    let mailer: AsyncSmtpTransport<Tokio1Executor> =
        AsyncSmtpTransport::<Tokio1Executor>::relay(&settings.email_host)
            .unwrap()
            .credentials(credentials)
            .build();

    match mailer.send(email).await {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
