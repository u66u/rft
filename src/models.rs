use crate::schema::wordpairs;
use crate::schema::{syllogism_attempts, users};
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use uuid::Uuid;


#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::wordpairs)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct WordPair {
    pub id: i32,
    pub spanish_word: String,
    pub english_word: String,
}

#[derive(Insertable)]
#[diesel(table_name = wordpairs)]
pub struct NewWordPair<'a> {
    pub spanish_word: &'a str,
    pub english_word: &'a str,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub name: Option<String>,
    pub password: String, // This is really a serialized version of the Argon2 PasswordHash struct which contains information about the algorithm, salt, and hash.
    pub is_active: bool,
    pub is_admin: bool,
    pub is_verified: bool,
    pub max_stage: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(diesel_derive_enum::DbEnum, Debug)]
#[ExistingTypePath = "crate::schema::sql_types::AttemptType"]
pub enum AttemptType {
    Normal,
    Test
}

#[derive(Queryable, Insertable, AsChangeset, Selectable )]
#[diesel(table_name = crate::schema::syllogism_attempts)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct SyllogismAttempt {
    pub id: Uuid,
    pub user_id: Uuid,
    pub attempt_type: AttemptType,
    pub stage_number: i32,
    pub time_constraint_secs: i32,
    pub correct_answers: i32,
    pub completed_successfully: bool,
    pub started_at: NaiveDateTime,
    pub finished_at: Option<NaiveDateTime>,
    pub attempt_number: i32,
    pub times_taken_secs: Vec<Option<i32>>,
}


#[derive(diesel_derive_enum::DbEnum, Debug)]
#[ExistingTypePath = "crate::schema::sql_types::IqTestType"]
pub enum IqTestType {
    Verbal,
    Numerical,
    Logical,
    Spatial
}

#[derive(Queryable, Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::iq_tests)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct IqTest {
    pub id: Uuid,
    pub user_id: Uuid,
    pub test_type: IqTestType,
    pub correct_answers: i32,
    pub correct_responses: Vec<bool>, // vector of bools
    pub result: i32,
    pub started_at: NaiveDateTime,
    pub finished_at: NaiveDateTime,
}


#[derive(Insertable)]
#[diesel(table_name = users)]
pub struct NewUser<'a> {
    pub email: &'a str,
    pub password: &'a str,
}
