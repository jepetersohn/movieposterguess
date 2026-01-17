import { useEffect, useState } from 'react';
import Frame from './components/Frame/Frame';
import GuessInput from './components/Input/GuessInput';
import Drawer from './components/Drawer/Drawer';
import DifficultyControls from './components/DifficultyControls/DifficultyControls';
import { getRandomMovie } from './api/tmdb';

export default function Game() {
  const [difficulty, setDifficulty] = useState("hard");
  const [preferencesDrawer, setPreferencesDrawer] = useState(false);
  const [progressDrawer, setProgressDrawer] = useState(false);
  const [movie, setMovie] = useState(null);
  const [feedback, setFeedback] = useState(""); 

  const gridSize = {
    easy: { columns: 10, rows: 12 },
    medium: { columns: 14, rows: 16 },
    hard: { columns: 17, rows: 19 }
  }[difficulty];

  let { columns: GRID_COLUMNS, rows: GRID_ROWS } = gridSize;

  const [squares, setSquares] = useState(
    Array(GRID_COLUMNS * GRID_ROWS).fill(true)
  );

  const hiddenTiles = squares.filter(tile => tile === true);
  const hiddenTileCount = hiddenTiles.length;

  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(true));
  }, [GRID_COLUMNS, GRID_ROWS]);

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
      hash |= 0;
    }
    return hash;
  }

  async function loadMovie() {
    const randomMovie = await getRandomMovie();
    const normalizedTitle = normalizeTitle(randomMovie.title);
    const titleHash = simpleHash(normalizedTitle);
    setMovie({ ...randomMovie, answerHash: titleHash });
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

  function openPreferencesDrawer() {
    setPreferencesDrawer(true);
  }
  function openProgressDrawer() {
    setProgressDrawer(true);
  }

  function onCorrect() {
    setGameWon(true);
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(false));
    setFeedback("");
  }

  function resetGameBoard() {
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(true));
    setGameWon(false);
    setFeedback(""); // Clear feedback on reset
    loadMovie();
  }

  function onDifficultyChange(newDifficulty) {
    setDifficulty(newDifficulty);
  }

  useEffect(() => {
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(true));
  }, [difficulty, GRID_COLUMNS, GRID_ROWS]);

  if (!movie) return <div>Loading…</div>;

  return (
    <>
      <header>Cinema Undercover</header>
      <main className="layout">
        <Drawer open={preferencesDrawer} onClose={() => setPreferencesDrawer(false)}>
          <DifficultyControls value={difficulty} onChange={onDifficultyChange} />
        </Drawer>
        <Drawer open={progressDrawer} onClose={() => setProgressDrawer(false)}>
          <section id="coming-soon" aria-labelledby="coming-soon-heading">
            <h2 id="coming-soon-heading">A Work in Progress - Keep checking back!</h2>
            <p>
              This is the current project that I'm actively working on in my free time. 
              It started as a small tic-tac-toe game that I made using a tutorial to help me become more 
              familiar with React, and I've begun to evolve it into a poster-guessing game.
              <br /><br />
              It uses TMDB API to pull a random movie poster image, draws it to a canvas, 
              and then hides it behind a clickable grid.
              <br /><br />To still be added:
            </p>
            <ul>
              <li><s>Input for guesses.</s></li>
              <li><s>Left slide-out panel for input settings</s></li>
              <li>More extensive preference options (genre, actor, etc.)</li>
              <li>AI usage to recognize and blur out text on posters (for increased difficulty)</li>
              <li>Prettier UI</li>
            </ul>
          </section>
        </Drawer>
        <div className="sidebar">
          <section id="actions">
            <button className="noirBtn inProgress" onClick={openProgressDrawer}>
              This project is IN PROGRESS.<br /> Learn more.
            </button>
            <button className="noirBtn" onClick={openPreferencesDrawer}>Game Preferences</button><br />
          </section>
          <section id="menu" aria-labelledby="scoreboard-heading">
            <h2 id="scoreboard-heading">Scoreboard</h2>
            Hidden Tiles:
            <span className="clickCount">{hiddenTileCount}</span>
          </section>
        </div>
        <section className="theater" aria-label="Game board">
        <div
  className="top-buttons"
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem'
  }}
>
  {gameWon ? (
    <div className="win-message" role="status" aria-live="polite">
      You win!
    </div>
  ) : (
    <div
      role="alert"
      style={{
        color: "#f5c542",
        minHeight: "1.5em",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {feedback}
    </div>
  )}

  <div className="controls-row"
  >
    {!gameWon && (
      <GuessInput
        disabled={gameWon}
        answerHash={movie.answerHash}
        onCorrect={onCorrect}
        feedback={feedback}
        setFeedback={setFeedback}
      />
    )}

    <button className="noirBtn newMovie" onClick={resetGameBoard}>
      New Movie
    </button>
  </div>
</div>

          <Frame
            squares={squares}
            onReveal={handleReveal}
            posterPath={movie.poster_path}
            columns={GRID_COLUMNS}
            rows={GRID_ROWS}
          />
        </section>
      </main>
    </>
  );
}
