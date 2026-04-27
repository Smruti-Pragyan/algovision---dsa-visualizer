import React from 'react';
import { motion } from 'motion/react';

interface OperationDiagramProps {
  algorithm: string;
}

export default function OperationDiagram({ algorithm }: OperationDiagramProps) {
  const renderDiagram = () => {
    if (algorithm.includes('sort')) {
      return (
        <div className="flex items-end justify-center gap-4 h-32">
          <motion.div 
            className="w-14 h-28 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-brand-primary/20"
            animate={{ 
              x: [0, 72, 72, 0], 
              y: [0, -20, 0, 0],
              scale: [1, 1.05, 1, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
          >
            8
          </motion.div>
          <motion.div 
            className="w-14 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-brand-accent/20"
            animate={{ 
              x: [0, -72, -72, 0], 
              y: [0, 20, 0, 0],
              scale: [1, 0.95, 1, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
          >
            3
          </motion.div>
        </div>
      );
    }

    if (algorithm === 'binary-search') {
      return (
        <div className="flex flex-col items-center gap-8 h-32">
          <div className="flex gap-2">
            {[1, 3, 5, 7, 9, 11, 13].map((n, i) => (
              <motion.div
                key={i}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black border border-slate-200 dark:border-slate-700 shadow-sm"
                animate={{ 
                  opacity: i < 3 ? [1, 0.2, 0.2, 1] : 1,
                  scale: i === 3 ? [1, 1.2, 1.2, 1] : 1,
                  backgroundColor: i === 3 ? ['#ffffff', '#8b5cf6', '#8b5cf6', '#ffffff'] : '#ffffff',
                  color: i === 3 ? ['#000000', '#ffffff', '#ffffff', '#000000'] : '#000000',
                  borderColor: i === 3 ? ['#e2e8f0', '#7c3aed', '#7c3aed', '#e2e8f0'] : '#e2e8f0'
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {n}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full border border-brand-accent/20">
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Discarding Range</span>
          </div>
        </div>
      );
    }

    if (algorithm === 'stack') {
      return (
        <div className="flex items-end justify-center gap-10 h-32">
          <div className="w-20 h-28 border-b-4 border-x-4 border-slate-200 dark:border-slate-800 rounded-b-2xl relative flex flex-col-reverse items-center p-1.5 gap-1.5 bg-slate-100/50 dark:bg-slate-800/20">
            <div className="w-full h-7 bg-brand-primary/40 rounded-lg" />
            <div className="w-full h-7 bg-brand-primary/70 rounded-lg" />
            <motion.div 
              className="w-full h-7 bg-brand-primary rounded-lg absolute shadow-lg shadow-brand-primary/30"
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: [-120, 0, 0, -120], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">LIFO</span>
            <span className="text-xs font-bold text-slate-500">Push & Pop</span>
          </div>
        </div>
      );
    }

    if (algorithm === 'queue') {
      return (
        <div className="flex items-center justify-center gap-6 h-32">
          <div className="w-56 h-14 border-y-4 border-slate-200 dark:border-slate-800 relative flex items-center p-1.5 gap-2 overflow-hidden bg-slate-100/50 dark:bg-slate-800/20 rounded-sm">
            <motion.div 
              className="w-12 h-10 bg-brand-accent rounded-lg flex-shrink-0 shadow-lg shadow-brand-accent/20"
              animate={{ x: [0, 240] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="w-12 h-10 bg-brand-accent/60 rounded-lg flex-shrink-0"
              animate={{ x: [-60, 180] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="w-12 h-10 bg-brand-accent/30 rounded-lg flex-shrink-0"
              animate={{ x: [-120, 120] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">FIFO</span>
            <span className="text-xs font-bold text-slate-500">Enqueue</span>
          </div>
        </div>
      );
    }

    if (algorithm === 'linked-list') {
      return (
        <div className="flex items-center justify-center gap-4 h-32">
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold relative">
                {i}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full" />
              </div>
              {i === 1 && (
                <motion.div 
                  className="h-0.5 bg-slate-400"
                  animate={{ width: [0, 24] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </React.Fragment>
          ))}
          <div className="w-8 h-8 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[8px] text-slate-400">NULL</div>
        </div>
      );
    }

    if (algorithm === 'bst' || algorithm === 'binary-tree' || algorithm === 'avl-tree') {
      return (
        <div className="flex flex-col items-center gap-4 h-40">
          <div className="relative">
            <motion.div 
              className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-xs shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              10
            </motion.div>
            <svg className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-16 overflow-visible">
              <motion.line 
                x1="0" y1="0" x2="-30" y2="40" 
                stroke="#636b2f" strokeWidth="2" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.line 
                x1="0" y1="0" x2="30" y2="40" 
                stroke="#636b2f" strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </svg>
            <div className="absolute top-14 -left-10 flex flex-col items-center">
              <motion.div 
                className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-white font-black text-[10px] shadow-md"
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                5
              </motion.div>
            </div>
            <div className="absolute top-14 -right-10 flex flex-col items-center">
              <motion.div 
                className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-black text-[10px] shadow-md"
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                15
              </motion.div>
            </div>
          </div>
          <div className="mt-12 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tree Structure</div>
        </div>
      );
    }

    if (algorithm === 'bfs' || algorithm === 'dfs') {
      return (
        <div className="flex items-center justify-center gap-8 h-32">
          <div className="relative w-32 h-24">
            {[
              { x: 40, y: 0, label: 'A' },
              { x: 0, y: 60, label: 'B' },
              { x: 80, y: 60, label: 'C' }
            ].map((node, i) => (
              <motion.div
                key={i}
                className="absolute w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-black shadow-sm"
                style={{ left: node.x, top: node.y }}
                animate={{ 
                  backgroundColor: i === 0 ? ['#ffffff', '#636b2f', '#636b2f', '#ffffff'] : 
                                  i === 1 ? ['#ffffff', '#ffffff', '#636b2f', '#636b2f', '#ffffff'] :
                                  ['#ffffff', '#ffffff', '#ffffff', '#636b2f', '#636b2f', '#ffffff'],
                  color: i === 0 ? ['#000000', '#ffffff', '#ffffff', '#000000'] : 
                         i === 1 ? ['#000000', '#000000', '#ffffff', '#ffffff', '#000000'] :
                         ['#000000', '#000000', '#000000', '#ffffff', '#ffffff', '#000000']
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {node.label}
              </motion.div>
            ))}
            <svg className="absolute inset-0 w-full h-full -z-10">
              <line x1="60" y1="20" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="60" y1="20" x2="100" y2="80" stroke="#cbd5e1" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Traversal</span>
            <span className="text-xs font-bold text-slate-500">Node by Node</span>
          </div>
        </div>
      );
    }

    if (algorithm === 'hash-table') {
      return (
        <div className="flex items-center justify-center gap-8 h-32">
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">{i}</div>
                <motion.div 
                  className="h-6 bg-brand-primary/20 rounded border border-brand-primary/30 px-2 flex items-center text-[10px] font-medium"
                  animate={{ width: i === 1 ? [0, 80, 80, 0] : 40 }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {i === 1 ? 'Value' : '...'}
                </motion.div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Hashing</span>
            <span className="text-xs font-bold text-slate-500">Key → Index</span>
          </div>
        </div>
      );
    }
    // Default generic diagram
    return (
      <div className="flex items-center justify-center h-32">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl shadow-lg"
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-12 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-10 overflow-hidden relative group">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="text-center space-y-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operation Logic</h4>
        <p className="text-lg font-black text-slate-900 dark:text-white">Simplified Visual Flow</p>
      </div>
      
      <div className="relative py-4">
        {renderDiagram()}
      </div>
      
      <div className="flex gap-3">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-brand-primary" 
        />
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 rounded-full bg-brand-primary/60" 
        />
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="w-2 h-2 rounded-full bg-brand-primary/30" 
        />
      </div>
    </div>
  );
}
