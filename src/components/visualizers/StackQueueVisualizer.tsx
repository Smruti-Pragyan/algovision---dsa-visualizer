import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StackQueueVisualizerProps {
  type: 'stack' | 'queue';
  algorithm?: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

interface StackQueueStep {
  items: number[];
  highlighted: number | null;
}

export default function StackQueueVisualizer({ 
  type, 
  algorithm, 
  onComplete, 
  speed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: StackQueueVisualizerProps) {
  const [items, setItems] = useState<number[]>([]);
  const [steps, setSteps] = useState<StackQueueStep[]>([]);
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

  const generateSteps = (currentItems: number[], action: 'push' | 'pop', newVal?: number) => {
    const generatedSteps: StackQueueStep[] = [{
      items: [...currentItems],
      highlighted: null
    }];

    if (action === 'push' && newVal !== undefined) {
      generatedSteps.push({
        items: [...currentItems, newVal],
        highlighted: currentItems.length
      });
    } else if (action === 'pop' && currentItems.length > 0) {
      if (type === 'stack') {
        generatedSteps.push({
          items: [...currentItems],
          highlighted: currentItems.length - 1
        });
        generatedSteps.push({
          items: currentItems.slice(0, -1),
          highlighted: null
        });
      } else {
        generatedSteps.push({
          items: [...currentItems],
          highlighted: 0
        });
        generatedSteps.push({
          items: currentItems.slice(1),
          highlighted: null
        });
      }
    }

    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  const push = () => {
    if (inputValue === '') return;
    const val = parseInt(inputValue);
    generateSteps(items, 'push', val);
    setItems([...items, val]);
    setInputValue('');
  };

  const pop = () => {
    if (items.length === 0) return;
    generateSteps(items, 'pop');
    if (type === 'stack') {
      setItems(items.slice(0, -1));
    } else {
      setItems(items.slice(1));
    }
  };

  const reset = () => {
    setItems([]);
    setSteps([]);
    onStepChange?.(0, 0);
  };

  const currentStepData = steps[currentStep] || {
    items: items,
    highlighted: null
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && push()}
            placeholder="Value"
            className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <button
            onClick={push}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            <Plus size={16} /> {type === 'stack' ? 'Push' : 'Enqueue'}
          </button>
          <button
            onClick={pop}
            disabled={items.length === 0}
            className="px-4 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold hover:bg-brand-dark/80 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} /> {type === 'stack' ? 'Pop' : 'Dequeue'}
          </button>
          <button
            onClick={reset}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[400px] bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
        <div className={cn(
          "flex gap-6 items-center p-8 rounded-[2rem]",
          type === 'stack' ? "flex-col-reverse border-x-4 border-b-4 border-slate-200 dark:border-slate-700 w-48 min-h-[300px]" : "flex-row border-y-4 border-slate-200 dark:border-slate-700 w-full min-h-[120px]"
        )}>
          <AnimatePresence>
            {currentStepData.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0, y: type === 'stack' ? 50 : 0, x: type === 'queue' ? 50 : 0 }}
                animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                exit={{ scale: 0, opacity: 0, y: type === 'stack' ? -50 : 0, x: type === 'queue' ? -50 : 0 }}
                layout
                className={cn(
                  "w-20 h-16 rounded-xl bg-white dark:bg-slate-800 border-2 flex items-center justify-center shadow-lg relative transition-all group",
                  currentStepData.highlighted === index ? "border-brand-accent bg-brand-accent/5 scale-110 z-10" : "border-brand-primary"
                )}
              >
                <span className="text-xl font-black text-brand-primary dark:text-brand-accent">{item}</span>
                
                {/* Status Indicator */}
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-primary border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">{index}</span>
                </div>

                {/* Label */}
                <div className={cn(
                  "absolute font-mono text-[9px] font-black uppercase tracking-tighter whitespace-nowrap",
                  type === 'stack' ? "left-24" : "-bottom-8"
                )}>
                  {type === 'stack' 
                    ? (index === currentStepData.items.length - 1 ? '← Top' : index === 0 ? '← Bottom' : '')
                    : (index === 0 ? '↑ Front' : index === currentStepData.items.length - 1 ? '↑ Rear' : '')
                  }
                </div>
              </motion.div>
            ))}
            {currentStepData.items.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 font-bold italic tracking-tight"
              >
                Empty {type}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
