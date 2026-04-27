import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { QuizQuestion } from '../constants';
import confetti from 'canvas-confetti';
import { useToast } from './Toast';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === questions[currentStep].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScore = score + (selectedOption === questions[currentStep].correctAnswer ? 1 : 0);
      setShowResult(true);
      onComplete();
      if (finalScore === questions.length) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#16a34a', '#15803d']
        });
        showToast('Perfect Score! Quiz Mastered!', 'success');
      } else {
        showToast(`Quiz completed! You got ${finalScore}/${questions.length}.`, 'info');
      }
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-12"
      >
        <div className="inline-flex p-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full mb-4">
          <Award size={64} />
        </div>
        <h2 className="text-3xl font-bold">Quiz Completed!</h2>
        <div className="space-y-2">
          <p className="text-5xl font-black text-blue-600">{percentage}%</p>
          <p className="text-slate-500">You got {score} out of {questions.length} questions correct.</p>
        </div>
        <div className="flex justify-center gap-4 pt-6">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all"
          >
            <RotateCcw size={20} />
            Try Again
          </button>
          {percentage === 100 && (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20">
              <CheckCircle2 size={20} />
              Mastered!
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <HelpCircle size={18} />
          <span>Question {currentStep + 1} of {questions.length}</span>
        </div>
        <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            let state = 'default';
            if (isAnswered) {
              if (idx === currentQuestion.correctAnswer) state = 'correct';
              else if (idx === selectedOption) state = 'wrong';
              else state = 'disabled';
            } else if (idx === selectedOption) {
              state = 'selected';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                  state === 'default' ? 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10' :
                  state === 'selected' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  state === 'correct' ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  state === 'wrong' ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                  'border-slate-100 dark:border-slate-800 opacity-50 grayscale'
                }`}
              >
                <span className="font-medium">{option}</span>
                {state === 'correct' && <CheckCircle2 size={20} />}
                {state === 'wrong' && <XCircle size={20} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation & Controls */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-slate-500">
              <Sparkles size={16} className="text-blue-600" />
              Explanation
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:opacity-90 transition-all"
          >
            {currentStep === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
