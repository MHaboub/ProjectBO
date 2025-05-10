DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
        CREATE TYPE role_type AS ENUM ('ADMIN', 'USER', 'MANAGER');
    END IF;
END$$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role role_type NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(10,2) NOT NULL,
    lieu VARCHAR(255),
    time VARCHAR(50)
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    structure VARCHAR(50),
    profile VARCHAR(50),
    deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT uk_participant_email UNIQUE (email)
);

-- Create participant_formations join table for many-to-many relationship
CREATE TABLE IF NOT EXISTS participant_formations (
    participant_id INTEGER,
    formation_id INTEGER,
    PRIMARY KEY (participant_id, formation_id),
    FOREIGN KEY (participant_id) REFERENCES participants(id),
    FOREIGN KEY (formation_id) REFERENCES formations(id)
);