import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  LayoutDashboard,
  FileText,
  Heart,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp,
  collectionGroup,
  doc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { ALGORITHM_DATA } from '../constants';

interface Query {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  votes: number;
}

interface Answer {
  id: string;
  queryId: string;
  queryTitle: string;
  content: string;
  createdAt: any;
  votes: number;
  isBest: boolean;
}

export default function Profile() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [myQueries, setMyQueries] = useState<Query[]>([]);
  const [myAnswers, setMyAnswers] = useState<Answer[]>([]);
  const [upvotedQueries, setUpvotedQueries] = useState<Query[]>([]);
  const [activeTab, setActiveTab] = useState<'queries' | 'answers' | 'upvoted' | 'mastery'>('queries');
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const totalAlgos = Object.keys(ALGORITHM_DATA).length;
    if (user) {
      const fetchProgress = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const ids = userDoc.data().completedAlgorithms || [];
          setCompletedIds(ids);
          setProgress({ completed: ids.length, total: totalAlgos });
        }
      };
      fetchProgress();
    } else {
      const savedProgress = localStorage.getItem('algo_progress');
      const ids = savedProgress ? JSON.parse(savedProgress) : [];
      setCompletedIds(ids);
      setProgress({ completed: ids.length, total: totalAlgos });
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchUserData(firebaseUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const fetchUserData = async (uid: string) => {
    setLoading(true);
    try {
      // Fetch My Queries
      const queriesRef = collection(db, 'queries');
      const qQueries = query(queriesRef, where('authorId', '==', uid), orderBy('createdAt', 'desc'));
      try {
        const queriesSnap = await getDocs(qQueries);
        const queriesData = queriesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Query[];
        setMyQueries(queriesData);
      } catch (e) {
        console.error("Error fetching my queries:", e);
      }

      // Fetch My Answers
      const answersRef = collectionGroup(db, 'answers');
      const qAnswers = query(answersRef, where('authorId', '==', uid), orderBy('createdAt', 'desc'));
      try {
        const answersSnap = await getDocs(qAnswers);
        const answersData = answersSnap.docs.map(doc => ({
          id: doc.id,
          queryId: doc.ref.parent.parent?.id || '',
          ...doc.data()
        })) as Answer[];
        setMyAnswers(answersData);
      } catch (e) {
        console.error("Error fetching my answers:", e);
      }
      
      // Fetch Upvoted Queries
      const qUpvoted = query(queriesRef, where(`voters.${uid}`, '==', 1));
      try {
        const upvotedSnap = await getDocs(qUpvoted);
        const upvotedData = upvotedSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Query[];
        setUpvotedQueries(upvotedData);
      } catch (e) {
        console.error("Error fetching upvoted queries:", e);
      }

    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-brand-primary/10 rounded-2xl mb-4">
            <User className="text-brand-primary" size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Access Your Profile</h1>
          <p className="text-slate-500 mt-2">Sign in with Google to track your progress and see your activity.</p>
        </div>
        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-2xl" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-brand-primary/10 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl">
                <User size={64} className="text-brand-primary" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 p-2 bg-brand-accent rounded-xl text-white shadow-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black tracking-tight">{user.displayName || 'Anonymous Student'}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="block text-2xl font-black text-brand-primary">{myQueries.length}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queries</span>
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="block text-2xl font-black text-brand-secondary">{myAnswers.length}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Answers</span>
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="block text-2xl font-black text-brand-secondary">{upvotedQueries.length}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upvoted</span>
              </div>
            </div>
            
            {/* Algorithm Progress Bar */}
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Zap size={16} className="text-brand-accent" />
                  Algorithm Mastery
                </span>
                <span className="text-sm font-black text-brand-primary">
                  {progress.completed} / {progress.total} ({Math.round((progress.completed / progress.total) * 100)}%)
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent shadow-[0_0_15px_rgba(99,107,47,0.3)]"
                />
              </div>
            </div>
          </div>
          <Link 
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95 shadow-xl"
          >
            <LayoutDashboard size={20} />
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'queries', label: 'My Queries', icon: FileText },
          { id: 'answers', label: 'My Answers', icon: MessageSquare },
          { id: 'upvoted', label: 'Upvoted', icon: Heart },
          { id: 'mastery', label: 'Mastery', icon: Zap },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white dark:bg-slate-900 text-brand-primary shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          {activeTab === 'queries' && (
            <motion.div
              key="queries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {myQueries.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-medium">You haven't posted any queries yet.</p>
                  <Link to="/community" className="mt-4 text-brand-primary font-bold hover:underline inline-flex items-center gap-1">
                    Start a discussion <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                myQueries.map(q => (
                  <Link 
                    key={q.id} 
                    to="/community" 
                    className="block p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-primary transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-black group-hover:text-brand-primary transition-colors">{q.title}</h3>
                        <p className="text-slate-500 mt-2 line-clamp-2">{q.content}</p>
                        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {q.createdAt instanceof Timestamp ? q.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {q.votes} votes
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'answers' && (
            <motion.div
              key="answers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {myAnswers.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-medium">You haven't posted any answers yet.</p>
                  <Link to="/community" className="mt-4 text-brand-primary font-bold hover:underline inline-flex items-center gap-1">
                    Help others in the community <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                myAnswers.map(a => (
                  <Link 
                    key={a.id} 
                    to="/community" 
                    className="block p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-primary transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {a.isBest && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded-full text-[10px] uppercase tracking-widest font-black">
                              <CheckCircle2 size={10} />
                              Best Solution
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-400">Answered on query</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">"{a.content}"</p>
                        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {a.createdAt instanceof Timestamp ? a.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {a.votes} votes
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'upvoted' && (
            <motion.div
              key="upvoted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {upvotedQueries.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-medium">You haven't upvoted any queries yet.</p>
                </div>
              ) : (
                upvotedQueries.map(q => (
                  <Link 
                    key={q.id} 
                    to="/community" 
                    className="block p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-primary transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-black group-hover:text-brand-primary transition-colors">{q.title}</h3>
                        <p className="text-slate-500 mt-2 line-clamp-2">{q.content}</p>
                        <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {q.createdAt instanceof Timestamp ? q.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </span>
                          <span className="flex items-center gap-1 text-brand-primary">
                            <ThumbsUp size={12} />
                            {q.votes} votes
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'mastery' && (
            <motion.div
              key="mastery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {completedIds.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-medium">You haven't mastered any algorithms yet.</p>
                  <Link to="/dashboard" className="mt-4 text-brand-primary font-bold hover:underline inline-flex items-center gap-1">
                    Start learning <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                completedIds.map(id => {
                  const algo = ALGORITHM_DATA[id];
                  if (!algo) return null;
                  return (
                    <Link 
                      key={id} 
                      to={`/visualize/all/${id}`}
                      className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-primary transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-black group-hover:text-brand-primary transition-colors">{algo.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Mastered</p>
                      </div>
                      <div className="p-2 bg-green-500/10 text-green-500 rounded-xl">
                        <CheckCircle2 size={20} />
                      </div>
                    </Link>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
