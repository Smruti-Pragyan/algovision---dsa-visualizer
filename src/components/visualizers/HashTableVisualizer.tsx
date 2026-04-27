import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Search, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HashTableStep {
  table: (string | null)[][];
  highlightedIndex: number | null;
  highlightedBucketIndex: number | null;
  action: string;
  found: boolean | null;
}

interface HashTableVisualizerProps {
  algorithm: string;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

export default function HashTableVisualizer({
  algorithm,
  speed = 50,
  isPaused = true,
  currentStep = 0,
  onStepChange,
}: HashTableVisualizerProps) {
  const [size] = useState(7);
  const [table, setTable] = useState<(string | null)[][]>(Array.from({ length: 7 }, () => []));
  const [steps, setSteps] = useState<HashTableStep[]>([]);
  const [inputValue, setInputValue] = useState('');
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

  const hash = (key: string) => {
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      h += key.charCodeAt(i);
    }
    return h % size;
  };

  const generateInsertSteps = (val: string) => {
    if (!val) return;
    const index = hash(val);
    const newSteps: HashTableStep[] = [];
    const currentTable = table.map(row => [...row]);

    // Step 1: Highlight the index
    newSteps.push({
      table: currentTable.map(row => [...row]),
      highlightedIndex: index,
      highlightedBucketIndex: null,
      action: `Hashing "${val}"... Index: ${index}`,
      found: null,
    });

    // Step 2: Insert into bucket
    if (!currentTable[index].includes(val)) {
      currentTable[index].push(val);
    }
    newSteps.push({
      table: currentTable.map(row => [...row]),
      highlightedIndex: index,
      highlightedBucketIndex: currentTable[index].length - 1,
      action: `Inserted "${val}" at index ${index}`,
      found: null,
    });

    setSteps(newSteps);
    setTable(currentTable);
    onStepChange?.(0, newSteps.length - 1);
  };

  const generateSearchSteps = (val: string) => {
    if (!val) return;
    const index = hash(val);
    const newSteps: HashTableStep[] = [];
    const currentTable = table.map(row => [...row]);

    // Step 1: Highlight the index
    newSteps.push({
      table: currentTable.map(row => [...row]),
      highlightedIndex: index,
      highlightedBucketIndex: null,
      action: `Searching for "${val}"... Hashing to index ${index}`,
      found: null,
    });

    // Step 2: Search in bucket
    let found = false;
    for (let i = 0; i < currentTable[index].length; i++) {
      newSteps.push({
        table: currentTable.map(row => [...row]),
        highlightedIndex: index,
        highlightedBucketIndex: i,
        action: `Checking bucket at index ${index}, position ${i}...`,
        found: null,
      });
      if (currentTable[index][i] === val) {
        found = true;
        newSteps.push({
          table: currentTable.map(row => [...row]),
          highlightedIndex: index,
          highlightedBucketIndex: i,
          action: `Found "${val}"!`,
          found: true,
        });
        break;
      }
    }

    if (!found) {
      newSteps.push({
        table: currentTable.map(row => [...row]),
        highlightedIndex: index,
        highlightedBucketIndex: null,
        action: `"${val}" not found in bucket ${index}.`,
        found: false,
      });
    }

    setSteps(newSteps);
    onStepChange?.(0, newSteps.length - 1);
  };

  const generateDeleteSteps = (val: string) => {
    if (!val) return;
    const index = hash(val);
    const newSteps: HashTableStep[] = [];
    const currentTable = table.map(row => [...row]);

    // Step 1: Highlight the index
    newSteps.push({
      table: currentTable.map(row => [...row]),
      highlightedIndex: index,
      highlightedBucketIndex: null,
      action: `Deleting "${val}"... Hashing to index ${index}`,
      found: null,
    });

    // Step 2: Find and delete
    const bucketIndex = currentTable[index].indexOf(val);
    if (bucketIndex !== -1) {
      newSteps.push({
        table: currentTable.map(row => [...row]),
        highlightedIndex: index,
        highlightedBucketIndex: bucketIndex,
        action: `Found "${val}" at index ${index}, position ${bucketIndex}. Deleting...`,
        found: true,
      });
      currentTable[index].splice(bucketIndex, 1);
      newSteps.push({
        table: currentTable.map(row => [...row]),
        highlightedIndex: index,
        highlightedBucketIndex: null,
        action: `Deleted "${val}".`,
        found: null,
      });
    } else {
      newSteps.push({
        table: currentTable.map(row => [...row]),
        highlightedIndex: index,
        highlightedBucketIndex: null,
        action: `"${val}" not found. Nothing to delete.`,
        found: false,
      });
    }

    setSteps(newSteps);
    setTable(currentTable);
    onStepChange?.(0, newSteps.length - 1);
  };

  const currentStepData = steps[currentStep] || {
    table: table,
    highlightedIndex: null,
    highlightedBucketIndex: null,
    action: 'Ready',
    found: null,
  };

  const reset = () => {
    setTable(Array.from({ length: size }, () => []));
    setSteps([]);
    onStepChange?.(0, 0);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-32"
          />
          <button
            onClick={() => generateInsertSteps(inputValue)}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Insert</span>
          </button>
          <button
            onClick={() => generateSearchSteps(inputValue)}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button
            onClick={() => generateDeleteSteps(inputValue)}
            className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all flex items-center gap-2"
          >
            <Trash2 size={20} />
            <span className="hidden sm:inline">Delete</span>
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

        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {currentStepData.table.map((bucket, i) => (
            <div key={i} className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-xl border-2 font-bold transition-all duration-300",
                  currentStepData.highlightedIndex === i
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                )}
              >
                {i}
              </div>
              <div className="flex-1 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 min-h-[3.5rem]">
                <AnimatePresence mode="popLayout">
                  {bucket.map((val, j) => (
                    <motion.div
                      key={`${val}-${i}-${j}`}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium shadow-sm border transition-all duration-300",
                        currentStepData.highlightedIndex === i && currentStepData.highlightedBucketIndex === j
                          ? currentStepData.found === true
                            ? "bg-emerald-500 border-emerald-600 text-white"
                            : currentStepData.found === false
                            ? "bg-rose-500 border-rose-600 text-white"
                            : "bg-indigo-500 border-indigo-600 text-white"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {val}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
