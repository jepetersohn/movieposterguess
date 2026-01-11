import { useState } from "react";

export default function GuessInput({ answerHash, onCorrect }) {
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
    } else {
      alert("Try again!");
    }

    setGuess("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="Guess the movie…"
      />
      <button type="submit">Guess</button>
    </form>
  );
}
