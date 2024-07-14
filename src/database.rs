use crate::models::{NewUser, NewWordPair, User, WordPair};
use crate::settings::get_settings;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use uuid::Uuid;
use chrono::NaiveDateTime;

pub fn establish_connection() -> PgConnection {
    let database_url = &get_settings().database_url;
    PgConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

// TODO: Return result
pub fn save_wordpair(spanish_word: &str, english_word: &str) {
    use crate::schema::wordpairs;

    let connection = &mut establish_connection();
    let new_wordpair = NewWordPair {
        spanish_word,
        english_word,
    };

    // Remove existing pair, if any
    diesel::delete(wordpairs::table.filter(wordpairs::spanish_word.eq(spanish_word)))
        .execute(connection)
        .expect("Error deleting wordpair");

    diesel::insert_into(wordpairs::table)
        .values(&new_wordpair)
        .execute(connection)
        .expect("Error saving new wordpair");
}

pub fn get_all_wordpairs() -> Vec<(String, String)> {
    use crate::schema::wordpairs::dsl::*;

    let connection = &mut establish_connection();
    wordpairs
        .select((spanish_word, english_word))
        .load(connection)
        .expect("Error loading wordpairs")
}

pub fn delete_wordpair(spanish_word_target: &str) {
    use crate::schema::wordpairs::dsl::*;

    let connection = &mut establish_connection();
    diesel::delete(wordpairs.filter(spanish_word.eq(spanish_word_target)))
        .execute(connection)
        .expect("Error deleting wordpair");
}

pub fn get_wordpair(spanish_word_target: &str) -> Option<WordPair> {
    use crate::schema::wordpairs::dsl::*;

    let connection = &mut establish_connection();
    wordpairs
        .filter(spanish_word.eq(spanish_word_target))
        .first(connection)
        .optional()
        .expect("Error loading wordpair")
}

pub fn edit_wordpair(id_target: i32, spanish_word_new: &str, english_word_new: &str) {
    use crate::schema::wordpairs::dsl::*;

    let connection = &mut establish_connection();
    diesel::update(wordpairs.filter(id.eq(id_target)))
        .set((
            spanish_word.eq(spanish_word_new),
            english_word.eq(english_word_new),
        ))
        .execute(connection)
        .expect("Error updating wordpair");
}

// Returns true if the user was succesfully inserted, otherwise false
pub fn insert_once(new_user: NewUser, connection: &mut PgConnection) -> Result<(), String> {
    use crate::schema::users::dsl::*;

    let result = users
        .filter(email.eq(&new_user.email))
        .select(User::as_select()) // Ensure we select the correct fields
        .first::<User>(connection)
        .optional();

    match result {
        Ok(Some(_)) => Err("User already exists".to_string()),
        Ok(None) => {
            diesel::insert_into(users)
                .values(&new_user)
                .execute(connection)
                .map_err(|err| format!("Error saving new user: {:?}", err))?;
            Ok(())
        }
        Err(e) => Err(format!("Error: {:?}", e)),
    }
}

pub fn user_exists(user_email: &str, connection: &mut PgConnection) -> bool {
    use crate::schema::users::dsl::*;
    let result = users
        .filter(email.eq(user_email))
        .select(User::as_select()) // Ensure we select the correct fields
        .first::<User>(connection)
        .optional();

    match result {
        Ok(Some(_)) => {
            return true;
        }
        Ok(None) => {
            return false;
        }
        Err(_) => {
            return false;
        }
    }
}

pub fn update_password(user_email: &str, new_password: &str, connection: &mut PgConnection) {
    use crate::schema::users::dsl::*;
    let result = diesel::update(users.filter(email.eq(user_email)))
        .set(password.eq(new_password))
        .returning(User::as_select())
        .get_result::<User>(connection);
    match result {
        Ok(_) => {}
        Err(_) => {}
    }
}
