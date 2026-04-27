import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight,
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Info, 
  CheckCircle2,
  Briefcase,
  Zap,
  Clock,
  Database,
  Layers,
  Code2,
  ChevronDown,
  Copy,
  Terminal,
  HelpCircle,
  ExternalLink,
  BookOpen,
  User,
  Target
} from 'lucide-react';
import { ALGORITHM_DATA } from '../constants';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import SortingVisualizer from '../components/visualizers/SortingVisualizer';
import SearchingVisualizer from '../components/visualizers/SearchingVisualizer';
import TreeVisualizer from '../components/visualizers/TreeVisualizer';
import HashTableVisualizer from '../components/visualizers/HashTableVisualizer';
import SegmentTreeVisualizer from '../components/visualizers/SegmentTreeVisualizer';
import FenwickTreeVisualizer from '../components/visualizers/FenwickTreeVisualizer';
import NAryTreeVisualizer from '../components/visualizers/NAryTreeVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';
import LinkedListVisualizer from '../components/visualizers/LinkedListVisualizer';
import StackQueueVisualizer from '../components/visualizers/StackQueueVisualizer';
import HeapVisualizer from '../components/visualizers/HeapVisualizer';
import DPVisualizer from '../components/visualizers/DPVisualizer';
import BacktrackingVisualizer from '../components/visualizers/BacktrackingVisualizer';

import Quiz from '../components/Quiz';

import Editor, { loader } from '@monaco-editor/react';
import { GoogleGenAI, Type } from "@google/genai";
import confetti from 'canvas-confetti';
import { useToast } from '../components/Toast';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

// Define custom theme for Monaco
loader.init().then((monaco) => {
  monaco.editor.defineTheme('algo-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
      { token: 'identifier', foreground: 'f8f8f2' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'operator', foreground: 'ff79c6' },
      { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'class', foreground: '8be9fd' },
      { token: 'variable', foreground: 'f8f8f2' },
    ],
    colors: {
      'editor.background': '#0f172a', // slate-950
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#475569', // slate-600
      'editorLineNumber.activeForeground': '#94a3b8', // slate-400
      'editor.lineHighlightBackground': '#1e293b', // slate-900
      'editorCursor.foreground': '#f8f8f2',
      'editor.selectionBackground': '#334155', // slate-700
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
      'editor.selectionHighlightBackground': '#334155',
      'editorWidget.background': '#0f172a',
      'editorWidget.border': '#1e293b',
    }
  });
});

