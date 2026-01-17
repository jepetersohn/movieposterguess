import { useEffect, useRef } from 'react';

function Frame({ squares, onReveal, posterPath, columns, rows }) {
  const canvasRef = useRef(null);
  const posterCanvasRef = useRef(null);

  const width = 400;
  const height = 600;

  useEffect(() => {
    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = width;
    posterCanvas.height = height;
    posterCanvasRef.current = posterCanvas;

    const posterContext = posterCanvas.getContext('2d');
    const gridContext = canvasRef.current.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://image.tmdb.org/t/p/w400${posterPath}`;
    img.alt = 'Hidden movie poster';

    img.onload = () => {
      posterContext.drawImage(img, 0, 0, width, height);

      const tileW = width / columns;
      const tileH = height / rows;

      gridContext.fillStyle = '#141414';
      gridContext.fillRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          gridContext.fillStyle =
            (r + c) % 2 === 0
              ? getComputedStyle(document.documentElement).getPropertyValue(
                  '--tile-dark'
                )
              : getComputedStyle(document.documentElement).getPropertyValue(
                  '--tile-light'
                );
          gridContext.fillRect(c * tileW, r * tileH, tileW, tileH);
          gridContext.strokeStyle = 'rgba(255,255,255,.12)';
          gridContext.lineWidth = 1;
          gridContext.strokeRect(c * tileW, r * tileH, tileW, tileH);
        }
      }
    };
  }, [posterPath, columns, rows]);

  useEffect(() => {
    const gridContext = canvasRef.current.getContext('2d');
    const posterCanvas = posterCanvasRef.current;
    if (!posterCanvas) return;

    const squareWidth = width / columns;
    const squareHeight = height / rows;

    squares.forEach((hidden, index) => {
      if (!hidden) {
        const row = Math.floor(index / columns);
        const col = index % columns;

        gridContext.drawImage(
          posterCanvas,
          col * squareWidth,
          row * squareHeight,
          squareWidth,
          squareHeight,
          col * squareWidth,
          row * squareHeight,
          squareWidth,
          squareHeight
        );
      }
    });
  }, [squares, columns, rows]);

  const tileW = width / columns;
  const tileH = height / rows;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="posterCanvas"
      />
     { squares.map((hidden, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    return (
        <button
            key={index}
            onClick={() => onReveal(index)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onReveal(index);
                }
            }}
            style={{
                position: 'absolute',
                top: row * tileH,
                left: col * tileW,
                width: tileW,
                height: tileH,
                opacity: 0,
                border: 'none',
                padding: 0,
                margin: 0,
                background: 'transparent',
                cursor: 'pointer',
            }}
            tabIndex={0}
            aria-label={`Tile ${row + 1}, ${col + 1}`}
            className="tileButton"
        />
    );
})}

    </div>
  );
}

export default Frame;
