const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

function getRandomPage(max = 10) {
  return Math.floor(Math.random() * max) + 1;
}

async function fetchFromTMDB(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);

  if (!response.ok) {
    throw new Error('TMDB request failed');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No results from TMDB');
  }

  return data.results;
}

export async function getRandomMovie() {
  const page = getRandomPage();

  const results = await fetchFromTMDB(
    `/discover/movie?region=US&language=en-US&include_adult=false&with_original_language=en&page=${page}`
  );

  return results[Math.floor(Math.random() * results.length)];
}

export async function getRandomActor() {
  const page = getRandomPage();

  const results = await fetchFromTMDB(
    `/person/popular?language=en-US&page=${page}`
  );

  return results[Math.floor(Math.random() * results.length)];
}