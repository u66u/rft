use pasetors::claims::{Claims, ClaimsValidationRules};
use pasetors::keys::{Generate, SymmetricKey};
use pasetors::paserk::FormatAsPaserk;
use pasetors::token::UntrustedToken;
use pasetors::{local, version4::V4, Local};

fn main() {
    let mut claims = Claims::new().unwrap();
    claims
        .add_additional("data", "This is super secret")
        .unwrap();
    claims.add_additional("userid", "1234").unwrap();
    claims.expiration("2039-01-01T00:00:00+00:00").unwrap();

    // TODO: Look into how this is generated
    // let sk = SymmetricKey::<V4>::generate().unwrap();
    // println!("Secret key: {:?}", sk);
    // let mut paserk = String::new();
    // sk.fmt(&mut paserk).unwrap();
    // println!("Paserk: {:?}", paserk);

    let secret_from_settings = "k4.local.HlMBf5cHedQSsyRtvxl2ACFTt7hGaOi7vLZxmZzv6TY";
    let sk = SymmetricKey::<V4>::try_from(secret_from_settings).unwrap();
    // println!("Secret key: {:?}", sk);
    let token = local::encrypt(&sk, &claims, None, Some(b"abc")).unwrap();
    // println!("Token: {:?}", token);

    let validation_rules = ClaimsValidationRules::new();
    let untrusted_token = UntrustedToken::<Local, V4>::try_from(&token).unwrap();

    // Verify it
    let trusted_token =
        local::decrypt(&sk, &untrusted_token, &validation_rules, None, Some(b"abc")).unwrap();
    println!(
        "Claims in token: {:?}",
        trusted_token.payload_claims().unwrap()
    );
}
