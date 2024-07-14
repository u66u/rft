pub mod auth;
pub mod database;
pub mod middleware;
pub mod models;
pub mod password;
pub mod schema;
pub mod secure_token;
pub mod settings;
pub mod utils;
pub mod words;
pub mod syllogism;

// delete, patch, put,
use actix_web::cookie::time;
use actix_web::{cookie::Cookie, get, post, web, HttpResponse, Responder};
use lazy_static::lazy_static;
use serde::Deserialize;
use tera::Tera;

lazy_static! {
    pub static ref TEMPLATES: Tera = {
        let source = "templates/**/*";
        let tera = Tera::new(source).unwrap();
        tera
    };
}

#[get("/")]
pub async fn index() -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("message_from_rust", "Hello from Rust!");
    let page_content = TEMPLATES.render("index.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[get("/words")]
pub async fn words_endpoint() -> impl Responder {
    let context = tera::Context::new();
    let page_content = TEMPLATES.render("words.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[get("/word-pair")]
pub async fn word_pair_endpoint() -> impl Responder {
    let (word1, word2) = words::get_random_word_pair_from_db();
    let mut context = tera::Context::new();
    context.insert("word1", &word1);
    context.insert("word2", &word2);
    let page_content = TEMPLATES.render("word_pair.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[get("/add-word-pair")]
pub async fn add_word_pair() -> impl Responder {
    let context = tera::Context::new();
    let page_content = TEMPLATES.render("add_word_pair.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[get("/edit")]
pub async fn edit() -> impl Responder {
    let word_pairs = database::get_all_wordpairs();
    let mut context = tera::Context::new();
    context.insert("word_pairs", &word_pairs);
    let page_content = TEMPLATES.render("edit.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[post("/delete/{spanish_word}")]
pub async fn delete_word_pair(spanish_word: web::Path<String>) -> impl Responder {
    database::delete_wordpair(&spanish_word);
    HttpResponse::Ok().body("") // Empty body - new resource is empty, so return empty body
}

#[derive(Deserialize)]
struct FormWordPair {
    spanish: String,
    english: String,
}

#[post("/add-word-pair")]
pub async fn add_word_pair_post(data: web::Form<FormWordPair>) -> impl Responder {
    database::save_wordpair(&data.spanish, &data.english);
    let mut context = tera::Context::new();
    context.insert("pair", &(data.spanish.clone(), data.english.clone()));
    let page_content = TEMPLATES.render("edit_row.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
    // TODO: Adding a pair can overwrite an existing entry, so just returning the new pair is not
    // strictly correct
}

#[get("/edit/{spanish_word}")]
pub async fn edit_word_pair(spanish_word: web::Path<String>) -> impl Responder {
    let word_pair = database::get_wordpair(&spanish_word).expect("Word pair not found");
    let mut context = tera::Context::new();
    context.insert("id", &word_pair.id);
    context.insert("spanish", &word_pair.spanish_word);
    context.insert("english", &word_pair.english_word);
    let page_content = TEMPLATES.render("edit_existing.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[derive(Deserialize)]
struct EditWordPair {
    id: i32,
    spanish: String,
    english: String,
}

#[post("/edit-word-pair")]
pub async fn edit_word_pair_patch(data: web::Form<EditWordPair>) -> impl Responder {
    database::edit_wordpair(data.id, &data.spanish, &data.english);
    let response = HttpResponse::Found()
        .append_header(("Location", "/edit"))
        .finish();
    response
}

#[get("/login")]
pub async fn login() -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("error_message", "");
    let page_content = TEMPLATES.render("login.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[derive(Deserialize)]
struct LoginForm {
    username: String,
    password: String,
}

#[post("/login")]
pub async fn login_post(data: web::Form<LoginForm>) -> impl Responder {
    let logged_in = auth::validate_login(&data.username, &data.password);
    if logged_in {
        let settings = settings::get_settings();
        HttpResponse::SeeOther()
            .append_header(("Location", "/words"))
            .cookie(
                Cookie::build(
                    settings.auth_cookie_name.clone(),
                    secure_token::generate_token(&data.username),
                )
                .path("/")
                .secure(true) // TODO: Read up on this
                .http_only(true) // This means javascript cannot access the cookie
                .finish(),
            )
            .finish()
    } else {
        let mut context = tera::Context::new();
        context.insert("error_message", "Login failed");
        let page_content = TEMPLATES.render("login.html", &context).unwrap();
        HttpResponse::Ok().body(page_content)
    }
}

#[get("/register")]
pub async fn register() -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("error_message", "");
    let page_content = TEMPLATES.render("register.html", &context).unwrap();
    HttpResponse::Ok().body(page_content)
}

#[post("/register")]
pub async fn register_post(data: web::Form<LoginForm>) -> impl Responder {
    let user_email = &data.username;
    let user_password = &data.password;
    let email_errors = utils::validate_email(user_email);
    match email_errors {
        Ok(_) => {
            // Register user, i.e. add user and hashed password to database
            // Log user in, i.e. give them a cookie
            // Redirect to /words
            let new_user = crate::models::NewUser {
                email: &user_email,
                password: &password::hash_password(user_password).unwrap(),
            };

            let connection = &mut database::establish_connection();
            let result = database::insert_once(new_user, connection);
            match result {
                Ok(_) => {
                    // Set up the cookie
                    // Redirect to /words
                    let settings = settings::get_settings();
                    // TODO: Refactor this part
                    return HttpResponse::SeeOther()
                        .append_header(("Location", "/words"))
                        .cookie(
                            Cookie::build(
                                settings.auth_cookie_name.clone(),
                                secure_token::generate_token(&data.username),
                            )
                            .path("/")
                            .secure(true) // TODO: Read up on this
                            .http_only(false) // TODO: Read up on this
                            .finish(),
                        )
                        .finish();
                }
                Err(err_msg) => {
                    let mut context = tera::Context::new();
                    context.insert("error_message", &err_msg);
                    let page_content = TEMPLATES.render("register.html", &context).unwrap();
                    return HttpResponse::Ok().body(page_content);
                }
            }
        }
        Err(errors) => {
            let mut context = tera::Context::new();
            let error_message = errors.join(", ");
            context.insert("error_message", &error_message);
            let page_content = TEMPLATES.render("register.html", &context).unwrap();
            return HttpResponse::Ok().body(page_content);
        }
    }
}

#[get("/logout")]
pub async fn logout() -> impl Responder {
    // NOTE: You might also want to keep a list of active session on the server, and remove this
    // user's session from that list on logout
    let settings = settings::get_settings();
    HttpResponse::SeeOther()
        .append_header(("Location", "/login"))
        .cookie(
            Cookie::build(settings.auth_cookie_name.clone(), "")
                .path("/")
                .secure(true) // TODO: Read up on this
                .http_only(true) // This means javascript cannot access the cookie
                .max_age(time::Duration::seconds(0))
                .finish(),
        )
        .finish()
}

#[get("/forgot")]
pub async fn forgot_password() -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("error_message", "");

    let page_content = TEMPLATES.render("forgot.html", &context).unwrap();
    return HttpResponse::Ok().body(page_content);
}

#[derive(Deserialize)]
struct ForgotPasswordForm {
    email: String,
}

#[post("/forgot")]
pub async fn forgot_password_post(data: web::Form<ForgotPasswordForm>) -> impl Responder {
    let connection = &mut database::establish_connection();
    let user_exists = database::user_exists(&data.email, connection);
    let mut context = tera::Context::new();
    if !user_exists {
        context.insert("error_message", "User does not exist");
    } else {
        let result = utils::send_password_reset_email(&data.email).await;
        match result {
            Ok(_) => {
                context.insert("error_message", "Password reset email sent");
            }
            Err(err_msg) => {
                context.insert("error_message", &err_msg);
            }
        }
    }
    let page_content = TEMPLATES.render("forgot.html", &context).unwrap();
    return HttpResponse::Ok().body(page_content);
}

#[derive(Deserialize)]
struct ResetData {
    token: String,
}

#[get("/reset")]
pub async fn reset_password(data: web::Query<ResetData>) -> impl Responder {
    let mut context = tera::Context::new();
    context.insert("error_message", "");
    context.insert("token", &data.token);
    let page_content = TEMPLATES.render("reset.html", &context).unwrap();
    return HttpResponse::Ok().body(page_content);
}

#[derive(Deserialize)]
struct ResetForm {
    token: String,
    password: String,
}

#[post("/reset")]
pub async fn reset_password_post(data: web::Form<ResetForm>) -> impl Responder {
    let username = secure_token::verify_token(&data.token);
    match username {
        Ok(username) => {
            // Update database with new password
            let new_password = password::hash_password(&data.password).unwrap();
            let connection = &mut database::establish_connection();
            let username = username.replace("\"", "");
            database::update_password(&username, &new_password, connection);
            return HttpResponse::SeeOther()
                .append_header(("Location", "/login"))
                .finish();
        }
        Err(_) => {
            // TODO: Add logging
            return HttpResponse::Forbidden().finish();
        }
    }
}
