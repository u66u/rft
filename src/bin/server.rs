use actix_files as fs;
use actix_web::{App, HttpServer};
use rustmx::middleware::CheckLogin;
use rustmx::{
    add_word_pair, add_word_pair_post, delete_word_pair, edit, edit_word_pair,
    edit_word_pair_patch, forgot_password, forgot_password_post, index, login, login_post, logout,
    register, register_post, reset_password, reset_password_post, word_pair_endpoint,
    words_endpoint,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(CheckLogin)
            .service(index)
            .service(words_endpoint)
            .service(word_pair_endpoint)
            .service(add_word_pair)
            .service(add_word_pair_post)
            .service(edit)
            .service(delete_word_pair)
            .service(edit_word_pair)
            .service(edit_word_pair_patch)
            .service(login)
            .service(login_post)
            .service(register)
            .service(register_post)
            .service(logout)
            .service(forgot_password)
            .service(forgot_password_post)
            .service(reset_password)
            .service(reset_password_post)
            .service(fs::Files::new("/assets", "./assets"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
