import { useState } from "react";

export default function GuessInput({ answerHash, onCorrect, disabled, feedback, setFeedback }) {
  const [guess, setGuess] = useState("");

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

  function handleSubmit(e) {
    e.preventDefault();

    const guessHash = simpleHash(normalizeTitle(guess));

    if (guessHash === answerHash) {
      onCorrect();
      setFeedback(""); // clear feedback on success
    } else {
      setFeedback("Sorry, try again!"); // show feedback on failure
    }

    setGuess("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={disabled}
        type="text"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Guess the movie…"
        aria-label="Movie guess input"
        autoComplete="off"
      />
      <button className="noirBtn" type="submit" disabled={disabled}>
        Guess
      </button>
    </form>
  );
}