export default function Visualizer() {
  const { category, algorithm } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPseudocodeExpanded, setIsPseudocodeExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'explanation' | 'code' | 'quiz'>('visualizer');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [playgroundLang, setPlaygroundLang] = useState('java');
  const [pseudocodeLang, setPseudocodeLang] = useState('java');
  const [playgroundCode, setPlaygroundCode] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isPlaygroundError, setIsPlaygroundError] = useState(false);
  const [isPlaygroundRunning, setIsPlaygroundRunning] = useState(false);
  const [playgroundError, setPlaygroundError] = useState<{ message: string; line?: number; suggestion?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [speed, setSpeed] = useState(50); // 1-100
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [expandedExplanation, setExpandedExplanation] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | undefined>();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPaused(true);
    setCurrentStep(0);
    setTotalSteps(0);
    setResetKey(prev => prev + 1);
  }, [algorithm, category]);

  const data = ALGORITHM_DATA[algorithm || ''] || {
    title: 'Algorithm Not Found',
    description: 'Sorry, this algorithm is not yet implemented.',
    difficulty: 'Easy' as const,
    detailedExplanation: '',
    stability: '',
    inPlace: '',
    adaptive: '',
    timeComplexity: { best: '-', average: '-', worst: '-' },
    spaceComplexity: '-',
    pseudocode: '',
    industryUse: '',
    optimizedCode: '',
    javaCode: '',
    pythonCode: '',
    cppCode: '',
    csharpCode: '',
    quiz: [],
    practiceQuestions: [],
    externalLinks: [],
  };

  useEffect(() => {
    if (playgroundLang === 'java') {
      setPlaygroundCode(data.javaCode || '// Java implementation not available');
    } else if (playgroundLang === 'python') {
      setPlaygroundCode(data.pythonCode || '# Python implementation not available');
    } else if (playgroundLang === 'cpp') {
      setPlaygroundCode(data.cppCode || '// C++ implementation not available');
    } else if (playgroundLang === 'csharp') {
      setPlaygroundCode(data.csharpCode || '// C# implementation not available');
    } else {
      setPlaygroundCode(data.optimizedCode || '// JavaScript implementation not available');
    }
    setPlaygroundOutput('');
  }, [algorithm, playgroundLang, data.javaCode, data.optimizedCode, data.pythonCode, data.cppCode, data.csharpCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        // Guest user: progress resets on refresh (handled in App.tsx or here)
        const savedProgress = localStorage.getItem('algo_progress');
        if (savedProgress && algorithm) {
          const progress = JSON.parse(savedProgress);
          if (progress.includes(algorithm)) {
            setIsCompleted(true);
          }
        }
      } else {
        // Logged in user: fetch from Firestore
        const fetchProgress = async () => {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.completedAlgorithms && algorithm && userData.completedAlgorithms.includes(algorithm)) {
              setIsCompleted(true);
            }
          }
        };
        fetchProgress();
      }
    });
    return () => unsubscribe();
  }, [algorithm]);

  const handleComplete = async () => {
    if (!isCompleted) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#636b2f', '#bac095', '#d4de95', '#3d4127']
      });
      showToast(`Congratulations! You've mastered ${data.title}!`, 'success');
      
      if (algorithm) {
        if (!user) {
          // Guest user: save to localStorage
          const savedProgress = localStorage.getItem('algo_progress');
          const progress = savedProgress ? JSON.parse(savedProgress) : [];
          if (!progress.includes(algorithm)) {
            progress.push(algorithm);
            localStorage.setItem('algo_progress', JSON.stringify(progress));
          }
        } else {
          // Logged in user: save to Firestore
          const userRef = doc(db, 'users', user.uid);
          try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              await updateDoc(userRef, {
                completedAlgorithms: arrayUnion(algorithm)
              });
            } else {
              await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                completedAlgorithms: [algorithm],
                createdAt: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error("Error saving progress:", error);
          }
        }
      }
    }
    setIsCompleted(true);
  };

  const runPlaygroundCode = async () => {
    setIsPlaygroundRunning(true);
    setIsPlaygroundError(false);
    setPlaygroundError(null);
    setPlaygroundOutput('Running code...\n');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Simulate the execution of the following ${playgroundLang} code. 
        
        Code:
        ${playgroundCode}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, description: "Whether the code execution was successful or had an error." },
              stdout: { type: Type.STRING, description: "The standard output of the code if successful." },
              error: {
                type: Type.OBJECT,
                properties: {
                  message: { type: Type.STRING, description: "A clear, user-friendly explanation of the error." },
                  line: { type: Type.INTEGER, description: "The line number where the error occurs, if applicable." },
                  suggestion: { type: Type.STRING, description: "A brief, actionable suggestion for how to fix the error." }
                },
                required: ["message"]
              }
            },
            required: ["status"]
          }
        }
      });
      
      const text = response.text;
      if (!text) {
        throw new Error('Empty response from simulation service');
      }

      const result = JSON.parse(text);
      
      if (result.status === 'error' || result.error) {
        setIsPlaygroundError(true);
        setPlaygroundError(result.error || { message: 'An unknown error occurred during simulation.' });
        setPlaygroundOutput('');
      } else {
        setIsPlaygroundError(false);
        setPlaygroundOutput(result.stdout || 'No output.');
      }
    } catch (error) {
      setIsPlaygroundError(true);
      setPlaygroundError({
        message: 'The simulation service is currently unavailable or returned an invalid response. Please check your connection or try again later.',
        suggestion: 'This might be due to a temporary API issue or an invalid code structure that the AI couldn\'t parse.'
      });
      setPlaygroundOutput('');
      console.error(error);
    } finally {
      setIsPlaygroundRunning(false);
    }
  };

  const copyPlaygroundCode = () => {
    navigator.clipboard.writeText(playgroundCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [snippetCopied, setSnippetCopied] = useState(false);
  const copySnippetCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const renderVisualizer = () => {
    const visualizerProps = {
      algorithm: algorithm || '',
      onComplete: handleComplete,
      speed,
      isPaused,
      currentStep,
      onStepChange: (step: number, total: number, line?: number) => {
        setCurrentStep(step);
        setTotalSteps(total);
        setCurrentLine(line);
      }
    };

    switch (category) {
      case 'sorting':
        return <SortingVisualizer key={resetKey} {...visualizerProps} />;
      case 'searching':
        return <SearchingVisualizer key={resetKey} {...visualizerProps} />;
      case 'trees':
        if (algorithm === 'n-ary-tree') {
          return <NAryTreeVisualizer key={resetKey} {...visualizerProps} />;
        }
        if (algorithm === 'segment-tree') {
          return <SegmentTreeVisualizer key={resetKey} {...visualizerProps} />;
        }
        if (algorithm === 'fenwick-tree') {
          return <FenwickTreeVisualizer key={resetKey} {...visualizerProps} />;
        }
        return <TreeVisualizer key={resetKey} {...visualizerProps} />;
      case 'hashing':
        return <HashTableVisualizer key={resetKey} {...visualizerProps} />;
      case 'graphs':
        return <GraphVisualizer key={resetKey} {...visualizerProps} />;
      case 'linked-lists':
        return <LinkedListVisualizer key={resetKey} {...visualizerProps} />;
      case 'stacks-queues':
        return <StackQueueVisualizer key={resetKey} type={algorithm as 'stack' | 'queue'} {...visualizerProps} />;
      case 'heaps':
        return <HeapVisualizer key={resetKey} {...visualizerProps} />;
      case 'dynamic-programming':
        return <DPVisualizer key={resetKey} {...visualizerProps} />;
      case 'backtracking':
        return <BacktrackingVisualizer key={resetKey} {...visualizerProps} />;
      default:
        return <div className="flex items-center justify-center h-full text-slate-400">Visualizer not available</div>;
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {data.title}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg">
                  <CheckCircle2 size={12} /> Completed
                </span>
              )}
            </h1>
          </div>
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="ml-4 flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-primary/20"
            >
              <CheckCircle2 size={14} />
              Mark as Completed
            </button>
          )}
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'visualizer' 
                ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-brand-accent shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Visualizer
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'explanation' 
                ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-brand-accent shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Explanation
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'code' 
                ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-brand-accent shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Code Playground
          </button>
          {data.quiz && data.quiz.length > 0 && (
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'quiz' 
                  ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-brand-accent shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Quiz
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cn(
          "bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col transition-all duration-500",
          activeTab === 'visualizer' ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          {activeTab === 'visualizer' && (
            <div className="flex-1 flex flex-col">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Playback Speed</span>
                        <span className="text-[10px] font-bold text-brand-primary dark:text-brand-accent">{speed}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        className="w-full sm:w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />
                  
                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 sm:w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 min-w-[40px]">
                        {currentStep} / {totalSteps}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setResetKey(prev => prev + 1);
                      setCurrentStep(0);
                      setIsPaused(true);
                    }}
                    className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 shadow-sm active:scale-95" 
                    title="Reset / Shuffle State"
                  >
                    <RotateCcw size={20} />
                  </button>
                  
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => {
                        setIsPaused(true);
                        setCurrentStep(Math.max(0, currentStep - 1));
                      }}
                      disabled={currentStep === 0}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed" 
                      title="Previous Step"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <button 
                      onClick={() => setIsPaused(!isPaused)}
                      className="mx-1 p-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-all shadow-md shadow-brand-primary/20 active:scale-95 flex items-center justify-center min-w-[44px]"
                      title={isPaused ? "Play" : "Pause"}
                    >
                      {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                    </button>

                    <button 
                      onClick={() => {
                        setIsPaused(true);
                        setCurrentStep(Math.min(totalSteps, currentStep + 1));
                      }}
                      disabled={currentStep >= totalSteps}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed" 
                      title="Next Step"
                    >
                      <ChevronLeft size={20} className="rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 relative bg-slate-50 dark:bg-slate-900/10">
                {renderVisualizer()}
              </div>
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-7xl mx-auto space-y-12">
                {/* Overview Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                      <Layers size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Array Logic & Essence</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xl font-medium">
                        {data.description}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-slate-400 mb-4">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Quick Stats</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Difficulty</span>
                          <p className={cn(
                            "text-sm font-black",
                            data.difficulty === 'Easy' ? 'text-green-500' :
                            data.difficulty === 'Medium' ? 'text-vibrant-amber' : 'text-red-500'
                          )}>{data.difficulty}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Stable</span>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{data.stability || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">In-Place</span>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{data.inPlace || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Adaptive</span>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{data.adaptive || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Complexity Analysis Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-vibrant-amber/10 rounded-2xl text-vibrant-amber">
                      <Zap size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Complexity Analysis</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Time Complexity Cards */}
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2 text-vibrant-amber mb-4">
                        <Clock size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Best Case</span>
                      </div>
                      <div className="text-3xl font-mono font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform origin-left">
                        {data.timeComplexity.best}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Minimum time needed</p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2 text-vibrant-amber mb-4">
                        <Clock size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Average Case</span>
                      </div>
                      <div className="text-3xl font-mono font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform origin-left">
                        {data.timeComplexity.average}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Typical performance</p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2 text-vibrant-amber mb-4">
                        <Clock size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Worst Case</span>
                      </div>
                      <div className="text-3xl font-mono font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform origin-left">
                        {data.timeComplexity.worst}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Maximum time needed</p>
                    </div>

                    {/* Space Complexity Card */}
                    <div className="p-6 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-3xl border border-brand-primary/20 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-center gap-2 text-brand-primary dark:text-brand-accent mb-4">
                        <Database size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Space Complexity</span>
                      </div>
                      <div className="text-3xl font-mono font-black text-brand-primary dark:text-brand-accent group-hover:scale-110 transition-transform origin-left">
                        {data.spaceComplexity}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Auxiliary memory used</p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Left Column: Deep Dive & Pseudocode */}
                  <div className="lg:col-span-2 space-y-12">
                    {/* Pseudocode Section */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-secondary/10 rounded-2xl text-brand-secondary">
                          <Code2 size={28} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pseudocode</h2>
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-slate-900 rounded-[2rem] p-8 overflow-hidden border border-slate-800 shadow-2xl">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/50" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                              <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithm Logic</span>
                          </div>
                          <div className="font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar pb-4 space-y-1">
                            {data.pseudocode.split('\n').map((line, idx) => (
                              <div 
                                key={idx}
                                className={cn(
                                  "flex gap-4 px-4 py-1 rounded-lg transition-all duration-300",
                                  currentLine === idx + 1 
                                    ? "bg-brand-primary/20 text-brand-accent border-l-4 border-brand-accent -ml-4 pl-3" 
                                    : "text-slate-400"
                                )}
                              >
                                <span className="w-6 text-right opacity-30 select-none">{idx + 1}</span>
                                <span className="whitespace-pre">{line}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Practice Problems */}
                    {data.practiceQuestions && data.practiceQuestions.length > 0 && (
                      <section className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                            <Target size={28} />
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Practice Problems</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {data.practiceQuestions.map((prob, idx) => (
                            <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors">{prob.title}</h3>
                              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                {prob.description}
                              </p>
                              {prob.solutionLink && (
                                <a 
                                  href={prob.solutionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                >
                                  Solve Problem <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Detailed Explanation */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                          <BookOpen size={28} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Deep Dive</h2>
                      </div>
                      <div className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                        <Markdown>{data.detailedExplanation}</Markdown>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Industry Use & Resources */}
                  <div className="space-y-10">
                    {/* Industry Use Section */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-vibrant-emerald/10 rounded-2xl text-vibrant-emerald">
                          <Briefcase size={28} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Industry Use</h2>
                      </div>
                      <div className="p-8 bg-vibrant-emerald/5 dark:bg-vibrant-emerald/10 rounded-[2.5rem] border border-vibrant-emerald/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-vibrant-emerald/10 group-hover:scale-110 transition-transform duration-700">
                          <Briefcase size={120} />
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic relative z-10">
                          "{data.industryUse}"
                        </p>
                      </div>
                    </section>

                    {/* Tips & Tricks */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-vibrant-amber/10 rounded-2xl text-vibrant-amber">
                          <Zap size={28} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tips & Tricks</h2>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <ul className="space-y-6">
                          {(data.tips && data.tips.length > 0 ? data.tips : [
                            "Visualize the process step-by-step to build intuition.",
                            "Consider edge cases like empty inputs or single elements.",
                            "Think about the trade-offs between time and space complexity.",
                            "Practice implementing the algorithm from scratch."
                          ]).map((tip, idx) => (
                            <li key={idx} className="flex gap-4 group">
                              <span className="flex-shrink-0 w-8 h-8 bg-vibrant-amber/10 text-vibrant-amber rounded-xl flex items-center justify-center text-xs font-black group-hover:scale-110 transition-transform">
                                {idx + 1}
                              </span>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                                {tip}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    {/* Resources */}
                    {data.externalLinks && data.externalLinks.length > 0 && (
                      <section className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                            <ExternalLink size={28} />
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resources</h2>
                        </div>
                        <div className="space-y-3">
                          {data.externalLinks.map((link, idx) => (
                            <a 
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-accent hover:border-brand-primary/30 transition-all group shadow-sm hover:shadow-md"
                            >
                              <span className="truncate mr-2">{link.title}</span>
                              <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </a>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Knowledge Check */}
                    {data.quiz && data.quiz.length > 0 && (
                      <section className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-[2.5rem] border-2 border-brand-primary/10">
                          <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ready for a Challenge?</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Test your understanding of {data.title} with our interactive quiz.</p>
                          </div>
                          <button
                            onClick={() => setActiveTab('quiz')}
                            className="flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-black transition-all shadow-xl shadow-brand-primary/20 active:scale-95 whitespace-nowrap"
                          >
                            <HelpCircle size={20} />
                            Start Knowledge Check
                          </button>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-800 gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={playgroundLang}
                      onChange={(e) => setPlaygroundLang(e.target.value)}
                      className="w-full appearance-none bg-slate-800 border border-slate-700 px-4 py-1.5 pr-10 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option value="java">Java</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={runPlaygroundCode}
                      disabled={isPlaygroundRunning}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 bg-brand-primary hover:bg-brand-dark disabled:bg-brand-secondary text-white rounded-xl text-xs font-bold transition-all"
                    >
                      {isPlaygroundRunning ? <RotateCcw className="animate-spin" size={12} /> : <Play size={12} />}
                      Run
                    </button>
                    <button
                      onClick={() => {
                        setPlaygroundOutput('');
                        setIsPlaygroundError(false);
                        setPlaygroundError(null);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={copyPlaygroundCode}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                    >
                      {copied ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                <div className="flex flex-col border-r border-slate-800 overflow-hidden">
                  <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
                    <Editor
                      height="100%"
                      language={playgroundLang === 'cpp' ? 'cpp' : playgroundLang === 'csharp' ? 'csharp' : playgroundLang}
                      value={playgroundCode}
                      onChange={(value) => setPlaygroundCode(value || '')}
                      theme="algo-dark"
                      options={{
                        fontSize: 14,
                        fontFamily: '"JetBrains Mono", monospace',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20, bottom: 20 },
                        lineNumbers: 'on',
                        folding: true,
                        glyphMargin: false,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        wordWrap: 'on',
                        lineHeight: 24,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col bg-[#010409] overflow-hidden">
                  <div className={cn(
                    "flex-1 p-6 font-mono text-xs overflow-auto whitespace-pre-wrap",
                    isPlaygroundError ? "text-red-400" : "text-slate-400"
                  )}>
                    {isPlaygroundError && playgroundError ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-[10px]">
                          <Terminal size={14} />
                          <span>Simulation Error</span>
                        </div>
                        <div className="p-5 bg-red-500/5 border-2 border-red-500/20 rounded-2xl space-y-3 shadow-lg shadow-red-500/5">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-red-500 text-white rounded-md">
                              <HelpCircle size={14} />
                            </div>
                            <p className="text-sm font-bold text-red-400 leading-relaxed">
                              {playgroundError.line && (
                                <span className="bg-red-500/20 px-1.5 py-0.5 rounded mr-2 text-[10px] font-black">LINE {playgroundError.line}</span>
                              )}
                              {playgroundError.message}
                            </p>
                          </div>
                          
                          {playgroundError.suggestion && (
                            <div className="mt-4 pt-4 border-t border-red-500/10">
                              <div className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-brand-primary text-white rounded-md">
                                  <Zap size={14} />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Suggested Fix</span>
                                  <p className="text-sm text-slate-400 italic leading-relaxed">
                                    {playgroundError.suggestion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      playgroundOutput || <span className="text-slate-700 italic">Click "Run" to see the output...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && data.quiz && (
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <Quiz questions={data.quiz} onComplete={handleComplete} />
            </div>
          )}
        </div>

        {/* Right Sidebar - Complexity & Info */}
        {activeTab === 'visualizer' && (
          <div className="lg:col-span-1 space-y-6">
            {/* Pseudocode Sidebar Card */}
            {data.pseudocode && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col sticky top-8">
                <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={18} className="text-brand-accent" />
                    <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest whitespace-nowrap">Live Pseudocode</h3>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                    <div className="w-2 h-2 rounded-full bg-green-500/30" />
                  </div>
                </div>
                <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar-dark bg-slate-900/50">
                  <div className="font-mono text-[11px] leading-relaxed space-y-1.5">
                    {data.pseudocode.split('\n').map((line, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "flex gap-4 px-3 py-1 rounded-lg transition-all duration-300",
                          currentLine === idx + 1 
                            ? "bg-brand-primary text-white border-l-4 border-brand-accent -ml-3 pl-2 shadow-lg shadow-brand-primary/20" 
                            : "text-slate-500"
                        )}
                      >
                        <span className="w-5 text-right opacity-30 select-none font-bold">{idx + 1}</span>
                        <span className="whitespace-pre">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-800">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">
                    Highlights update in real-time
                  </p>
                </div>
              </div>
            )}

            {/* Complexity Card */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-vibrant-amber/10 rounded-xl text-vibrant-amber">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Complexity</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-vibrant-amber mb-2">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Time Complexity</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Worst Case</span>
                      <span className="text-sm font-mono font-black text-slate-900 dark:text-white">{data.timeComplexity.worst}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Average Case</span>
                      <span className="text-sm font-mono font-black text-slate-900 dark:text-white">{data.timeComplexity.average}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Best Case</span>
                      <span className="text-sm font-mono font-black text-slate-900 dark:text-white">{data.timeComplexity.best}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                  <div className="flex items-center gap-2 text-brand-primary dark:text-brand-accent mb-2">
                    <Database size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Space Complexity</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Auxiliary Space</span>
                    <span className="text-sm font-mono font-black text-brand-primary dark:text-brand-accent">{data.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <Info size={20} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quick Info</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {data.description}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Difficulty</span>
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    data.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                    data.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                  )}>
                    {data.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
