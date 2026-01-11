import { useEffect, useRef } from 'react';

function Frame({ squares, onReveal, posterPath, columns }) {
  const canvasRef = useRef(null);
  const posterCanvasRef = useRef(null);

  const width = 400;
  const height = 600;
  const rows = Math.ceil(squares.length / columns);

  // const LETTER_NUMBER_REGEX = /[A-Za-z0-9]/;

  useEffect(() => {
    // const Tesseract = window.Tesseract;

    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = width;
    posterCanvas.height = height;
    posterCanvasRef.current = posterCanvas;

    const posterContext = posterCanvas.getContext('2d');
    const gridContext = canvasRef.current.getContext('2d');

    // Load poster image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://image.tmdb.org/t/p/w400${posterPath}`;
    img.alt = "Hidden movie poster";

    img.onload = async () => {
      posterContext.drawImage(img, 0, 0, width, height);

      /*
      //tesseract debugging

      try {
        const { data: { words } } = await Tesseract.recognize(img, 'eng', {
          logger: (m) => console.log('OCR Progress:', m),
        });

        words.forEach((word, idx) => {
          const x0 = word.bbox?.x0 || 0;
          const y0 = word.bbox?.y0 || 0;
          const x1 = word.bbox?.x1 || 0;
          const y1 = word.bbox?.y1 || 0;

          const startX = Math.floor(x0);
          const startY = Math.floor(y0);
          const boxWidth = Math.max(Math.floor(x1 - x0), 1);
          const boxHeight = Math.max(Math.floor(y1 - y0), 1);

          if (isNaN(startX) || isNaN(startY)) return;

          const text = word.text || '';
          const conf = word.conf || 0;
          const containsLetterNumber = LETTER_NUMBER_REGEX.test(text);
          const shouldSkip = conf < 60 || !containsLetterNumber;

          if (!shouldSkip) {
            const sample = posterContext.getImageData(
              Math.max(startX - 1, 0),
              Math.max(startY - 1, 0),
              1,
              1
            ).data;

            posterContext.fillStyle = `rgb(${sample[0]}, ${sample[1]}, ${sample[2]})`;
            posterContext.fillRect(startX, startY, boxWidth, boxHeight);

            // Debug boxes
            gridContext.strokeStyle = 'red';
            gridContext.lineWidth = 2;
            gridContext.strokeRect(startX, startY, boxWidth, boxHeight);
          }
        });
      } catch (err) {
        console.error('OCR failed', err);
      }
      */

      const tileW = width / columns;
      const tileH = height / rows;

      gridContext.fillStyle = '#141414';
      gridContext.fillRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          gridContext.fillStyle = (r + c) % 2 === 0
            ? getComputedStyle(document.documentElement)
            .getPropertyValue('--tile-dark')
          : getComputedStyle(document.documentElement)
            .getPropertyValue('--tile-light');
          gridContext.fillRect(c * tileW, r * tileH, tileW, tileH);
          gridContext.strokeStyle = 'rgba(255,255,255,.12)';
          gridContext.lineWidth = 1;
          gridContext.strokeRect(c * tileW, r * tileH, tileW, tileH);
        }
      }

      gridContext.strokeStyle = 'rgba(255,255,255,0.06)';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          gridContext.strokeRect(
            c * tileW + 0.5,
            r * tileH + 0.5,
            tileW - 1,
            tileH - 1
          );
        }
      }
    };
  }, [posterPath]);

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
