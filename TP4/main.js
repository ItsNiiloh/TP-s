const API_KEY = `7d70cc778e997f9629bab46abfff9b90`;
const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`;

async function searchMovies(query) {
    const searchURL = `${url}&query=${query}`;

    try {
        const response = await fetch(searchURL);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Il a eu un problème en chargeant les films:', error);
        return [];
    };
};


document.getElementById('search-button').addEventListener('click', async function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    const movies = await searchMovies(searchTerm);
    console.log(movies);
    displayMovies(movies);
});


function displayMovies(movies) {
    moviesList.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesList.appendChild(movieCard);
    });
};


function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('col');

    const cardContent = `
    <div class="card shadow-sm">
        <img class="bd-placeholder-img card-img-top" width="100%" height="450" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" role="img" aria-label="Placeholder: Thumbnail" class="card-img-top" alt="${movie.title}" preserveAspectRatio="xMidYMid slice" focusable="false">
        <div class="card-body">
            <h2 class="card-title fs-4">${movie.title}</h2>
            <p class="card-text">${movie.overview}</p>
        </div>
    </div>
    `;

    movieCard.innerHTML = cardContent;
    return movieCard;
};
