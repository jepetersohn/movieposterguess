import { useEffect, useState } from "react";
import Frame from "./components/Frame/Frame";
import GuessInput from "./components/Input/GuessInput";
import Drawer from "./components/Drawer/Drawer";
import TypeControls from "./components/TypeControls/TypeControls";
import DifficultyControls from "./components/DifficultyControls/DifficultyControls";
import { getRandomMovie, getRandomActor } from "./api/tmdb";

export default function Game() {
  const [difficulty, setDifficulty] = useState("hard");
  const [type, setType] = useState("movie");
  const [preferencesDrawer, setPreferencesDrawer] = useState(false);
  const [item, setItem] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [squares, setSquares] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [tileClicks, setTileClicks] = useState(0);
  const [guesses, setGuesses] = useState([]); // stores {text, correct}

  const loaders = {
    movie: getRandomMovie,
    actor: getRandomActor,
  };

  const gridSize = {
    easy: { columns: 10, rows: 12 },
    medium: { columns: 14, rows: 16 },
    hard: { columns: 17, rows: 19 },
  }[difficulty];

  const { columns: GRID_COLUMNS, rows: GRID_ROWS } = gridSize;

  // Initialize squares
  useEffect(() => {
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(true));
  }, [GRID_COLUMNS, GRID_ROWS]);

  // Normalize for hashing
  function normalizeTitle(title) {
    return title.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  }

  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  // Load movie or actor
  async function loadHiddenPicture() {
    const loader = loaders[type];
    if (!loader) return;

    const data = await loader();
    const displayTitle = data.title || data.name;
    const imagePath = data.poster_path || data.profile_path;
    const answerHash = simpleHash(normalizeTitle(displayTitle));

    setItem({
      ...data,
      displayTitle,
      imagePath,
      answerHash,
    });

    // Reset board state
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(true));
    setGameWon(false);
    setFeedback("");
    setTileClicks(0);
    setGaveUp(false);
    setGuesses([]);
  }

  const [rulesOpen, setRulesOpen] = useState(false);

  // Load on mount and when type changes
  useEffect(() => {
    loadHiddenPicture();
  }, [type]);

  // Handle tile reveal
  function handleReveal(index) {
    if (gameWon) return;

    setSquares((prev) =>
      prev.map((square, i) => (i === index ? false : square))
    );
    setTileClicks((prev) => prev + 1);
  }

  // Game actions
  function onCorrect() {
    setGameWon(true);
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(false));
    setFeedback("");
    setGaveUp(false);
  }

  function resetGameBoard() {
    loadHiddenPicture();
  }

  function revealAnswer() {
    if (!item) return;
    setGaveUp(true);
    setGameWon(true);
    setSquares(Array(GRID_COLUMNS * GRID_ROWS).fill(false));
    setFeedback("");
    // add correct answer to guesses if not already guessed
    if (!guesses.some((g) => g.text === item.displayTitle)) {
      setGuesses((prev) => [...prev, { text: item.displayTitle, correct: false }]);
    }
  }

  function onDifficultyChange(newDifficulty) {
    setDifficulty(newDifficulty);
  }

  function onTypeChange(newType) {
    setType(newType);
  }

  if (!item) return <div>Loading…</div>;

  const hiddenTileCount = squares.filter(Boolean).length;

  return (
    <>
      <header>Cinema Undercover</header>
      <main className="layout">
        <Drawer
          open={preferencesDrawer}
          onClose={() => setPreferencesDrawer(false)}
        >
          <DifficultyControls value={difficulty} onChange={onDifficultyChange} />
          <TypeControls value={type} onChange={onTypeChange} />
        </Drawer>

        <div className="sidebar">
          
          <div className="sideBySide">
         <section id="rules" aria-labelledby="rules-heading">
    <button
      className="noirBtn toggleRules"
      onClick={() => setRulesOpen(!rulesOpen)}
    >
      {rulesOpen ? "Hide Rules" : "Show Rules"}
    </button>
    {rulesOpen && (
      <div className="rulesBox">
        <h3 id="rules-heading">Quick Rules</h3>
        <ul>
          <li>
            <strong>Goal:</strong> Reveal the poster and guess the movie or actor.
          </li>
          <li>
            <strong>Reveal Tiles:</strong> Click squares to uncover the image. Each click counts!
          </li>
          <li>
            <strong>Make a Guess:</strong> Type your answer and hit <em>Guess</em>. Correct guesses turn green; wrong guesses turn red.
          </li>
          <li>
            <strong>Winning:</strong> Guess correctly before giving up. Your tile count shows how many squares you revealed.
          </li>
          <li>
            <strong>Giving Up:</strong> Click <em>Reveal Answer</em> to see the poster and answer.
          </li>
          <li>
            <strong>Track Guesses:</strong> All your guesses appear below in <em>Your Guesses</em>.
          </li>
        </ul>
      </div>
    )}
  </section>
          <section id="actions">
            <button className="noirBtn" onClick={() => setPreferencesDrawer(true)}>
              Game Preferences
            </button>
          </section>
</div>
          <section id="menu" aria-labelledby="scoreboard-heading">
            <h2 id="scoreboard-heading">Scoreboard</h2>
            Hidden Tiles: <span className="clickCount">{hiddenTileCount}</span>
          </section>

          <section id="guesses" aria-labelledby="guesses-heading">
            <h3 id="guesses-heading">Your Guesses</h3>
            {guesses.length === 0 ? (
              <p style={{ fontStyle: "italic", color: "#ccc" }}>No guesses yet</p>
            ) : (
              <ul>
                {guesses.map((g, idx) => {
                  let className = g.correct
                    ? "guess-correct"
                    : gaveUp && g.text === item.displayTitle
                    ? "guess-gaveup"
                    : "guess-incorrect";
                  
                  let correctStatus = g.correct
                    ? "Correct"
                    : gaveUp && g.text === item.displayTitle
                    ? "Gave Up"
                    : "Incorrect";

                  return (
                    <li key={idx} className={className}>
                      {g.text} - {correctStatus}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
         
        </div>

        <section className="theater" aria-label="Game board">
          <div className="top-buttons" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            {gameWon ? (
              <div className="win-message" role="status" aria-live="polite">
                {gaveUp ? (
                  <>
                    <strong>You gave up!</strong>
                    <div style={{ marginTop: "0.25rem" }}>
                      The {type === "actor" ? "actor" : "movie"} was:{" "}
                      <div className="itemTitle">{item.displayTitle}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <strong>
                      You guessed the {type === "actor" ? "actor" : "movie"}!
                    </strong>
                    <div style={{ marginTop: "0.25rem" }}>{item.displayTitle}</div>
                    <div style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
                      It took you {tileClicks} tile{tileClicks === 1 ? "" : "s"} to reveal.
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                role="alert"
                style={{
                  color: "#f5c542",
                  minHeight: "1.5em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {feedback}
              </div>
            )}

            <div className="controls-row">
              {!gameWon && (
                <GuessInput
                  disabled={gameWon}
                  answerHash={item.answerHash}
                  onCorrect={onCorrect}
                  onGuess={(text, isCorrect) => setGuesses((prev) => [...prev, { text, correct: isCorrect }])}
                  feedback={feedback}
                  setFeedback={setFeedback}
                  type={type}
                />
              )}

              <div className="secondRowAction" style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
                <button className="noirBtn newMovie" onClick={resetGameBoard}>
                  New {type === "actor" ? "Picture" : "Movie"}
                </button>
                {!gameWon && (
                  <button className="noirBtn revealAnswer" onClick={revealAnswer}>
                    Reveal Answer
                  </button>
                )}
              </div>
            </div>
          </div>

          <Frame
            squares={squares}
            onReveal={handleReveal}
            posterPath={item.imagePath}
            columns={GRID_COLUMNS}
            rows={GRID_ROWS}
          />
        </section>
      </main>
    </>
  );
}
