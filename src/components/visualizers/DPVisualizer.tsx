import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

interface DPVisualizerProps {
  algorithm?: string;
  onComplete?: () => void;
  speed?: number;
  onStepChange?: (step: number, total: number) => void;
}

export default function DPVisualizer({ algorithm, onComplete, speed = 50, onStepChange }: DPVisualizerProps) {
  const [n, setN] = useState(10);
  const [memo, setMemo] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const startFib = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const newMemo = Array(n + 1).fill(0);
    setMemo(newMemo);
    
    newMemo[0] = 0;
    setCurrentIndex(0);
    setMemo([...newMemo]);
    await new Promise(r => setTimeout(r, 500));
    
    if (n > 0) {
      newMemo[1] = 1;
      setCurrentIndex(1);
      setMemo([...newMemo]);
      await new Promise(r => setTimeout(r, 500));
    }

    for (let i = 2; i <= n; i++) {
      setCurrentIndex(i);
      newMemo[i] = newMemo[i - 1] + newMemo[i - 2];
      setMemo([...newMemo]);
      await new Promise(r => setTimeout(r, 500));
    }
    
    setIsRunning(false);
    setCurrentIndex(-1);
  };

  const reset = () => {
    setMemo([]);
    setIsRunning(false);
    setCurrentIndex(-1);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            placeholder="N"
            className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <button
            onClick={startFib}
            disabled={isRunning}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={16} /> Start Fibonacci
          </button>
          <button
            onClick={reset}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-wrap gap-4 items-center justify-center p-8 min-h-[300px]">
        <AnimatePresence>
          {memo.map((val, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                borderColor: i === currentIndex ? '#636b2f' : '#e2e8f0',
                backgroundColor: i === currentIndex ? '#d4de9520' : 'white'
              }}
              layout
              className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg dark:bg-slate-800 dark:border-slate-700 ${i === currentIndex ? 'dark:bg-brand-primary/20 dark:border-brand-primary' : ''}`}
            >
              <span className="text-xs font-mono text-slate-400 mb-1">F({i})</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{val}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {memo.length === 0 && (
          <div className="text-slate-400 italic">Enter N and click "Start" to visualize Fibonacci with DP!</div>
        )}
      </div>
    </div>
  );
}
