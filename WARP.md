# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a full-stack movie catalog application built with Node.js/Express backend, MySQL database, and vanilla JavaScript frontend with Tailwind CSS. The application provides a RESTful API for managing movies with full CRUD operations and a responsive web interface.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload using nodemon
- `npm start` - Start production server
- `npm install` - Install dependencies
- `mysql -u root -p < database/schema.sql` - Initialize database with schema and sample data

### CSS Build Commands
- `npm run build:css` - Build Tailwind CSS once
- `npm run build:css:watch` - Watch and rebuild CSS on changes

### Database Setup
```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Or manually in MySQL console:
CREATE DATABASE movies_db;
USE movies_db;
# Then run the schema from database/schema.sql
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your database credentials
```

## Architecture Overview

### Backend Architecture
- **Entry Point**: `server.js` - Express server setup with middleware and route mounting
- **Database Layer**: `config/database.js` - MySQL connection pooling with promise-based interface
- **API Routes**: `routes/movies.js` - RESTful movie endpoints with comprehensive validation and error handling
- **Database**: MySQL with single `movies` table containing: id, title, director, genre, release_year, rating, timestamps

### Frontend Architecture
- **Single Page Application**: `public/index.html` - Complete UI with modals and responsive design
- **JavaScript**: `public/js/app.js` - Vanilla JS handling API calls, DOM manipulation, and user interactions
- **Styling**: Tailwind CSS (CDN version) with custom color scheme
- **State Management**: DOM-based with local JavaScript variables

### Key Design Patterns
- **Connection Pooling**: Database uses mysql2 connection pool for performance and reliability
- **Input Validation**: Comprehensive server-side validation with detailed error messages
- **RESTful API**: Standard HTTP methods (GET, POST, PUT, DELETE) with consistent JSON responses
- **Error Handling**: Centralized error middleware with environment-aware error details
- **Frontend State**: Real-time UI updates after API operations without page refresh

## API Endpoints

All endpoints return JSON with consistent structure:
```javascript
{
  success: boolean,
  message?: string,
  data?: object|array,
  errors?: array
}
```

- `GET /api/movies` - List all movies (ordered by creation date)
- `GET /api/movies/:id` - Get single movie by ID
- `POST /api/movies` - Create new movie (requires: title, director, genre, release_year)
- `PUT /api/movies/:id` - Update existing movie (full replacement)
- `DELETE /api/movies/:id` - Delete movie by ID

## Database Schema

The `movies` table structure:
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `title` (VARCHAR(255), NOT NULL)
- `director` (VARCHAR(255), NOT NULL) 
- `genre` (VARCHAR(100), NOT NULL)
- `release_year` (YEAR, NOT NULL)
- `rating` (DECIMAL(2,1), OPTIONAL, 0-10 range)
- `created_at` (TIMESTAMP, AUTO)
- `updated_at` (TIMESTAMP, AUTO ON UPDATE)

## Validation Rules

### Movie Input Validation
- **Title**: Required, non-empty string
- **Director**: Required, non-empty string  
- **Genre**: Required, non-empty string
- **Release Year**: Required integer, 1888 to current year + 5
- **Rating**: Optional decimal, 0.0 to 10.0 range

## Environment Configuration

Required environment variables in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=movies_db
DB_PORT=3306
PORT=3001
NODE_ENV=development
```

## Development Notes

### Working with the Database
- The application uses connection pooling for better performance
- Database connection is tested on startup with helpful error messages
- All database operations use prepared statements to prevent SQL injection
- Transactions are not currently implemented but can be added for complex operations

### Frontend Development
- The UI is a single HTML file with vanilla JavaScript - no build process needed for JS
- Tailwind CSS is loaded via CDN - modify `tailwind.config.js` for local builds only
- All API interactions use the Fetch API with proper error handling
- Modal forms handle both create and edit operations
- Real-time search and filtering implemented client-side

### Error Handling
- Server returns appropriate HTTP status codes (400, 404, 500)
- Validation errors include specific field-level messages
- Frontend displays user-friendly toast notifications
- Development mode exposes detailed error stacks

### Testing the API
Use curl commands for API testing:
```bash
# Get all movies
curl http://localhost:3001/api/movies

# Add movie
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Movie","director":"Test Director","genre":"Drama","release_year":2024,"rating":7.5}'
```

## File Structure Context

- `server.js` - Main application entry point with Express setup
- `config/database.js` - Database connection and pooling configuration
- `routes/movies.js` - All movie-related API route handlers with validation
- `database/schema.sql` - Database schema and sample data for initialization
- `public/index.html` - Complete frontend application (SPA)
- `public/js/app.js` - Frontend JavaScript for UI interactions and API calls
- `tailwind.config.js` - Tailwind CSS configuration for local builds
- `render.yaml` & `Procfile` - Deployment configurations for Render and Heroku
