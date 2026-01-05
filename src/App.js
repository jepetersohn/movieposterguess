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
  /*const [revealedCount, setrevealedCount] = useState(0);*/
  const hiddenTiles = squares.filter(tile => tile === true);
  const hiddenTileCount = hiddenTiles.length;

  useEffect(() => {
    async function loadMovie() {
      const randomMovie = await getRandomPopularMovie();
      setMovie(randomMovie);
    }
    loadMovie();
  }, []);

  function handleReveal(index) {
    setSquares(aPrevSquares =>
      aPrevSquares.map((oSquare, i) => (i === index ? false : oSquare))
    );
    /*setClickCount(iPrevClickCount => iPrevClickCount + 1);*/
  }

  if (!movie) return <div>Loading…</div>;

  /*const posterUrl = `https://image.tmdb.org/t/p/w400${movie.poster_path}`;*/

  return (
    <>
    <header>Cinema Undercover</header>
    <div className="layout">
      <div id="menu">
        Scoreboard
        <h1>
          Hidden Tiles: <span className="clickCount">{hiddenTileCount}</span>
        </h1>
      </div>

      <div className="theater">
        <Frame
          squares={squares}
          onReveal={handleReveal}
          posterPath={movie.poster_path}
          columns={GRID_COLUMNS}
        />
      </div>
    </div>
  </>
  );
}


/*to do:
“reveal neighboring tiles” effect

timed auto-reveal

difficulty levels (larger/smaller tiles)

score / attempts counter

fade + scale animation
*/