# 🎬 Movie Catalog API

A full-stack movie catalog application built with Node.js, Express.js, MySQL, and Tailwind CSS. This application allows users to browse, add, edit, and delete movies in a beautiful, responsive interface.

![Movie Catalog](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete movies
- **RESTful API**: Well-structured API endpoints following REST principles
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Real-time Search**: Filter movies by title, director, or genre
- **Genre Filtering**: Quick filter by movie genre
- **Input Validation**: Server-side and client-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Database Connection**: MySQL integration with connection pooling
- **Hot Reload**: Nodemon for automatic server restart during development

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL2**: Database driver with promise support
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Modern ES6+ JavaScript
- **Fetch API**: HTTP client for API requests

### Development Tools
- **Nodemon**: Auto-restart server during development
- **Git**: Version control

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://dev.mysql.com/downloads/) (v5.7 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (for version control)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/K1NGS1LVER/movie_catalog.git
   cd movie_catalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=movies_db
   DB_PORT=3306
   PORT=3001
   NODE_ENV=development
   ```

4. **Set up the database**
   
   Create the database and tables by running the SQL script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   
   Or manually create the database:
   ```sql
   CREATE DATABASE movies_db;
   USE movies_db;
   
   CREATE TABLE movies (
       id INT AUTO_INCREMENT PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       director VARCHAR(255) NOT NULL,
       genre VARCHAR(100) NOT NULL,
       release_year YEAR NOT NULL,
       rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 10),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

## 🚀 Usage

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at: `http://localhost:3001`

### Production Mode

Start the production server:

```bash
npm start
```

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with nodemon
- `npm run build:css`: Build Tailwind CSS (if using local build)
- `npm run build:css:watch`: Watch and build CSS changes

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies |
| GET | `/api/movies/:id` | Get a specific movie |
| POST | `/api/movies` | Create a new movie |
| PUT | `/api/movies/:id` | Update an existing movie |
| DELETE | `/api/movies/:id` | Delete a movie |

### Example Requests

**Get all movies:**
```bash
curl http://localhost:3001/api/movies
```

**Create a new movie:**
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "director": "Christopher Nolan",
    "genre": "Sci-Fi",
    "release_year": 2010,
    "rating": 8.8
  }'
```

**Update a movie:**
```bash
curl -X PUT http://localhost:3001/api/movies/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception Updated",
    "director": "Christopher Nolan",
    "genre": "Sci-Fi",
    "release_year": 2010,
    "rating": 9.0
  }'
```

**Delete a movie:**
```bash
curl -X DELETE http://localhost:3001/api/movies/1
```

## 🗄️ Database Schema

```sql
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    release_year YEAR NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎨 Frontend Features

- **Responsive Grid Layout**: Movies displayed in a responsive card grid
- **Modal Forms**: Add/edit movies using modal dialogs
- **Real-time Search**: Filter movies as you type
- **Genre Filter**: Dropdown filter for movie genres
- **Toast Notifications**: User feedback for actions
- **Loading States**: Loading indicators for better UX
- **Form Validation**: Client-side and server-side validation

## 🚢 Deployment

The application is ready for deployment on various platforms:

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Set up MySQL database on Render
4. Configure environment variables

### Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Add JawsDB MySQL addon
4. Configure environment variables
5. Deploy using `git push heroku main`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_USER` | Database username | root |
| `DB_PASSWORD` | Database password | root |
| `DB_NAME` | Database name | movies_db |
| `DB_PORT` | Database port | 3306 |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |

## 🧪 Testing

To test the API endpoints, you can use:

1. **Browser**: Navigate to `http://localhost:3001` for the web interface
2. **cURL**: Use the example requests above
3. **Postman**: Import the API endpoints
4. **Thunder Client**: VS Code extension for API testing

## 📁 Project Structure

```
movie-catalog-api/
├── config/
│   └── database.js          # Database configuration
├── database/
│   └── schema.sql           # Database schema and sample data
├── public/
│   ├── css/
│   │   └── styles.css       # Compiled Tailwind CSS
│   ├── js/
│   │   └── app.js          # Frontend JavaScript
│   └── index.html          # Main HTML file
├── routes/
│   └── movies.js           # Movie API routes
├── src/
│   └── input.css           # Tailwind input file
├── .env.example            # Environment variables example
├── .gitignore             # Git ignore rules
├── DEPLOYMENT.md          # Deployment guide
├── package.json           # NPM dependencies and scripts
├── Procfile              # Heroku deployment file
├── render.yaml           # Render deployment config
├── server.js             # Main server file
├── tailwind.config.js    # Tailwind configuration
├── TURBOPACK_EXPLANATION.md # Turbopack documentation
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**K1NGS1LVER**
- GitHub: [@K1NGS1LVER](https://github.com/K1NGS1LVER)

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) for the web framework
- [MySQL](https://www.mysql.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [Node.js](https://nodejs.org/) for the runtime environment

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainers.

---

Made with ❤️ for the streaming startup community
