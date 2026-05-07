CREATE TABLE admin_users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role         VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    enabled      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE pets (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(100)   NOT NULL,
    species             VARCHAR(50)    NOT NULL,
    breed               VARCHAR(100)   NOT NULL,
    age_months          INTEGER        NOT NULL CHECK (age_months >= 0),
    price               NUMERIC(10,2)  NOT NULL CHECK (price > 0),
    availability_status VARCHAR(20)    NOT NULL DEFAULT 'AVAILABLE',
    photo_url           VARCHAR(500),
    description         TEXT,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_pets_species    ON pets (species);
CREATE INDEX idx_pets_breed      ON pets (breed);
CREATE INDEX idx_pets_deleted_at ON pets (deleted_at);
CREATE INDEX idx_pets_price      ON pets (price);
CREATE INDEX idx_admin_username  ON admin_users (username);
