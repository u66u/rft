-- This file should undo anything in `up.sql`
ALTER TABLE users DROP COLUMN created_at;
ALTER TABLE users DROP COLUMN updated_at;
ALTER TABLE users DROP COLUMN is_active;
ALTER TABLE users DROP COLUMN is_admin;
ALTER TABLE users DROP COLUMN is_verified;
