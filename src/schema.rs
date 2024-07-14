// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "attempt_type"))]
    pub struct AttemptType;

    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "iq_test_type"))]
    pub struct IqTestType;
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::IqTestType;

    iq_tests (id) {
        id -> Uuid,
        user_id -> Uuid,
        test_type -> IqTestType,
        correct_answers -> Int4,
        correct_responses -> Array<Nullable<Bool>>,
        result -> Int4,
        started_at -> Timestamp,
        finished_at -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::AttemptType;

    syllogism_attempts (id) {
        id -> Uuid,
        user_id -> Uuid,
        attempt_type -> AttemptType,
        stage_number -> Int4,
        time_constraint_secs -> Int4,
        correct_answers -> Int4,
        completed_successfully -> Bool,
        started_at -> Timestamp,
        finished_at -> Nullable<Timestamp>,
        attempt_number -> Int4,
        times_taken_secs -> Array<Nullable<Int4>>,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        email -> Text,
        name -> Nullable<Text>,
        max_stage -> Int4,
        password -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        is_active -> Bool,
        is_admin -> Bool,
        is_verified -> Bool,
    }
}

diesel::table! {
    wordpairs (id) {
        id -> Int4,
        spanish_word -> Text,
        english_word -> Text,
    }
}

diesel::joinable!(iq_tests -> users (user_id));
diesel::joinable!(syllogism_attempts -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    iq_tests,
    syllogism_attempts,
    users,
    wordpairs,
);
