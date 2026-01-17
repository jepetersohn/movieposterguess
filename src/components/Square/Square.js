import React from 'react';

export default function Square({ hidden, onClick }) {
  return (
    <button
      className={`square ${hidden ? '' : 'revealed'}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={!hidden}
      aria-label={hidden ? 'Hidden tile' : 'Revealed tile'}
    />
  );
}

