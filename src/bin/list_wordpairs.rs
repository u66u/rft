use diesel::prelude::*;
use rustmx::database::*;
use rustmx::models::*;
use rustmx::*;

fn main() {
    use self::schema::wordpairs::dsl::*;

    let connection = &mut establish_connection();
    let result = wordpairs
        .limit(100)
        .select(WordPair::as_select())
        .load(connection)
        .expect("Error loading wordpairs");

    println!("Displaying {} wordpairs", result.len());

    for wordpair in result {
        println!("{} <-> {}", wordpair.spanish_word, wordpair.english_word);
    }
}
