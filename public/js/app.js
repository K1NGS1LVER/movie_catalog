// Movie Catalog Application
class MovieCatalogApp {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.isEditing = false;
        this.currentMovieId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMovies();
    }

    bindEvents() {
        // Add movie button
        document.getElementById('add-movie-btn').addEventListener('click', () => {
            this.openModal();
        });

        // Modal close buttons
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('movie-form').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Genre filter
        document.getElementById('genre-filter').addEventListener('change', (e) => {
            this.handleGenreFilter(e.target.value);
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadMovies();
        });

        // Close modal when clicking outside
        document.getElementById('movie-modal').addEventListener('click', (e) => {
            if (e.target.id === 'movie-modal') {
                this.closeModal();
            }
        });
    }

    async loadMovies() {
        try {
            this.showLoading();
            const response = await fetch('/api/movies');
            const result = await response.json();

            if (result.success) {
                this.movies = result.data;
                this.filteredMovies = [...this.movies];
                this.renderMovies();
            } else {
                this.showToast('Error loading movies: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error loading movies:', error);
            this.showToast('Failed to load movies. Please check your connection.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    renderMovies() {
        const container = document.getElementById('movies-container');
        const noMoviesDiv = document.getElementById('no-movies');

        if (this.filteredMovies.length === 0) {
            container.innerHTML = '';
            noMoviesDiv.classList.remove('hidden');
            return;
        }

        noMoviesDiv.classList.add('hidden');
        container.innerHTML = this.filteredMovies.map(movie => this.createMovieCard(movie)).join('');
    }

    createMovieCard(movie) {
        const rating = movie.rating ? `⭐ ${movie.rating}/10` : 'No rating';
        const year = movie.release_year;
        
        return `
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">${this.escapeHtml(movie.title)}</h3>
                        <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">${year}</span>
                    </div>
                    
                    <div class="mb-3">
                        <p class="text-gray-700 mb-1"><strong>Director:</strong> ${this.escapeHtml(movie.director)}</p>
                        <p class="text-gray-600 mb-2"><strong>Genre:</strong> 
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${this.escapeHtml(movie.genre)}</span>
                        </p>
                        <p class="text-gray-600">${rating}</p>
                    </div>
                    
                    <div class="flex gap-2 mt-4">
                        <button 
                            onclick="app.editMovie(${movie.id})" 
                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors"
                        >
                            ✏️ Edit
                        </button>
                        <button 
                            onclick="app.deleteMovie(${movie.id}, '${this.escapeHtml(movie.title).replace(/'/g, '\\\'')}')" 
                            class="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    openModal(movie = null) {
        const modal = document.getElementById('movie-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('movie-form');

        if (movie) {
            // Edit mode
            this.isEditing = true;
            this.currentMovieId = movie.id;
            title.textContent = 'Edit Movie';
            
            document.getElementById('movie-id').value = movie.id;
            document.getElementById('title').value = movie.title;
            document.getElementById('director').value = movie.director;
            document.getElementById('genre').value = movie.genre;
            document.getElementById('release_year').value = movie.release_year;
            document.getElementById('rating').value = movie.rating || '';
        } else {
            // Add mode
            this.isEditing = false;
            this.currentMovieId = null;
            title.textContent = 'Add New Movie';
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('movie-modal');
        modal.classList.add('hidden');
        document.getElementById('movie-form').reset();
        this.isEditing = false;
        this.currentMovieId = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value.trim(),
            director: document.getElementById('director').value.trim(),
            genre: document.getElementById('genre').value,
            release_year: parseInt(document.getElementById('release_year').value),
            rating: parseFloat(document.getElementById('rating').value) || null
        };

        try {
            const url = this.isEditing ? `/api/movies/${this.currentMovieId}` : '/api/movies';
            const method = this.isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showToast(result.message, 'success');
                this.closeModal();
                this.loadMovies();
            } else {
                this.showToast('Error: ' + (result.errors ? result.errors.join(', ') : result.message), 'error');
            }
        } catch (error) {
            console.error('Error saving movie:', error);
            this.showToast('Failed to save movie. Please try again.', 'error');
        }
    }

    async editMovie(id) {
        const movie = this.movies.find(m => m.id === id);
        if (movie) {
            this.openModal(movie);
        }
    }

    async deleteMovie(id, title) {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.showToast(result.message, 'success');
                this.loadMovies();
            } else {
                this.showToast('Error deleting movie: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            this.showToast('Failed to delete movie. Please try again.', 'error');
        }
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase();
        this.filteredMovies = this.movies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm)
        );
        this.applyGenreFilter();
        this.renderMovies();
    }

    handleGenreFilter(genre) {
        this.applyGenreFilter(genre);
        this.renderMovies();
    }

    applyGenreFilter(selectedGenre = null) {
        const genre = selectedGenre || document.getElementById('genre-filter').value;
        const searchQuery = document.getElementById('search-input').value.toLowerCase();

        this.filteredMovies = this.movies.filter(movie => {
            const matchesSearch = !searchQuery || 
                movie.title.toLowerCase().includes(searchQuery) ||
                movie.director.toLowerCase().includes(searchQuery) ||
                movie.genre.toLowerCase().includes(searchQuery);
            
            const matchesGenre = !genre || movie.genre === genre;
            
            return matchesSearch && matchesGenre;
        });
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('movies-container').classList.add('opacity-50');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('movies-container').classList.remove('opacity-50');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');
        const toastContainer = toast.firstElementChild;

        // Set message
        toastMessage.textContent = message;

        // Set icon and colors based on type
        if (type === 'error') {
            toastContainer.classList.remove('border-green-500');
            toastContainer.classList.add('border-red-500');
            toastIcon.classList.remove('text-green-400');
            toastIcon.classList.add('text-red-400');
            toastIcon.innerHTML = `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />`;
        } else {
            toastContainer.classList.remove('border-red-500');
            toastContainer.classList.add('border-green-500');
            toastIcon.classList.remove('text-red-400');
            toastIcon.classList.add('text-green-400');
            toastIcon.innerHTML = `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />`;
        }

        // Show toast
        toast.classList.remove('translate-y-full');
        toast.classList.add('translate-y-0');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-full');
            toast.classList.remove('translate-y-0');
        }, 3000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MovieCatalogApp();
});
