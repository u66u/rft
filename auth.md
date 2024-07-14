    DATABASE
Usernames/emails | Password (salted hashed password) | Salt
test@test.com    | 951abcff  | Salt1
test2@test.com   | 123bcda3  | Salt2

Login process:
User sends (email, password) -> server
Server looks up whether it has a user with that email
Password ?==? hashed password
Hash (Salt1 + Password) == hashed password

On successful login, server establishes a "session"
It sends some kind token that contains information about the user
(User id, access rights)
Token has to be encrypted
MAC (Message Authentication Code) that ensures that the message
content has not been altered

We need a system to handle secure tokens
In general, tokens tell the server that some request has been authorized by the server.


Salt: Random bytes
Final Hash: hashing of (Salt + Password)


Password reset? Account activation?
We need the capability to send emails
SMTP: Simple Mail Transfer Protocol





Password hashing:
- Crate password_hash / argon2 subcrate

User table:
- Contains username, user emails (for PW reset and user verification)
- Contains salt + hashed password
- Is account activated? (If we include an activation step)

SMTP integration
- Probably gmail is easiest
- Send verification or reset emails with secure token


Secure token management
- For session management
- For user verification / PW reset
- JWT (old) or PASETO (modern)
- crate: pasetors


