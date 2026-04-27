import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Plus, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Node {
  id: string;
  value: number;
}

interface LinkedListVisualizerProps {
  algorithm?: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

interface LinkedListStep {
  nodes: Node[];
  highlighted: string | null;
}

export default function LinkedListVisualizer({ 
  algorithm, 
  onComplete, 
  speed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: LinkedListVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
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

  const generateSteps = (currentNodes: Node[], action: 'add' | 'remove', targetId?: string, newVal?: number) => {
    const generatedSteps: LinkedListStep[] = [{
      nodes: [...currentNodes],
      highlighted: null
    }];

    if (action === 'add' && newVal !== undefined) {
      const newNode: Node = {
        id: Math.random().toString(36).substr(2, 9),
        value: newVal,
      };
      // Traverse to end
      for (let i = 0; i < currentNodes.length; i++) {
        generatedSteps.push({
          nodes: [...currentNodes],
          highlighted: currentNodes[i].id
        });
      }
      generatedSteps.push({
        nodes: [...currentNodes, newNode],
        highlighted: newNode.id
      });
    } else if (action === 'remove' && targetId) {
      let found = false;
      for (let i = 0; i < currentNodes.length; i++) {
        generatedSteps.push({
          nodes: [...currentNodes],
          highlighted: currentNodes[i].id
        });
        if (currentNodes[i].id === targetId) {
          found = true;
          break;
        }
      }
      if (found) {
        generatedSteps.push({
          nodes: currentNodes.filter(n => n.id !== targetId),
          highlighted: null
        });
      }
    }

    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  const addNode = () => {
    if (inputValue === '') return;
    const val = parseInt(inputValue);
    generateSteps(nodes, 'add', undefined, val);
    
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      value: val,
    };
    setNodes([...nodes, newNode]);
    setInputValue('');
  };

  const removeNode = (id: string) => {
    generateSteps(nodes, 'remove', id);
    setNodes(nodes.filter(node => node.id !== id));
  };

  const reset = () => {
    setNodes([]);
    setSteps([]);
    onStepChange?.(0, 0);
  };

  const currentStepData = steps[currentStep] || {
    nodes: nodes,
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
            onKeyPress={(e) => e.key === 'Enter' && addNode()}
            placeholder="Value"
            className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <button
            onClick={addNode}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Add Node
          </button>
          <button
            onClick={reset}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-x-auto min-h-[400px] bg-slate-50 dark:bg-slate-900/30 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 scroll-smooth">
        <div className="flex items-center gap-6 py-12">
          <AnimatePresence mode="popLayout">
            {currentStepData.nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <motion.div
                  initial={{ scale: 0, opacity: 0, x: -20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.5, opacity: 0, x: 20 }}
                  layout
                  className="relative group shrink-0"
                >
                  <div className={cn(
                    "flex flex-col shadow-xl transition-all duration-300 rounded-[1.25rem] overflow-hidden border-2",
                    currentStepData.highlighted === node.id ? "scale-110 z-20 shadow-brand-accent/20 ring-4 ring-brand-accent/20" : "z-10"
                  )}>
                    {/* Header/Label */}
                    <div className={cn(
                      "px-3 py-1 font-black text-[9px] uppercase tracking-tighter text-center border-b-2",
                      currentStepData.highlighted === node.id ? "bg-brand-accent text-white border-brand-accent" : "bg-brand-primary text-white border-brand-primary"
                    )}>
                      {index === 0 ? 'Head' : index === currentStepData.nodes.length - 1 ? 'Tail' : `Node ${index}`}
                    </div>
                    
                    {/* Body (Data | Next) */}
                    <div className="flex w-24 h-16 bg-white dark:bg-slate-800">
                      <div className="flex-[2] flex items-center justify-center border-r-2 border-slate-100 dark:border-slate-700">
                        <span className="text-xl font-black text-brand-primary dark:text-brand-accent">{node.value}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeNode(node.id)}
                    className="absolute -top-3 -right-3 p-1.5 bg-brand-dark text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-30"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>

                {index < currentStepData.nodes.length - 1 && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="text-brand-primary flex items-center shrink-0"
                  >
                    <div className="relative flex items-center">
                      <div className="w-12 h-1 bg-brand-primary/20 dark:bg-brand-primary/10 rounded-full" />
                      <div className="absolute inset-0 flex items-center overflow-hidden">
                        <motion.div 
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="w-full h-full bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
                        />
                      </div>
                      <ArrowRight size={24} className="text-brand-primary -ml-2" />
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
            {currentStepData.nodes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 font-bold italic tracking-tight"
              >
                No nodes in the list.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
