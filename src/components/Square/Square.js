import React from 'react';

export default function Square({ revealed, onClick, index, posterUrl }) {
  const row = Math.floor(index / 3);
  const col = index % 3;

  return (
    <button className="square" onClick={onClick}>
      {revealed && (
        <div
          className="image-tile"
          style={{
            backgroundImage: `url(${posterUrl})`,
            backgroundSize: '300% 300%',
            backgroundPosition: `${-col * 100}% ${-row * 100}%`,
          }}
        />
      )}
    </button>
  );
}