CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE attempt_type AS ENUM ('Normal', 'Test');

CREATE TABLE syllogism_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    attempt_type attempt_type NOT NULL,
    stage_number INT NOT NULL,
    time_constraint_secs INT NOT NULL,
    correct_answers INT NOT NULL DEFAULT 0,
    completed_successfully BOOLEAN NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    attempt_number INT NOT NULL,
    times_taken_secs INT[] NOT NULL
);
