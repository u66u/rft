use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

fn main() {
    let argon2 = Argon2::default();
    let password = b"password";
    let salt = SaltString::generate(&mut OsRng);

    // Generate password to store in DB
    // --------------------------------
    let password_hash = argon2.hash_password(password, &salt).unwrap();
    println!("Password hash: {:?}", password_hash);
    println!("-----------------------------------");
    let password_hash_string = password_hash.to_string();
    println!("Password hash string: {:?}", password_hash_string);
    println!("-----------------------------------");
    let parsed_password_hash = PasswordHash::new(&password_hash_string).unwrap();
    println!("Parsed password hash: {:?}", parsed_password_hash);

    // Verify incoming passwords
    // -------------------------
    let test_password = b"password";
    let test_password2 = b"pasword";

    let result1 = argon2.verify_password(test_password, &password_hash);
    let result2 = argon2.verify_password(test_password2, &password_hash);
    println!("Result1: {:?}", result1);
    println!("Result2: {:?}", result2);
}
