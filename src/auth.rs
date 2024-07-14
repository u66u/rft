use crate::database::*;
use crate::models::*;
use crate::password::verify_password;
use diesel::prelude::*;

pub fn validate_login(username_inc: &str, password_inc: &str) -> bool {
    use crate::schema::users::dsl::*;

    let connection = &mut establish_connection();
    let result = users
        .filter(email.eq(username_inc))
        .select(User::as_select()) // Ensure we select the correct fields
        .first::<User>(connection)
        .optional();

    match result {
        Ok(Some(user)) => {
            println!("Verifying against hash: {}", &user.password);
            match verify_password(password_inc, &user.password) {
                Ok(true) => true,
                Ok(false) => false,
                Err(_) => false,
            }
        }
        Ok(None) => false,
        Err(_) => {
            // TODO: Later on add logging
            false
        }
    }
}
