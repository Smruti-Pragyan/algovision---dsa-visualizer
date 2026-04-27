import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Search, RefreshCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FenwickTreeStep {
  highlightedIndices: number[];
  action: string;
  bit: number[];
}

interface FenwickTreeVisualizerProps {
  algorithm: string;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

export default function FenwickTreeVisualizer({
  algorithm,
  speed = 50,
  isPaused = true,
  currentStep = 0,
  onStepChange,
}: FenwickTreeVisualizerProps) {
  const [data, setData] = useState<number[]>([1, 3, 5, 7, 9, 11]);
  const [bit, setBit] = useState<number[]>([]);
  const [steps, setSteps] = useState<FenwickTreeStep[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDelay = () => (101 - speed) * 10;

  useEffect(() => {
    if (!isPaused && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        onStepChange?.(currentStep + 1, steps.length - 1);
      }, getDelay());
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, currentStep, steps.length, speed, onStepChange]);

  const buildBIT = (arr: number[]) => {
    const n = arr.length;
    const newBit = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      updateBIT(newBit, i + 1, arr[i]);
    }
    return newBit;
  };

  const updateBIT = (tree: number[], i: number, delta: number) => {
    while (i < tree.length) {
      tree[i] += delta;
      i += i & -i;
    }
  };

  const generateQuerySteps = (index: number) => {
    const newSteps: FenwickTreeStep[] = [];
    const highlightedIndices: number[] = [];
    let i = index + 1;
    let sum = 0;

    newSteps.push({
      highlightedIndices: [],
      action: `Calculating prefix sum up to index ${index}...`,
      bit: [...bit],
    });

    while (i > 0) {
      highlightedIndices.push(i);
      sum += bit[i];
      newSteps.push({
        highlightedIndices: [...highlightedIndices],
        action: `Adding BIT[${i}] (${bit[i]}) to sum. Current sum: ${sum}`,
        bit: [...bit],
      });
      i -= i & -i;
    }

    newSteps.push({
      highlightedIndices: [...highlightedIndices],
      action: `Final prefix sum: ${sum}`,
      bit: [...bit],
    });

    setSteps(newSteps);
    onStepChange?.(0, newSteps.length - 1);
  };

  useEffect(() => {
    const newBit = buildBIT(data);
    setBit(newBit);
    setSteps([{ highlightedIndices: [], action: 'Ready', bit: newBit }]);
    onStepChange?.(0, 0);
  }, [data]);

  const currentStepData = steps[currentStep] || { highlightedIndices: [], action: 'Ready', bit: bit };

  const reset = () => {
    setData([1, 3, 5, 7, 9, 11]);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateQuerySteps(3)}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Query Sum [0, 3]</span>
          </button>
          <button
            onClick={() => setData(prev => [...prev, Math.floor(Math.random() * 20)])}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Element</span>
          </button>
        </div>
        <button
          onClick={reset}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 overflow-auto p-4">
        <div className="text-lg font-medium text-slate-600 dark:text-slate-400 h-8">
          {currentStepData.action}
        </div>

        <div className="flex flex-col gap-8 w-full max-w-4xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Original Array</h3>
            <div className="flex gap-2">
              {data.map((val, i) => (
                <div
                  key={i}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Fenwick Tree (BIT)</h3>
            <div className="flex gap-2">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-xl font-bold text-slate-400">
                0
              </div>
              {currentStepData.bit.slice(1).map((val, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-xl border-2 font-bold transition-all duration-300",
                    currentStepData.highlightedIndices.includes(i + 1)
                      ? "bg-indigo-500 border-indigo-600 text-white"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
