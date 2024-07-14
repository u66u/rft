static WORDS: &str = include_str!("../assets/words.json");
use crate::database::establish_connection;
use crate::models::*;
use diesel::prelude::*;
use rand::Rng;

pub fn get_words() -> String {
    WORDS.to_string()
}

pub fn get_random_word_pair() -> (String, String) {
    let lines = WORDS.lines();
    let n_words = lines.count();
    let random_index = rand::thread_rng().gen_range(0..n_words);
    let word_pair = WORDS.lines().nth(random_index).unwrap();

    let mut words = word_pair.split(",");

    let word1 = words.next().unwrap().to_string();
    let word2 = words.next().unwrap().to_string();

    (word1, word2)
}

pub fn get_random_word_pair_from_db() -> (String, String) {
    use crate::schema::wordpairs::dsl::*;
    let connection = &mut establish_connection();

    let result = wordpairs
        .select(WordPair::as_select())
        .load(connection)
        .expect("Error loading wordpairs");

    let n_words = result.len();
    let random_index = rand::thread_rng().gen_range(0..n_words);
    let word_pair = &result[random_index];

    (
        word_pair.spanish_word.clone(),
        word_pair.english_word.clone(),
    )
}
