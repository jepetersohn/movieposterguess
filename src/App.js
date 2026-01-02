import { useEffect, useState } from 'react';
import Frame from './components/Frame/Frame';
import { getRandomPopularMovie } from './api/tmdb';

export default function Game() {
  const [movie, setMovie] = useState(null);
  const [squares, setSquares] = useState(Array(9).fill(false));

  useEffect(() => {
    async function loadMovie() {
      const randomMovie = await getRandomPopularMovie();
      setMovie(randomMovie);
    }
    loadMovie();
  }, []);

  function handleReveal(index) {
    const next = squares.slice();
    next[index] = true;
    setSquares(next);
  }

  if (!movie) return <div>Loading…</div>;

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Frame
      squares={squares}
      onReveal={handleReveal}
      posterUrl={posterUrl}
    />
  );
}