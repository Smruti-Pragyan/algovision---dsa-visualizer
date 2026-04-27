import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  ArrowDown, 
  Map as MapIcon, 
  Trophy,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { ROADMAP } from '../constants';

export default function Roadmap() {
  const [completedAlgos, setCompletedAlgos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProgress = localStorage.getItem('algo_progress');
    if (savedProgress) {
      setCompletedAlgos(JSON.parse(savedProgress));
    }
    setLoading(false);
  }, []);

  const calculateProgress = (algos: { id: string }[]) => {
    const completed = algos.filter(a => completedAlgos.includes(a.id)).length;
    return Math.round((completed / algos.length) * 100);
  };

  const totalAlgos = ROADMAP.reduce((acc, section) => acc + section.algorithms.length, 0);
  const totalCompleted = completedAlgos.length;
  const overallProgress = Math.round((totalCompleted / totalAlgos) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 bg-brand-accent/20 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-accent rounded-2xl mb-4"
        >
          <MapIcon size={32} />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tight">DSA Learning Path</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Follow this structured roadmap to master Data Structures and Algorithms from scratch.
        </p>
      </div>

      {/* Overall Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-brand-primary/5"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
              <Trophy className="text-yellow-500" />
              Your Journey
            </h2>
            <p className="text-slate-500">You've completed {totalCompleted} out of {totalAlgos} algorithms.</p>
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * overallProgress) / 100}
                className="text-brand-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-2xl font-black">{overallProgress}%</span>
          </div>
        </div>
      </motion.div>

      {/* Roadmap Steps */}
      <div className="space-y-0 relative">
        {ROADMAP.map((section, idx) => (
          <React.Fragment key={section.id}>
            <motion.div
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white rounded-lg font-bold text-sm">
                          {idx + 1}
                        </span>
                        <h3 className="text-xl font-bold">{section.title}</h3>
                      </div>
                      <span className="text-xs font-bold text-brand-primary bg-brand-accent/10 dark:bg-brand-primary/20 px-3 py-1 rounded-full">
                        {calculateProgress(section.algorithms)}% Complete
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {section.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {section.algorithms.map((algo) => {
                        const isDone = completedAlgos.includes(algo.id);
                        return (
                          <Link
                            key={algo.id}
                            to={`/visualize/${algo.category}/${algo.id}`}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all text-sm font-medium ${
                              isDone 
                                ? 'bg-brand-accent/10 dark:bg-brand-primary/10 border-brand-primary/20 dark:border-brand-primary/30 text-brand-primary dark:text-brand-accent' 
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-brand-primary/30 dark:hover:border-brand-primary/30'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-slate-300" />}
                              {algo.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {idx < ROADMAP.length - 1 && (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-slate-300 dark:text-slate-700"
                >
                  <ArrowDown size={32} />
                </motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="text-center p-12 bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Consistency is key to mastering DSA. Complete each section to unlock the next level of your journey.
        </p>
      </div>
    </div>
  );
}
