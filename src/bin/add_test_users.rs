use diesel::prelude::*;
use rustmx::database::*;
use rustmx::models::*;
use rustmx::password::hash_password;
use rustmx::*;

fn main() {
    let connection = &mut establish_connection();

    let new_user = NewUser {
        email: "test1",
        password: &hash_password("password1").unwrap(),
    };
    insert_once(new_user, connection);

    let new_user = NewUser {
        email: "test2",
        password: &hash_password("password2").unwrap(),
    };
    insert_once(new_user, connection);

    let new_user = NewUser {
        email: "test3",
        password: &hash_password("password3").unwrap(),
    };
    insert_once(new_user, connection);
}

fn insert_once(new_user: NewUser, connection: &mut PgConnection) {
    use crate::schema::users;
    use crate::schema::users::dsl::*;
    let result = users
        .filter(email.eq(&new_user.email))
        .select(User::as_select())
        .first::<User>(connection)
        .optional();

    match result {
        Ok(Some(_)) => {}
        Ok(None) => {
            diesel::insert_into(users::table)
                .values(&new_user)
                .execute(connection)
                .expect("Error saving new user");
        }
        Err(e) => println!("Error: {:?}", e),
    }
}
