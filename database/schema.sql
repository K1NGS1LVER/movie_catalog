-- Create database
CREATE DATABASE IF NOT EXISTS movies_db;
USE movies_db;

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    release_year YEAR NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO movies (title, director, genre, release_year, rating) VALUES
('The Shawshank Redemption', 'Frank Darabont', 'Drama', 1994, 9.3),
('The Godfather', 'Francis Ford Coppola', 'Crime', 1972, 9.2),
('The Dark Knight', 'Christopher Nolan', 'Action', 2008, 9.0),
('Pulp Fiction', 'Quentin Tarantino', 'Crime', 1994, 8.9),
('Schindler\'s List', 'Steven Spielberg', 'Drama', 1993, 8.9);
