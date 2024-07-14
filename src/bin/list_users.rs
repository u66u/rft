use diesel::prelude::*;
use rustmx::database::*;
use rustmx::models::*;
use rustmx::*;

fn main() {
    use self::schema::users::dsl::*;

    let connection = &mut establish_connection();
    let result = users
        .limit(100)
        .select(User::as_select())
        .load(connection)
        .expect("Error loading users");

    println!("Displaying {} users", result.len());

    for user in result {
        println!("Email: {}", user.email);
        println!("Password: {}", user.password);
    }
}
