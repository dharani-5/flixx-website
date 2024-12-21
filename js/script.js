const global = {
    currentPage : window.location.pathname, 
    search : {
      term : "",
      type : "",
      page : 1,
      totalPages : 1,
    },
    api:{
      apiKey : '46bca1b393608188ebe87dc299beaac9',
      apiURL : 'https://api.themoviedb.org/3/'

    }

};

/* console.log(global.currentPage); */

//to display 20 popular movies 
async function displayPopularMovies(){
    const { results } = await fetchAPIData('movie/popular');
    results.forEach((movie) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
           ${
            movie.poster_path
             ? ` <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`

           }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>`;

          document.querySelector('#popular-movies').append(div);
    });
}


//to display popular TV shows
async function displayPopularShows(){
    const {results } = await fetchAPIData('tv/popular');

    results.forEach((show) => {
        const div = document.createElement('div')
        div.classList.add('card');
        div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
           ${
            show.poster_path
             ? ` <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />` : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`

           }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>`;

          document.querySelector('#popular-shows').appendChild(div);
    });

}

//Display Movie Details 
async function displayMovieDetails(){
    const movieId = window.location.search.split('=')[1];

    const movie = await fetchAPIData(`movie/${movieId}`);

    //overlay for background image

    displayBackgroundImage('movie' , movie.backdrop_path);

    const div = document.createElement('div')
    div.innerHTML = `<div class="details-top">
          <div>
            ${
            movie.poster_path
             ? ` <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.name}"
            />` : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
           }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <u><h5>Genres</h5></u>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span>$${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} ${'Minutes'}</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
        </div>
      </div>`;

      document.querySelector('#movie-details').appendChild(div);

    console.log(movieId);
}

//display show details

async function displayShowDetails(){
    const showId = window.location.search.split('=')[1];

    const show = await fetchAPIData(`tv/${showId}`);

    //overlay for background image

    displayBackgroundImage('tv' , show.backdrop_path);

    const div = document.createElement('div')
    div.innerHTML = `<div class="details-top">
          <div>
            ${
            show.poster_path
             ? ` <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />` : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
           }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <u><h5>Genres</h5></u>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes: </span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary"> Last Episode to Air: </span>${ show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
        </div>
      </div>`;

      document.querySelector('#show-details').appendChild(div);

    console.log(showId);
}

//display backdrop On Details pages
function displayBackgroundImage(type , backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if(type === 'movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

//search movies/shows

async function Search(){
  const queryString = window.location.search; //gives the search location
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null){
    //make request and display results
    const { results , total_pages,page} = await searchAPIData();

    /* global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results; */

    if(results.length === 0){
      showAlert('No results found');
      return;
    }
      displaySearchResults(results);

      document.querySelector('#search-term').value = '';

  }else{
    showAlert('Please enter a search term');
  }
}



function displaySearchResults(results){
  //clear previous result
  /* document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = ''; */

  results.forEach((result) => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
       ${
        result.poster_path
         ? ` <img
          src="https://image.tmdb.org/t/p/w500${result.poster_path}"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />` : ` <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />`

       }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>
      </div>`;

    document.querySelector('#search-results-heading').innerHTML = `
              <h2>${results.length} of ${global.search.totalResults}Results for ${global.search.term}</h2>
    
    `

      document.querySelector('#search-results').appendChild(div);
});

/* displayPagination(); */
}

//create & Display Pagination for Search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `<div class="pagination">
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

          document.querySelector('#pagination').appendChild(div);

  //Disable prev button if on firts page
  if(global.search.page === 1){
    document.querySelector('#prev').disabled = true;
  }
  //disable next button if it is on last page

  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled = true;
  }

  //next Page
  document.querySelector('#next').addEventListener('click' , async () => {
    global.search.page++;
    const { results , total_pages} = await searchAPIData();
    displaySearchResults(results);
  })

  //prev page
  document.querySelector('#prev').addEventListener('click' , async () => {
    global.search.page--;
    const { results , total_pages } = await searchAPIData();
    displaySearchResults(results);
  })

}

//Display Slider Movies
async function displaySlider(){
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div')
    div.classList.add('swiper-slide');

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div)

    initSwiper();

  }); 
}

function initSwiper(){
  const swiper = new Swiper('.swiper' , {
    slidesPerView : 1,
    spaceBetween : 30,
    freeMode : true,
    loop : true,
    autoplay : {
      delay : 2000,
      disableOnInteraction : false,
    },
    breakpoints: {
      500 : {
        slidesPerView : 2
      },
      700 : {
        slidesPerView : 3
      },
      1200 : {
        slidesPerView : 4
      },
    },
  });
}

//To fetch data from TMDB API
async function fetchAPIData(endpoint){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiURL;

    showSpinner();
    
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    hideSpinner();

    return data;
}

//make request to search

async function searchAPIData(){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiURL;

    showSpinner();
    
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`);

    const data = await response.json();

    hideSpinner();

    return data;
}

function showSpinner(){
    const spinner = document.querySelector('.spinner');
    spinner.classList.add('show');
}

function hideSpinner(){
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('show');
}

//Highlight active link
function HighlightActiveLink(){
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage){
            link.classList.add('active');
        }
    });
}

//show Alert

function showAlert(message , className){
  const alertEl = document.createElement('div')
  alertEl.classList.add('alert' , className)
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl)

  setTimeout(() => alertEl.remove() , 3000);
}

function addCommasToNumber(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//init App to know in which page we are on

function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html' :
            console.log('Home');
            displaySlider();
            displayPopularMovies();
            
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            Search();
            break;
    }
    HighlightActiveLink();
}

document.addEventListener('DOMContentLoaded' , init)
