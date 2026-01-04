import React from 'react';

export default function Square({ hidden, onClick }) {
  return (
    <button
      className={`square ${hidden ? '' : 'revealed'}`}
      onClick={onClick}
    />
  );
}
