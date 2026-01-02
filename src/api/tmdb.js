const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getRandomPopularMovie() {
  const page = Math.floor(Math.random() * 10) + 1;

  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );

  const data = await response.json();
  const movies = data.results;

  return movies[Math.floor(Math.random() * movies.length)];
}