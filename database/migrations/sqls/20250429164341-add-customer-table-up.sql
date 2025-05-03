CREATE TABLE IF NOT EXISTS customer
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255)                        NOT NULL,
    email      VARCHAR(255)                        NOT NULL,
    phone      VARCHAR(13)                         NOT NULL,
    document   VARCHAR(13)                         NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO customer (name, email, phone, document, created_at, updated_at)
VALUES ('Ana Paula Ferreira', 'ana.ferreira@example.com', '11981234567', 39053344705, NOW(), NOW()),
       ('Bruno Lima', 'bruno.lima@example.com', '11987654321', 68712788050, NOW(), NOW()),
       ('Camila Rocha', 'camila.rocha@example.com', '11999887766', 29537902004, NOW(), NOW()),
       ('Diego Martins', 'diego.martins@example.com', '11995544332', 75657457077, NOW(), NOW()),
       ('Eduarda Souza', 'eduarda.souza@example.com', '11996667788', 35606579006, NOW(), NOW());