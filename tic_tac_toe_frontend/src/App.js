import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Minimalistic, light-themed Tic Tac Toe game with:
 * - Interactive board
 * - Two player mode
 * - Current player indicator
 * - Game result detection (win/draw)
 * - Restart functionality
 */

/**
 * Color Palette (matches work item and CSS var suggestions)
 * primary:   #1976d2
 * secondary: #424242
 * accent:    #ffca28
 * background: #ffffff (already from App.css)
 */

// Helper: checks if a player has won
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Determines the winner of the board (if any). Returns "X", "O", or null. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// Stateless cell/button component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      style={highlight ? { background: "var(--accent)" } : {}}
      onClick={onClick}
      tabIndex={value ? -1 : 0}
      aria-label={value ? value : "empty cell"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * This function renders the minimal Tic Tac Toe game according to requirements.
   * Game state:
   *   - board: 9 squares
   *   - xIsNext: bool
   *   - status: "playing", "draw", "winner"
   *   - winner: if any
   */
  // State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState("playing"); // "playing", "draw", "winner"

  // Derived: who won, or draw?
  useEffect(() => {
    const w = calculateWinner(squares);
    if (w) {
      setWinner(w);
      setStatus("winner");
    } else if (squares.every(Boolean)) {
      setStatus("draw");
    } else {
      setStatus("playing");
    }
  }, [squares]);

  // Handle click (if square empty and no winner)
  const handleSquareClick = (i) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  };

  // Restart the game
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setStatus("playing");
  };

  // Render board cells
  function renderSquare(i) {
    return (
      <Square
        value={squares[i]}
        onClick={() => handleSquareClick(i)}
        highlight={winner && calculateWinnerHighlight(squares, i)}
        key={i}
      />
    );
  }

  // Find which squares form the winning line
  function calculateWinnerHighlight(squares, idx) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let line of lines) {
      if (
        squares[line[0]] &&
        squares[line[0]] === squares[line[1]] &&
        squares[line[0]] === squares[line[2]] &&
        line.includes(idx)
      ) {
        return true;
      }
    }
    return false;
  }

  // Text for current state
  let info, playerColor;
  if (status === "winner") {
    info = (
      <span>
        <span style={{ color: winner === "X" ? "#1976d2" : "#424242", fontWeight: 700 }}>
          Player {winner}
        </span>{" "}
        wins!
      </span>
    );
  } else if (status === "draw") {
    info = <span>It's a draw!</span>;
  } else {
    playerColor = xIsNext ? "#1976d2" : "#424242";
    info = (
      <>
        Current player:{" "}
        <span style={{ color: playerColor, fontWeight: 700 }}>
          {xIsNext ? "X" : "O"}
        </span>
      </>
    );
  }

  return (
    <div className="App" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div
        className="ttt-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
        }}
      >
        {/* Title */}
        <h1 style={{
          color: "var(--text-primary)",
          marginBottom: "0.5rem",
          fontWeight: 700,
          fontSize: "2rem",
        }}>
          Tic Tac Toe
        </h1>
        {/* Status / player info */}
        <div
          style={{
            marginBottom: "1.25rem",
            fontSize: "1.2rem",
            minHeight: "1.5em",
            color: "var(--text-secondary)",
          }}
          data-testid="status"
        >
          {info}
        </div>

        {/* Board */}
        <div
          className="ttt-board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 64px)",
            gridTemplateRows: "repeat(3, 64px)",
            gap: "8px",
            background: "var(--bg-secondary, #f8f9fa)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 2px 8px rgba(20,20,40,0.07)",
            marginBottom: "1rem",
          }}
          tabIndex={0}
        >
          {Array(9)
            .fill(null)
            .map((_, idx) => renderSquare(idx))}
        </div>

        {/* Restart button */}
        <button
          className="ttt-restart"
          onClick={handleRestart}
          style={{
            background: "#ffca28",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.6em 1.7em",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "background 0.13s, color 0.13s",
            marginTop: 10,
            minWidth: 110,
            boxShadow: "0 1.5px 8px rgba(0,0,0,0.07)",
          }}
          aria-label="Restart game"
        >
          Restart
        </button>
      </div>
      {/* Style overrides for the board cells */}
      <style>
        {`
        .ttt-square {
          width: 64px;
          height: 64px;
          background: #fff;
          color: #1976d2;
          border: 2px solid var(--border-color, #e9ecef);
          border-radius: 12px;
          font-size: 2rem;
          font-weight: 700;
          box-shadow: 0 1.5px 6px #e9ecef55;
          cursor: pointer;
          user-select: none;
          outline: none;
          transition: background 0.17s, color 0.17s, border 0.13s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ttt-square:focus {
          border-color: #ffca28;
        }
        .ttt-square[aria-label="O"] {
          color: #424242;
        }
        .ttt-square[aria-label="empty cell"]:hover {
          background: #f8f9fa;
        }
        .ttt-square[aria-label="empty cell"]:active {
          background: #e9ecef;
        }
        `}
      </style>
    </div>
  );
}

export default App;
