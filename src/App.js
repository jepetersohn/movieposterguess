import { useEffect, useState } from 'react';
import Frame from './components/Frame/Frame';
import GuessInput from './components/Input/GuessInput';
import { getRandomPopularMovie } from './api/tmdb';

export default function Game() {
  const GRID_COLUMNS = 12;
  const GRID_ROWS = 18;

  const [movie, setMovie] = useState(null);
  const [squares, setSquares] = useState(
    Array(GRID_COLUMNS * GRID_ROWS).fill(true)
  );

  const hiddenTiles = squares.filter(tile => tile === true);
  const hiddenTileCount = hiddenTiles.length;

  const [gameWon, setGameWon] = useState(false);

  function normalizeTitle(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim();
  }

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // convert to 32-bit int
    }
    return hash;
  }

   async function loadMovie() {
      const randomMovie = await getRandomPopularMovie();
      const normalizedTitle = normalizeTitle(randomMovie.title);
      const titleHash = simpleHash(normalizedTitle);
      setMovie({...randomMovie, answerHash: titleHash});
    }

  useEffect(() => {
   
    loadMovie();
  }, []);

  function handleReveal(index) {
    if (gameWon) return;

    setSquares(aPrevSquares =>
      aPrevSquares.map((oSquare, i) => (i === index ? false : oSquare))
    );
  }

  function onCorrect() {
    setGameWon(true);
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(false));
  }

  function resetGameBoard() {
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(true));
    setGameWon(false);
    loadMovie();
  }

  if (!movie) return <div>Loading…</div>;

  return (
    <>
    <header>Cinema Undercover</header>
    <main className="layout">
      <div className="sidebar">
        <section id="menu" aria-labelledby="scoreboard-heading">
          <h2 id="scoreboard-heading">Scoreboard</h2>
            Hidden Tiles:
            <span className="clickCount">{hiddenTileCount}</span>
        </section>
        <section id="coming-soon" aria-labelledby="coming-soon-heading">
          <h2 id="coming-soon-heading">A Work in Progress - Keep checking back!</h2>
          <p>
            This is the current project that I'm actively working on in my free time. 
            It started as a small tic-tac-toe game that I made using a tutorial to help me become more 
            familiar with React, and I've begun to evolve it into a poster-guessing game.
            <br/><br />
            It uses TMDB API to pull a random movie poster image, draws it to a canvas, 
            and then hides it behind a clickable grid.
            <br/><br/>To still be added:
          </p>
          <ul>
            <li><s>Input for guesses.</s></li>
            <li>Left slide-out panel for input settings (difficulty, genre request, etc.)</li>
            <li>Leaderboard</li>
            <li>AI usage to recognize and blur out text on posters (for increased difficulty)</li>
            <li>Accessibility updates (keyboard navigation/playability, etc.)</li>
            <li>Prettier UI</li>
          </ul>
        </section>
      </div>
      <section className="theater" aria-label="Game board">
        <div className="top-buttons">
          {gameWon ? (
            <div className="win-message" role="status" aria-live="polite">
              You win!
            </div>
            ) : (
            <GuessInput
              disabled={gameWon}
              answerHash={movie.answerHash}
              onCorrect={onCorrect}
            />
          )}
          <button onClick={resetGameBoard}>New Movie</button>
        </div>
        <Frame
          squares={squares}
          onReveal={handleReveal}
          posterPath={movie.poster_path}
          columns={GRID_COLUMNS}
        />
        
      </section>
    </main>
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