import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ALGORITHM_DATA } from '../constants';
import { cn } from '../lib/utils';
import { 
  BarChart2, 
  Search, 
  TreePine, 
  Share2, 
  Link2 as LinkIcon, 
  Layers, 
  Triangle, 
  Zap, 
  RotateCcw,
  X,
  Database,
  UserPlus,
  CheckCircle2
} from 'lucide-react';

const categories = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    icon: <BarChart2 className="text-brand-primary" />,
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort' },
      { id: 'selection-sort', name: 'Selection Sort' },
      { id: 'insertion-sort', name: 'Insertion Sort' },
      { id: 'merge-sort', name: 'Merge Sort' },
      { id: 'quick-sort', name: 'Quick Sort' },
    ],
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    icon: <Search className="text-brand-secondary" />,
    algorithms: [
      { id: 'linear-search', name: 'Linear Search' },
      { id: 'binary-search', name: 'Binary Search' },
    ],
  },
  {
    id: 'trees',
    title: 'Trees (Non-Linear)',
    icon: <TreePine className="text-brand-primary" />,
    algorithms: [
      { id: 'binary-tree', name: 'Binary Tree' },
      { id: 'bst', name: 'Binary Search Tree (BST)' },
      { id: 'avl-tree', name: 'AVL Tree' },
      { id: 'red-black-tree', name: 'Red-Black Tree' },
      { id: 'b-tree', name: 'B Tree' },
      { id: 'b-plus-tree', name: 'B+ Tree' },
      { id: 'segment-tree', name: 'Segment Tree' },
      { id: 'fenwick-tree', name: 'Fenwick Tree' },
      { id: 'trie', name: 'Trie (Prefix Tree)' },
      { id: 'n-ary-tree', name: 'N-ary Tree' },
      { id: 'inorder', name: 'Inorder Traversal' },
      { id: 'preorder', name: 'Preorder Traversal' },
      { id: 'postorder', name: 'Postorder Traversal' },
    ],
  },
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    icon: <Share2 className="text-brand-secondary" />,
    algorithms: [
      { id: 'bfs', name: 'Breadth First Search' },
      { id: 'dfs', name: 'Depth First Search' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm" },
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    icon: <LinkIcon className="text-brand-accent" />,
    algorithms: [
      { id: 'linked-list', name: 'Singly Linked List' },
    ],
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    icon: <Layers className="text-brand-accent" />,
    algorithms: [
      { id: 'stack', name: 'Stack (LIFO)' },
      { id: 'queue', name: 'Queue (FIFO)' },
    ],
  },
  {
    id: 'heaps',
    title: 'Heaps (Non-Linear)',
    icon: <Triangle className="text-brand-accent" />,
    algorithms: [
      { id: 'min-heap', name: 'Min Heap' },
      { id: 'max-heap', name: 'Max Heap' },
    ],
  },
  {
    id: 'hashing',
    title: 'Hashing',
    icon: <Database className="text-brand-primary" />,
    algorithms: [
      { id: 'hash-table', name: 'Hash Table' },
    ],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: <Zap className="text-brand-secondary" />,
    algorithms: [
      { id: 'fibonacci-dp', name: 'Fibonacci' },
    ],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    icon: <RotateCcw className="text-brand-accent" />,
    algorithms: [
      { id: 'n-queens', name: 'N-Queens' },
    ],
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [stats, setStats] = useState<{ totalAlgorithms: number; categories: number; trending: string } | null>(null);
  const [completedAlgorithms, setCompletedAlgorithms] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Logged in user: fetch from Firestore
        const fetchProgress = async () => {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCompletedAlgorithms(userDoc.data().completedAlgorithms || []);
          }
        };
        fetchProgress();
      } else {
        // Guest user: fetch from localStorage
        const savedProgress = localStorage.getItem('algo_progress');
        setCompletedAlgorithms(savedProgress ? JSON.parse(savedProgress) : []);
      }
    });
    
    fetch('/api/algorithms/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    return () => unsubscribe();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return categories;

    return categories.map(cat => {
      const categoryTitleMatch = cat.title.toLowerCase().includes(query);
      const matchingAlgorithms = cat.algorithms.filter(algo => 
        algo.name.toLowerCase().includes(query)
      );

      if (categoryTitleMatch) {
        return cat;
      }

      if (matchingAlgorithms.length > 0) {
        return { ...cat, algorithms: matchingAlgorithms };
      }

      return null;
    }).filter((cat): cat is typeof categories[0] => cat !== null);
  }, [searchQuery]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 dark:from-brand-primary/20 dark:to-brand-secondary/20 p-6 rounded-3xl border border-brand-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary text-white rounded-2xl shadow-lg shadow-brand-primary/20">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Save Your Progress</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Create a profile to track completed algorithms and join the community.</p>
            </div>
          </div>
          <Link
            to="/community"
            className="px-8 py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-primary/20 whitespace-nowrap"
          >
            Create Profile
          </Link>
        </motion.div>
      )}

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Learning Journey</h2>
            <p className="text-slate-500 font-medium">You've mastered {completedAlgorithms.length} out of {categories.reduce((acc, cat) => acc + cat.algorithms.length, 0)} algorithms.</p>
          </div>
          
          <div className="flex-1 max-w-md w-full space-y-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
              <span>Overall Progress</span>
              <span className="text-brand-primary">{Math.round((completedAlgorithms.length / Math.max(1, categories.reduce((acc, cat) => acc + cat.algorithms.length, 0))) * 100)}%</span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(completedAlgorithms.length / Math.max(1, categories.reduce((acc, cat) => acc + cat.algorithms.length, 0))) * 100}%` }}
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full shadow-lg shadow-brand-primary/20"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Choose an Algorithm</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Select a category to explore different data structures and algorithms.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400 group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search algorithms or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all text-lg font-medium shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Algorithms</span>
              <span className="text-sm font-black text-brand-primary">{stats.totalAlgorithms}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Categories</span>
              <span className="text-sm font-black text-brand-secondary">{stats.categories}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trending</span>
              <span className="text-sm font-black text-vibrant-amber">{stats.trending}</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ 
                  duration: 0.8, 
                  delay: idx * 0.05,
                  type: "spring",
                  damping: 15,
                  stiffness: 100
                }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    {cat.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{cat.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cat.algorithms.map((algo) => (
                    <Link
                      key={algo.id}
                      to={`/visualize/${cat.id}/${algo.id}`}
                      className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 hover:text-brand-primary dark:hover:text-brand-accent rounded-xl transition-all font-medium text-center border border-transparent hover:border-brand-primary/20 dark:hover:border-brand-primary/40 relative group/algo flex flex-col items-center justify-center gap-1"
                    >
                      <span className="text-sm">{algo.name}</span>
                      {completedAlgorithms.includes(algo.id) && (
                        <div className="absolute -top-2 -right-2 p-1 bg-green-500 text-white rounded-full shadow-lg">
                          <CheckCircle2 size={12} />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-4"
            >
              <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-bold">No algorithms found</h3>
              <p className="text-slate-500">We couldn't find anything matching "{searchQuery}". Try a different search term.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-brand-primary font-bold hover:underline"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
