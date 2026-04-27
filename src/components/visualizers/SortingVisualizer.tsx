import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Shuffle, Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortingVisualizerProps {
  algorithm: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number, line?: number) => void;
}

interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot: number | null;
  line?: number;
}

export default function SortingVisualizer({ 
  algorithm, 
  onComplete, 
  speed: externalSpeed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: SortingVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(externalSpeed);
  const [isRunning, setIsRunning] = useState(false);
  const [viewMode, setViewMode] = useState<'bars' | 'trace'>('bars');
  
  const isRunningRef = useRef(isRunning);
  const speedRef = useRef(speed);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSpeed(externalSpeed);
  }, [externalSpeed]);

  useEffect(() => {
    if (!isPaused && currentStep < steps.length - 1) {
      const ms = 1000 - (speed * 9.5);
      timerRef.current = setTimeout(() => {
        onStepChange?.(currentStep + 1, steps.length - 1, steps[currentStep + 1].line);
      }, ms);
    } else if (currentStep === steps.length - 1 && steps.length > 1) {
      onComplete?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, currentStep, steps, speed, onStepChange]);

  useEffect(() => {
    generateRandomArray();
  }, [arraySize, algorithm]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    
    // Generate all steps
    const generatedSteps: SortingStep[] = [{
      array: [...newArray],
      comparing: [],
      swapping: [],
      sorted: [],
      pivot: null
    }];

    const record = (arr: number[], comp: number[], swap: number[], sort: number[], piv: number | null, line?: number) => {
      generatedSteps.push({
        array: [...arr],
        comparing: [...comp],
        swapping: [...swap],
        sorted: [...sort],
        pivot: piv,
        line
      });
    };

    // Bubble Sort
    if (algorithm === 'bubble-sort') {
      let arr = [...newArray];
      let n = arr.length;
      let sortedIndices: number[] = [];
      record(arr, [], [], [], null, 1);
      record(arr, [], [], [], null, 2);
      
      for (let i = 0; i < n; i++) {
        record(arr, [], [], sortedIndices, null, 3);
        record(arr, [], [], sortedIndices, null, 4);
        for (let j = 0; j < n - i - 1; j++) {
          record(arr, [j, j + 1], [], sortedIndices, null, 5);
          record(arr, [j, j + 1], [], sortedIndices, null, 6);
          if (arr[j] > arr[j + 1]) {
            record(arr, [j, j + 1], [j, j + 1], sortedIndices, null, 7);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            record(arr, [j, j + 1], [j, j + 1], sortedIndices, null, 8);
          }
        }
        sortedIndices.push(n - i - 1);
        record(arr, [], [], sortedIndices, null, 11);
      }
      record(arr, [], [], sortedIndices, null, 13);
    } else if (algorithm === 'selection-sort') {
      let arr = [...newArray];
      let n = arr.length;
      let sortedIndices: number[] = [];
      record(arr, [], [], [], null, 1);
      record(arr, [], [], [], null, 2);
      
      for (let i = 0; i < n; i++) {
        record(arr, [], [], sortedIndices, null, 3);
        let minIdx = i;
        record(arr, [i], [], sortedIndices, i, 4);
        for (let j = i + 1; j < n; j++) {
          record(arr, [minIdx, j], [], sortedIndices, i, 5);
          record(arr, [minIdx, j], [], sortedIndices, i, 6);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            record(arr, [minIdx], [], sortedIndices, i, 7);
          }
        }
        record(arr, [i, minIdx], [i, minIdx], sortedIndices, i, 10);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        record(arr, [i, minIdx], [i, minIdx], sortedIndices, i, 10);
        sortedIndices.push(i);
        record(arr, [], [], sortedIndices, null, 11);
      }
    } else if (algorithm === 'insertion-sort') {
      let arr = [...newArray];
      let n = arr.length;
      let sortedIndices: number[] = [0];
      record(arr, [], [], [], null, 1);
      for (let i = 1; i < n; i++) {
        record(arr, [], [], sortedIndices, null, 2);
        let key = arr[i];
        record(arr, [i], [], sortedIndices, i, 3);
        let j = i - 1;
        record(arr, [i], [], sortedIndices, i, 4);
        while (j >= 0 && arr[j] > key) {
          record(arr, [j, j + 1], [j, j + 1], sortedIndices, i, 5);
          record(arr, [j, j + 1], [j, j + 1], sortedIndices, i, 6);
          arr[j + 1] = arr[j];
          j = j - 1;
          record(arr, [j + 1], [j + 1], sortedIndices, i, 7);
        }
        arr[j + 1] = key;
        record(arr, [j + 1], [j + 1], sortedIndices, i, 9);
        sortedIndices = Array.from({length: i + 1}, (_, k) => k);
        record(arr, [], [], sortedIndices, null, 10);
      }
    } else if (algorithm === 'quick-sort') {
      let arr = [...newArray];
      const quickSortRec = (low: number, high: number) => {
        record(arr, [], [], [], null, 1);
        if (low < high) {
          record(arr, [], [], [], null, 2);
          
          // Partition logic (simplified line mapping)
          record(arr, [], [], [], null, 3);
          let pivotVal = arr[high];
          let i = low;
          for (let j = low; j < high; j++) {
            record(arr, [j, high], [], [], high);
            if (arr[j] < pivotVal) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
              i++;
            }
          }
          [arr[i], arr[high]] = [arr[high], arr[i]];
          let p = i;
          
          record(arr, [], [], [], p, 4);
          quickSortRec(low, p - 1);
          record(arr, [], [], [], p, 5);
          quickSortRec(p + 1, high);
        }
      };
      quickSortRec(0, arr.length - 1);
      record(arr, [], [], Array.from({length: arr.length}, (_, i) => i), null, 7);
    }

    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: null
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Settings */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('bars')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              viewMode === 'bars' ? "bg-white dark:bg-slate-600 text-brand-primary shadow-sm" : "text-slate-500"
            )}
          >
            Bars
          </button>
          <button
            onClick={() => {
              setViewMode('trace');
              setArraySize(Math.min(arraySize, 8)); // Trace view works better with smaller arrays
            }}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              viewMode === 'trace' ? "bg-white dark:bg-slate-600 text-brand-primary shadow-sm" : "text-slate-500"
            )}
          >
            Trace
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Array Size: {arraySize}</label>
            <input
              type="range"
              min="5"
              max={viewMode === 'trace' ? 10 : 50}
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-32 accent-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 flex flex-col gap-6">
        {viewMode === 'bars' ? (
          <div className="flex-1 flex flex-col min-h-[400px] bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
            <div className="flex-1 flex items-end justify-center gap-1 sm:gap-2 px-4 relative">
              {currentStepData.array.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                  <motion.div
                    layout
                    initial={{ height: 0 }}
                    animate={{ 
                      height: `${value}%`,
                      backgroundColor: currentStepData.swapping.includes(idx) ? "#1e3a8a" : // brand-dark
                                     currentStepData.comparing.includes(idx) ? "#8b5cf6" : // brand-accent
                                     currentStepData.sorted.includes(idx) ? "#636b2f" : // brand-primary
                                     currentStepData.pivot === idx ? "#1e3a8a" : // brand-dark
                                     "#bac095" // brand-secondary
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ minHeight: '10%' }}
                    className={cn(
                      "w-full rounded-t-xl transition-all duration-300 relative group flex items-center justify-center overflow-hidden shadow-sm",
                      (currentStepData.swapping.includes(idx) || currentStepData.comparing.includes(idx)) && "shadow-lg scale-x-105 z-10"
                    )}
                  >
                    {/* Value label inside bar - only if bar is tall enough and array is small enough */}
                    {arraySize <= 25 && value > 15 && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "text-[10px] sm:text-xs font-black select-none",
                          (currentStepData.swapping.includes(idx) || currentStepData.comparing.includes(idx) || currentStepData.sorted.includes(idx)) 
                            ? "text-white" : "text-[#3d4127]"
                        )}
                      >
                        {value}
                      </motion.span>
                    )}
                    
                    {/* Tooltip on hover for busy arrays */}
                    {arraySize > 25 && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white">{value}</span>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Index below bar */}
                  <div className="mt-3 h-6 flex items-center justify-center w-full">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                      {idx}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 overflow-y-auto custom-scrollbar p-4">
            <div className="w-full max-w-2xl space-y-8">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">step = {currentStep}</span>
              </div>
              
              <div className="space-y-16">
                {/* Show current and previous 3 steps */}
                {Array.from({ length: Math.min(currentStep + 1, 5) }).map((_, i) => {
                  const stepIdx = currentStep - i;
                  const step = steps[stepIdx];
                  if (!step) return null;
                  
                  // Try to find the comparison index for the label
                  const compIdx = step.comparing.length > 0 ? step.comparing[0] : null;
                  
                  return (
                    <motion.div 
                      key={stepIdx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1 - i * 0.2, y: 0 }}
                      className="flex items-center gap-12"
                    >
                      <div className="w-16 text-xs font-black text-slate-400 dark:text-slate-500">
                        {compIdx !== null ? `i = ${compIdx}` : `step ${stepIdx}`}
                      </div>
                      
                      <div className="flex-1 relative">
                        <div className="flex gap-1.5">
                          {step.array.map((val, idx) => (
                            <div 
                              key={idx}
                              className={cn(
                                "flex-1 h-14 flex items-center justify-center font-black text-sm transition-all duration-300 rounded-xl border-b-4",
                                step.swapping.includes(idx) ? "bg-brand-dark text-white border-brand-dark/50 shadow-lg -translate-y-1" :
                                step.comparing.includes(idx) ? "bg-brand-accent text-white border-brand-accent/50 shadow-lg -translate-y-1" :
                                step.sorted.includes(idx) ? "bg-brand-primary text-white border-brand-primary/50" :
                                "bg-blue-500 text-white border-blue-600/50 shadow-sm"
                              )}
                            >
                              {val}
                            </div>
                          ))}
                        </div>
                        
                        {/* Comparison Arrows */}
                        {step.comparing.length === 2 && (
                          <div className="absolute -bottom-10 left-0 w-full flex justify-center">
                            <svg className="w-full h-10 overflow-visible">
                              <defs>
                                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                  <path d="M0,0 L8,3 L0,6 Z" fill="#cbd5e1" />
                                </marker>
                              </defs>
                              {(() => {
                                const [idx1, idx2] = step.comparing;
                                const width = 100 / step.array.length;
                                const x1 = (idx1 + 0.5) * width;
                                const x2 = (idx2 + 0.5) * width;
                                return (
                                  <path 
                                    d={`M ${x1}% 0 L ${x1}% 20 Q ${(x1+x2)/2}% 35 ${x2}% 20 L ${x2}% 0`}
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="3"
                                    markerStart="url(#arrowhead)"
                                    markerEnd="url(#arrowhead)"
                                    strokeLinecap="round"
                                  />
                                );
                              })()}
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Legend & Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-secondary/40" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-dark shadow-[0_0_8px_rgba(30,58,138,0.4)]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-primary" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sorted</span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {currentStepData.swapping.length > 0 
                ? `Swapping values at index ${currentStepData.swapping.join(' & ')}`
                : currentStepData.comparing.length > 0
                ? `Comparing values at index ${currentStepData.comparing.join(' & ')}`
                : currentStep === 0 
                ? "Ready to start sorting"
                : currentStep === steps.length - 1
                ? "Sorting complete!"
                : "Processing..."
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
