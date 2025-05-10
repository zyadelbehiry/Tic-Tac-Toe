"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Square = "X" | "O" | null;
type Board = Square[];

export default function Home() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsComputer, setVsComputer] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [computerThinking, setComputerThinking] = useState(false);

  const calculateWinner = (squares: Board): Square => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const getComputerMove = (currentBoard: Board): number => {
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = "O";
        if (calculateWinner(testBoard) === "O") {
          return i;
        }
      }
    }

    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const testBoard = [...currentBoard];
        testBoard[i] = "X";
        if (calculateWinner(testBoard) === "X") {
          return i;
        }
      }
    }

    if (!currentBoard[4]) return 4;

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((i) => !currentBoard[i]);
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter((i) => !currentBoard[i]);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1;
  };

  const handleClick = (i: number): void => {
    // Prevent clicks if the computer is thinking or if the square is already filled
    if (calculateWinner(board) || board[i] || (vsComputer && !isXNext) || computerThinking) return;

    const newBoard = board.slice();
    newBoard[i] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const winner = calculateWinner(newBoard);
    const isDraw = newBoard.every((square) => square);

    if (winner || isDraw) {
      setTimeout(() => setShowPopup(true), 500);
    }

    if (vsComputer) {
      if (!winner && !isDraw) {
        setIsXNext(false);
        setComputerThinking(true); // Set computer thinking state to true
        setTimeout(() => {
          const computerMove = getComputerMove(newBoard);
          if (computerMove !== -1) {
            const afterComputerBoard = [...newBoard];
            afterComputerBoard[computerMove] = "O";
            setBoard(afterComputerBoard);
            setIsXNext(true);

            const computerWins = calculateWinner(afterComputerBoard);
            const isDrawAfterComputer = afterComputerBoard.every(
              (square) => square
            );
            if (computerWins || isDrawAfterComputer) {
              setTimeout(() => setShowPopup(true), 500);
            }
          }
          setComputerThinking(false); // Set computer thinking state back to false
        }, 500);
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : board.every((square) => square)
    ? "Game is a draw!"
    : computerThinking
    ? "Computer is thinking..."
    : `Next player: ${isXNext ? "X" : "O"}`;

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setShowPopup(false);
    setComputerThinking(false);
  };

  const toggleGameMode = () => {
    setVsComputer(!vsComputer);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto px-4 py-20 sm:px-6"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            Tic Tac Toe
          </motion.h1>
          <motion.div
            className="text-xl text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {status}
          </motion.div>
          <motion.button
            onClick={toggleGameMode}
            className="mb-4 bg-white/10 px-4 py-2 rounded-md hover:bg-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {vsComputer ? "Playing vs Computer" : "Playing vs Human"}
          </motion.button>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {board.map((square, i) => (
            <motion.button
              key={i}
              onClick={() => handleClick(i)}
              className={`bg-white/5 backdrop-blur-lg h-24 text-4xl font-bold rounded-lg transition-all ${
                vsComputer && !isXNext || computerThinking ? "cursor-not-allowed opacity-80" : "hover:bg-white/10"
              }`}
              whileHover={{
                scale: vsComputer && !isXNext || computerThinking ? 1 : 1.05,
                backgroundColor: vsComputer && !isXNext || computerThinking ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: vsComputer && !isXNext || computerThinking ? 1 : 0.95 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: square ? 1 : 0 }}
                transition={{ type: "spring", damping: 8 }}
              >
                {square}
              </motion.span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Game
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={resetGame}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl text-center"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <h2 className="text-3xl font-bold mb-4">
                  {winner
                    ? `🎉 Player ${winner} Wins! 🎉`
                    : "🤝 It's a Draw! 🤝"}
                </h2>
                <p className="text-lg mb-4">Click anywhere to play again</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
