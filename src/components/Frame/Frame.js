import React from 'react';
import Square from '../Square/Square.js'
import calculateWinner from '../../utils/calculateWinner';

function Frame({ xIsNext, squares, onPlay, posterUrl }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square revealed={squares[0]} onClick={() => onReveal(0)} index={0} posterUrl={posterUrl}/>
        <Square revealed={squares[1]} onClick={() => onReveal(1)} index={1} posterUrl={posterUrl}/>
        <Square revealed={squares[2]} onClick={() => onReveal(2)} index={2} posterUrl={posterUrl}/>
      </div>
      <div className="board-row">
        <Square revealed={squares[3]} onClick={() => onReveal(3)} index={3} posterUrl={posterUrl}/>
        <Square revealed={squares[4]} onClick={() => onReveal(4)} index={4} posterUrl={posterUrl}/>
        <Square revealed={squares[5]} onClick={() => onReveal(5)} index={5} posterUrl={posterUrl}/>
      </div>
      <div className="board-row">
        <Square revealed={squares[6]} onClick={() => onReveal(6)} index={6} posterUrl={posterUrl}/>
        <Square revealed={squares[7]} onClick={() => onReveal(7)} index={7} posterUrl={posterUrl}/>
        <Square revealed={squares[8]} onClick={() => onReveal(8)} index={8} posterUrl={posterUrl}/>
      </div>
    </>
  );
}

export default Frame;