CREATE DATABASE olx_clone;

CREATE TABLE olx_user (
    uid SERIAL PRIMARY KEY,
    userName VARCHAR(20),
    password VARCHAR(30)
);

CREATE TABLE user_chats (
    user_chats_id SERIAL PRIMARY KEY,
    olx_user_id INT REFERENCES olx_user(uid),
    chat_id INT REFERENCES chat(chat_id)
);

CREATE TABLE chat (
    chat_id SERIAL PRIMARY KEY,
    history TEXT[],
    contact_person_id INT REFERENCES olx_user(uid),
    user_id INT REFERENCES olx_user(uid)
);

CREATE TABLE files (
    file_id SERIAL PRIMARY KEY,
    filename VARCHAR(255),
    filepath VARCHAR(255)
);

CREATE TABLE post_files (
    post_files_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES post(post_id),
    file_id INT REFERENCES files(file_id)
);

CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    contact_person_id INT REFERENCES olx_user(uid)
    created_at TIMESTAMP DEFAULT NOW(),
    post_title VARCHAR(255),
    category VARCHAR(50),
    post_description TEXT,
    price DECIMAL(10, 2),
    location VARCHAR(50),
    contact_person VARCHAR(50),
    email VARCHAR(40),
    phone_number VARCHAR(20)
);