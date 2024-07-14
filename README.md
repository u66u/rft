1. Download htmx:
```
wget https://raw.githubusercontent.com/bigskysoftware/htmx/master/src/htmx.js -O assets/htmx.js
```

2. Fill in the .env (get a symmetric key first, which serves as a cookie secret key)
```
cargo install diesel_cli --no-default-features --features "postgres"
cargo run --bin generate_symmetrickey
cp .env.example .env
```

3. Start postgres, run migrations and import test data
```
sudo systemctl start postgresql.service
diesel migration run
cargo run --bin add_test_users
cargo run --bin populate_db
```

4. Run the server with live reload
```
cargo watch -x "run --bin server"
```


fork of https://gitlab.com/codescope-reference/rustmx

TODO:
- Fix docker-compose (database ports, env variables, need to export DATABASE_URL for sqlx)
- Add JWT as an additional auth method (right now using PASETO)
- Use svelte?
- Add scripts to populate users and create initial data in db
