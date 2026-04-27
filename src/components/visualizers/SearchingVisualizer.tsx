import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchingVisualizerProps {
  algorithm: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number, line?: number) => void;
}

interface SearchingStep {
  array: number[];
  currentIndex: number | null;
  foundIndex: number | null;
  range: [number, number] | null;
  target: number | null;
  line?: number;
}

export default function SearchingVisualizer({ 
  algorithm, 
  onComplete, 
  speed: externalSpeed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: SearchingVisualizerProps) {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SearchingStep[]>([]);
  const [speed, setSpeed] = useState(externalSpeed);
  
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
    generateArray();
  }, [algorithm]);

  const generateArray = () => {
    let newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);
    if (algorithm === 'binary-search') {
      newArray.sort((a, b) => a - b);
    }
    setArray(newArray);
    const target = newArray[Math.floor(Math.random() * newArray.length)];
    
    const generatedSteps: SearchingStep[] = [{
      array: [...newArray],
      currentIndex: null,
      foundIndex: null,
      range: null,
      target: target
    }];

    const record = (curr: number | null, found: number | null, r: [number, number] | null, line?: number) => {
      generatedSteps.push({
        array: [...newArray],
        currentIndex: curr,
        foundIndex: found,
        range: r,
        target: target,
        line
      });
    };

    if (algorithm === 'linear-search') {
      record(null, null, null, 1);
      for (let i = 0; i < newArray.length; i++) {
        record(i, null, null, 2);
        record(i, null, null, 3);
        if (newArray[i] === target) {
          record(i, i, null, 4);
          break;
        }
      }
      if (generatedSteps[generatedSteps.length - 1].foundIndex === null) {
        record(null, null, null, 7);
      }
    } else {
      let low = 0;
      let high = newArray.length - 1;
      record(null, null, [low, high], 1);
      record(null, null, [low, high], 2);
      record(null, null, [low, high], 3);
      while (low <= high) {
        record(null, null, [low, high], 4);
        let mid = Math.floor((low + high) / 2);
        record(mid, null, [low, high], 5);
        record(mid, null, [low, high], 6);
        if (newArray[mid] === target) {
          record(mid, mid, [low, high], 7);
          break;
        } else if (newArray[mid] < target) {
          record(mid, null, [low, high], 8);
          low = mid + 1;
          record(null, null, [low, high], 9);
        } else {
          record(mid, null, [low, high], 10);
          high = mid - 1;
          record(null, null, [low, high], 11);
        }
      }
      if (generatedSteps[generatedSteps.length - 1].foundIndex === null) {
        record(null, null, null, 14);
      }
    }

    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    currentIndex: null,
    foundIndex: null,
    range: null,
    target: null
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Settings */}
      <div className="flex flex-wrap items-center justify-end gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <Search size={16} className="text-brand-primary" />
            <span className="text-sm font-bold">Target: {currentStepData.target}</span>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 flex flex-col gap-10">
        <div className="flex-1 flex flex-wrap items-center justify-center gap-6 min-h-[400px] bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-800">
          {currentStepData.array.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4">
              <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: currentStepData.foundIndex === idx ? 1.15 : currentStepData.currentIndex === idx ? 1.05 : 1,
                  opacity: currentStepData.range && (idx < currentStepData.range[0] || idx > currentStepData.range[1]) ? 0.2 : 1,
                  backgroundColor: currentStepData.foundIndex === idx ? "#636b2f" : // brand-primary
                                 currentStepData.currentIndex === idx ? "#8b5cf6" : // brand-accent
                                 "rgba(255, 255, 255, 1)"
                }}
                className={cn(
                  "w-20 h-20 rounded-[1.5rem] flex items-center justify-center font-black text-2xl border-b-8 transition-all duration-500 relative group shadow-xl",
                  currentStepData.foundIndex === idx ? "border-brand-dark/50 text-white z-20" :
                  currentStepData.currentIndex === idx ? "border-brand-secondary/50 text-white z-10" :
                  currentStepData.range && (idx < currentStepData.range[0] || idx > currentStepData.range[1]) ? "bg-slate-200/50 dark:bg-slate-800/50 border-transparent text-slate-400" :
                  "dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                )}
              >
                {value}
                
                {currentStepData.currentIndex === idx && (
                  <motion.div 
                    layoutId="searching-glow"
                    className="absolute inset-[-4px] rounded-[1.75rem] border-4 border-brand-accent/30 animate-pulse pointer-events-none"
                  />
                )}
              </motion.div>
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 font-mono italic">i = {idx}</span>
                {currentStepData.currentIndex === idx && (
                  <motion.div 
                    layoutId="pointer"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-1 flex flex-col items-center"
                  >
                    <div className="w-1 h-3 bg-brand-accent rounded-full mb-1" />
                    <span className="text-[9px] font-black text-brand-accent uppercase tracking-tighter bg-brand-accent/10 px-2 py-0.5 rounded-full">Checking</span>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend & Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-lg bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-lg bg-brand-accent shadow-lg shadow-brand-accent/20" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-lg bg-brand-primary shadow-lg shadow-brand-primary/20" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Found</span>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-4 h-4 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discarded</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {currentStepData.foundIndex !== null 
                ? `Target ${currentStepData.target} found at index ${currentStepData.foundIndex}!`
                : currentStepData.currentIndex !== null
                ? `Checking if ${currentStepData.array[currentStepData.currentIndex]} matches ${currentStepData.target}`
                : currentStep === 0 
                ? `Searching for ${currentStepData.target}...`
                : currentStep === steps.length - 1
                ? `Target ${currentStepData.target} not found.`
                : "Processing..."
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
