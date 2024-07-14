CREATE TYPE iq_test_type AS ENUM ('Verbal', 'Numerical', 'Logical', 'Spatial');

CREATE TABLE iq_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    test_type iq_test_type NOT NULL,
    correct_answers INT NOT NULL,
    correct_responses BOOLEAN[] NOT NULL, -- bool array
    result INT NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP NOT NULL
);
