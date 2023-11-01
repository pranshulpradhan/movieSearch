const searchInput = document.getElementById("searchInput");
const moviesCards =document.getElementById("movies");
const paginationPart = document.getElementById("pagination");

const apiUrl = "https://www.omdbapi.com/";
const API_KEY = "4dbe716f";

let currentPage = 1;
let totalPage = 0;
let debounceTimer;

searchInput.addEventListener("input",() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchMovies, 500);
})

const getData = async(searchTerm,page) => {
    console.log("searchTerm", searchTerm);
    console.log("page", page);
    const response = await fetch(`${apiUrl}?&apikey=${API_KEY}&s=${searchTerm}&page=${page}`);
    console.log("response", response);
    const data = await response.json();
    console.log("getData",data);
    return data;
}

const displayMovies = async movieDetails => {
    moviesCards.innerHTML='';
    console.log("display",movieDetails);
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    await movieDetails.Search.forEach(movie => {
        console.log("movie",movie);
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-details');
        movieCard.innerHTML=`
        <img src="${movie.Poster?movie.Poster:"https://www.shutterstock.com/shutterstock/photos/586719869/display_1500/stock-vector-online-cinema-art-movie-watching-with-popcorn-and-film-strip-cinematograph-concept-vintage-retro-586719869.jpg"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
        `;
        movieContainer.appendChild(movieCard);
        moviesCards.appendChild(movieContainer);
    });
    return;
}

const displayPagination = () => {
    const totalPages = Math.ceil(totalPage / 10);
    console.log("totalPages",totalPages);
    paginationPart.innerHTML=`
    <button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Next</button>
    `;
}

const goToPage = (page) => {
    console.log("goto",totalPage);
    if (page >= 1 && page <= Math.ceil(totalPage / 10)) {
      currentPage = page;
      console.log("gotoPage",currentPage);
      searchMovies();
    }
  };

const searchMovies = async () => {
    const searchTerm = searchInput.value;
    const movieDetails = await getData(searchTerm,currentPage);
    console.log("searchMovies data", movieDetails);

    if (movieDetails.Response === 'False') {
        if (movieDetails.Error === 'Too many results.') {
            moviesCards.innerHTML = '<p>Too many results. Please provide a more specific search term.</p>';
            paginationPart.innerHTML = '';
        } else {
            moviesCards.innerHTML = `<p>Error: ${movieDetails.Error}</p>`;
            paginationPart.innerHTML = '';
        }
        return;
      }

    totalPage = parseInt(movieDetails.totalResults);
    console.log("totalPages searchMovies", totalPage);
    displayMovies(movieDetails);
    displayPagination();
}
