import { useEffect, useState } from 'react';
import Frame from './components/Frame/Frame';
import { getRandomPopularMovie } from './api/tmdb';

export default function Game() {
  const GRID_COLUMNS = 12;
  const GRID_ROWS = 18;

  const [movie, setMovie] = useState(null);
  const [squares, setSquares] = useState(
    Array(GRID_COLUMNS * GRID_ROWS).fill(true)
  );

  useEffect(() => {
    async function loadMovie() {
      const randomMovie = await getRandomPopularMovie();
      setMovie(randomMovie);
    }
    loadMovie();
  }, []);

  function handleReveal(index) {
    setSquares(prev =>
      prev.map((sq, i) => (i === index ? false : sq))
    );
  }

  if (!movie) return <div>Loading…</div>;

  const posterUrl = `https://image.tmdb.org/t/p/w400${movie.poster_path}`;

  return (
    <div className="theater">
     <Frame
  squares={squares}
  onReveal={handleReveal}
  posterPath={movie.poster_path}
  columns={GRID_COLUMNS}
/>
    </div>
  );
}


/*to do:
“reveal neighboring tiles” effect

timed auto-reveal

difficulty levels (larger/smaller tiles)

score / attempts counter

fade + scale animation
*/