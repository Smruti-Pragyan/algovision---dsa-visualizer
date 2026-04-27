import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

interface BacktrackingVisualizerProps {
  algorithm?: string;
  onComplete?: () => void;
  speed?: number;
  onStepChange?: (step: number, total: number) => void;
}

export default function BacktrackingVisualizer({ algorithm, onComplete, speed = 50, onStepChange }: BacktrackingVisualizerProps) {
  const [n, setN] = useState(4);
  const [board, setBoard] = useState<string[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const newBoard = Array.from({ length: n }, () => Array(n).fill('.'));
    setBoard(newBoard);
  }, [n]);

  const solveNQueens = async () => {
    if (isRunning) return;
    setIsRunning(true);
    isRunningRef.current = true;
    const currentBoard = Array.from({ length: n }, () => Array(n).fill('.'));
    setBoard(currentBoard);
    
    await backtrack(0, currentBoard);
    
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const backtrack = async (row: number, currentBoard: string[][]) => {
    if (!isRunningRef.current) return false;
    if (row === n) return true;

    for (let col = 0; col < n; col++) {
      if (!isRunningRef.current) return false;
      
      if (isSafe(row, col, currentBoard)) {
        currentBoard[row][col] = 'Q';
        setBoard([...currentBoard.map(r => [...r])]);
        await new Promise(r => setTimeout(r, 500));

        if (await backtrack(row + 1, currentBoard)) return true;

        currentBoard[row][col] = '.';
        setBoard([...currentBoard.map(r => [...r])]);
        await new Promise(r => setTimeout(r, 500));
      }
    }
    return false;
  };

  const isSafe = (row: number, col: number, currentBoard: string[][]) => {
    for (let i = 0; i < row; i++) {
      if (currentBoard[i][col] === 'Q') return false;
    }
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (currentBoard[i][j] === 'Q') return false;
    }
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
      if (currentBoard[i][j] === 'Q') return false;
    }
    return true;
  };

  const reset = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    const newBoard = Array.from({ length: n }, () => Array(n).fill('.'));
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Math.min(8, Math.max(4, parseInt(e.target.value) || 4)))}
            placeholder="N"
            className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={solveNQueens}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-blue-400"
          >
            <Play size={16} /> Solve N-Queens
          </button>
          <button
            onClick={reset}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
        <div 
          className="grid gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {board.map((row, rIdx) => (
            row.map((cell, cIdx) => (
              <motion.div
                key={`${rIdx}-${cIdx}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl shadow-inner transition-colors duration-300 ${
                  (rIdx + cIdx) % 2 === 0 
                    ? 'bg-white dark:bg-slate-700' 
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}
              >
                {cell === 'Q' && (
                  <motion.span
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-blue-600 drop-shadow-md"
                  >
                    👑
                  </motion.span>
                )}
              </motion.div>
            ))
          ))}
        </div>
      </div>
    </div>
  );
}
