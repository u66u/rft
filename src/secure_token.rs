use pasetors::claims::{Claims, ClaimsValidationRules};
use pasetors::keys::{Generate, SymmetricKey};
use pasetors::token::UntrustedToken;
use pasetors::{local, version4::V4, Local};

pub fn generate_token(username: &str) -> String {
    let settings = crate::settings::get_settings();
    let mut claims = Claims::new().unwrap();
    claims.add_additional("username", username).unwrap();
    claims.expiration("2039-01-01T00:00:00+00:00").unwrap(); // TODO: Set this as a week from now

    let sk = SymmetricKey::<V4>::try_from(settings.cookie_secret.as_str()).unwrap();

    local::encrypt(
        &sk,
        &claims,
        None,
        Some(settings.implicit_assertion.as_bytes()),
    )
    .unwrap() // TODO Handle errors
}

// Verify token and return username
pub fn verify_token(token: &str) -> Result<String, ()> {
    let settings = crate::settings::get_settings();

    let validation_rules = ClaimsValidationRules::new();
    let untrusted_token = UntrustedToken::<Local, V4>::try_from(token).unwrap();

    let sk = SymmetricKey::<V4>::try_from(settings.cookie_secret.as_str()).unwrap();
    // Verify it
    let trusted_token = local::decrypt(
        &sk,
        &untrusted_token,
        &validation_rules,
        None,
        Some(settings.implicit_assertion.as_bytes()),
    );

    match trusted_token {
        Ok(token) => {
            let claims = token.payload_claims();
            match claims {
                Some(claims) => Ok(claims.get_claim("username").unwrap().to_string()),
                None => Err(()),
            }
        }
        Err(_) => Err(()),
    }
}
