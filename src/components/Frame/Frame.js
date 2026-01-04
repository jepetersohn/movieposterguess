import { useEffect, useRef } from 'react';

function Frame({ squares, onReveal, posterPath, columns }) {
  const canvasRef = useRef(null);
  const posterCanvasRef = useRef(null);

  const width = 400;
  const height = 600;
  const rows = Math.ceil(squares.length / columns);

  useEffect(() => {
    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = width;
    posterCanvas.height = height;
    posterCanvasRef.current = posterCanvas;

    const posterCtx = posterCanvas.getContext('2d');
    const ctx = canvasRef.current.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      posterCtx.drawImage(img, 0, 0, width, height);
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, width, height);

      const tileW = width / columns;
      const tileH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1a1a1a' : '#161616';
          ctx.fillRect(c * tileW, r * tileH, tileW, tileH);
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            c * tileW,
            r * tileH,
            tileW,
            tileH
          );
        }
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          ctx.strokeRect(
            c * tileW + 0.5,
            r * tileH + 0.5,
            tileW - 1,
            tileH - 1
          );
        }
      }

      img.src = '';
    };

    img.src = `https://image.tmdb.org/t/p/w400${posterPath}`;
  }, [posterPath]);


  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const posterCtx = posterCanvasRef.current.getContext('2d');

    const tileW = width / columns;
    const tileH = height / rows;

    squares.forEach((hidden, index) => {
      if (!hidden) {
        const row = Math.floor(index / columns);
        const col = index % columns;

        ctx.drawImage(
          posterCanvasRef.current,
          col * tileW,
          row * tileH,
          tileW,
          tileH,
          col * tileW,
          row * tileH,
          tileW,
          tileH
        );
      }
    });
  }, [squares]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="posterCanvas"
      onClick={(e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor((x / width) * columns);
        const row = Math.floor((y / height) * rows);
        const index = row * columns + col;

        onReveal(index);
      }}
    />
  );
}

export default Frame;
