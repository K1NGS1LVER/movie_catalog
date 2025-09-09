const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// Input validation helper
const validateMovieInput = (movie) => {
    const { title, director, genre, release_year, rating } = movie;
    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push('Title is required');
    }
    if (!director || director.trim().length === 0) {
        errors.push('Director is required');
    }
    if (!genre || genre.trim().length === 0) {
        errors.push('Genre is required');
    }
    if (!release_year || isNaN(release_year) || release_year < 1888 || release_year > new Date().getFullYear() + 5) {
        errors.push('Valid release year is required');
    }
    if (rating !== undefined && (isNaN(rating) || rating < 0 || rating > 10)) {
        errors.push('Rating must be between 0 and 10');
    }

    return errors;
};

// GET /api/movies - Retrieve all movies
router.get('/movies', async (req, res) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT id, title, director, genre, release_year, rating, created_at, updated_at FROM movies ORDER BY created_at DESC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching movies',
            error: error.message
        });
    }
});

// GET /api/movies/:id - Retrieve a specific movie
router.get('/movies/:id', async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        
        if (isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid movie ID'
            });
        }

        const [rows] = await promisePool.execute(
            'SELECT id, title, director, genre, release_year, rating, created_at, updated_at FROM movies WHERE id = ?',
            [movieId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching movie',
            error: error.message
        });
    }
});

// POST /api/movies - Add a new movie
router.post('/movies', async (req, res) => {
    try {
        const { title, director, genre, release_year, rating } = req.body;
        
        // Validate input
        const errors = validateMovieInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors
            });
        }

        const [result] = await promisePool.execute(
            'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)',
            [title.trim(), director.trim(), genre.trim(), release_year, rating || null]
        );

        // Fetch the created movie
        const [newMovie] = await promisePool.execute(
            'SELECT id, title, director, genre, release_year, rating, created_at, updated_at FROM movies WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Movie added successfully',
            data: newMovie[0]
        });
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding movie',
            error: error.message
        });
    }
});

// PUT /api/movies/:id - Update an existing movie
router.put('/movies/:id', async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        
        if (isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid movie ID'
            });
        }

        const { title, director, genre, release_year, rating } = req.body;
        
        // Validate input
        const errors = validateMovieInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors
            });
        }

        // Check if movie exists
        const [existingMovie] = await promisePool.execute(
            'SELECT id FROM movies WHERE id = ?',
            [movieId]
        );

        if (existingMovie.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Update the movie
        await promisePool.execute(
            'UPDATE movies SET title = ?, director = ?, genre = ?, release_year = ?, rating = ? WHERE id = ?',
            [title.trim(), director.trim(), genre.trim(), release_year, rating || null, movieId]
        );

        // Fetch the updated movie
        const [updatedMovie] = await promisePool.execute(
            'SELECT id, title, director, genre, release_year, rating, created_at, updated_at FROM movies WHERE id = ?',
            [movieId]
        );

        res.json({
            success: true,
            message: 'Movie updated successfully',
            data: updatedMovie[0]
        });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating movie',
            error: error.message
        });
    }
});

// DELETE /api/movies/:id - Delete a movie
router.delete('/movies/:id', async (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        
        if (isNaN(movieId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid movie ID'
            });
        }

        // Check if movie exists
        const [existingMovie] = await promisePool.execute(
            'SELECT id, title FROM movies WHERE id = ?',
            [movieId]
        );

        if (existingMovie.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Delete the movie
        await promisePool.execute(
            'DELETE FROM movies WHERE id = ?',
            [movieId]
        );

        res.json({
            success: true,
            message: 'Movie deleted successfully',
            data: {
                id: movieId,
                title: existingMovie[0].title
            }
        });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting movie',
            error: error.message
        });
    }
});

module.exports = router;
