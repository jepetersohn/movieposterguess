import { useState } from "react";

export default function GuessInput({
  answerHash,
  onCorrect,
  onGuess,
  disabled,
  feedback,
  setFeedback,
  type, // "movie" or "actor"
}) {
  const [guess, setGuess] = useState("");

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

  function handleSubmit(e) {
    e.preventDefault();

    if (!guess.trim()) return;

    const guessHash = simpleHash(normalizeTitle(guess));
    const isCorrect = guessHash === answerHash;

    // Call parent to log the guess
    if (onGuess) {
      onGuess(guess, isCorrect);
    }

    if (isCorrect) {
      onCorrect();
      setFeedback("");
    } else {
      setFeedback("Sorry, try again!");
    }

    setGuess("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
      <input
        disabled={disabled}
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder={type === "actor" ? "Guess the actor…" : "Guess the movie…"}
        aria-label={type === "actor" ? "Actor guess input" : "Movie guess input"}
        autoComplete="off"
        style={{ flex: 1 }}
      />
      <button className="noirBtn" type="submit" disabled={disabled}>
        Guess
      </button>
    </form>
  );
}
