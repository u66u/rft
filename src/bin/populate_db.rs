use diesel::prelude::*;
use rustmx::database::*;
use rustmx::models::*;
use rustmx::*;

fn main() {
    use crate::schema::wordpairs;
    use crate::schema::wordpairs::dsl::*;

    let connection = &mut establish_connection();
    for (es, en) in WORDPAIRS.iter() {
        let new_wordpair = NewWordPair {
            spanish_word: es,
            english_word: en,
        };

        let result = wordpairs
            .filter(spanish_word.eq(es))
            .first::<WordPair>(connection)
            .optional();

        match result {
            Ok(Some(_)) => {}
            Ok(None) => {
                diesel::insert_into(wordpairs::table)
                    .values(&new_wordpair)
                    .execute(connection)
                    .expect("Error saving new wordpair");
            }
            Err(_) => println!("Error checking for existing wordpair"),
        }
    }
}

const WORDPAIRS: [(&str, &str); 47] = [
    ("hola", "hello"),
    ("adiós", "goodbye"),
    ("por favor", "please"),
    ("gracias", "thank you"),
    ("sí", "yes"),
    ("no", "no"),
    ("agua", "water"),
    ("comida", "food"),
    ("casa", "house"),
    ("coche", "car"),
    ("gato", "cat"),
    ("perro", "dog"),
    ("rojo", "red"),
    ("azul", "blue"),
    ("verde", "green"),
    ("amarillo", "yellow"),
    ("blanco", "white"),
    ("uno", "one"),
    ("dos", "two"),
    ("tres", "three"),
    ("cuatro", "four"),
    ("cinco", "five"),
    ("hoy", "today"),
    ("mañana", "tomorrow"),
    ("ayer", "yesterday"),
    ("ahora", "now"),
    ("tiempo", "time"),
    ("libro", "book"),
    ("tren", "train"),
    ("avión", "plane"),
    ("mar", "sea"),
    ("montaña", "mountain"),
    ("norte", "north"),
    ("sur", "south"),
    ("este", "east"),
    ("oeste", "west"),
    ("familia", "family"),
    ("amigo", "friend"),
    ("trabajo", "work"),
    ("escuela", "school"),
    ("dinero", "money"),
    ("feliz", "happy"),
    ("triste", "sad"),
    ("grande", "big"),
    ("pequeño", "small"),
    ("caliente", "hot"),
    ("frío", "cold"),
];
