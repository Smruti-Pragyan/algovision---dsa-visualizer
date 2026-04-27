import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Plus, 
  Search, 
  User, 
  Clock,
  ArrowRight,
  LogIn,
  Send,
  AlertCircle,
  Edit,
  Trash2,
  File,
  X,
  Paperclip,
  Download,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { cn } from '../lib/utils';
import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  increment,
  Timestamp,
  where,
  deleteDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, storage } from '../lib/firebase';
import { sendNotification } from '../lib/notifications';

// Error Handling Spec for Firestore Operations
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error?.message || "{}");
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} during ${parsedError.operationType} on ${parsedError.path}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-200 dark:border-red-800">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-black text-red-900 dark:text-red-100">Oops! An error occurred</h2>
          <p className="text-red-700 dark:text-red-300 mt-2 max-w-md">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface Answer {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: any;
  votes: number;
  voters: Record<string, number>;
  isBest: boolean;
}

interface Attachment {
  name: string;
  url: string;
  type: string;
  path: string;
}

interface Query {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorId: string;
  createdAt: any;
  votes: number;
  voters: Record<string, number>;
  answers: Answer[];
  attachments?: Attachment[];
}

const CATEGORIES = [
  'Sorting',
  'Searching',
  'Stacks & Queues',
  'Hashing',
  'Trees',
  'Heaps',
  'Graphs',
  'Dynamic Programming',
  'Backtracking',
  'General'
];

function CommunityContent() {
  const { showToast } = useToast();
  const [queries, setQueries] = useState<Query[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [newQuery, setNewQuery] = useState({ title: '', content: '', category: 'General' });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'votes' | 'activity'>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, attachments?: Attachment[] } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const q = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        answers: [] // Answers will be fetched separately for selected query
      })) as Query[];
      setQueries(queriesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'queries');
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  useEffect(() => {
    if (!selectedQuery || !isAuthReady) return;

    const answersRef = collection(db, 'queries', selectedQuery.id, 'answers');
    const q = query(answersRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const answersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Answer[];
      
      setSelectedQuery(prev => prev ? { ...prev, answers: answersData } : null);
      setQueries(prev => prev.map(q => q.id === selectedQuery.id ? { ...q, answers: answersData } : q));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `queries/${selectedQuery.id}/answers`);
    });

    return () => unsubscribe();
  }, [selectedQuery?.id, isAuthReady]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || 'Anonymous',
          id: user.uid,
          createdAt: serverTimestamp(),
          role: 'user'
        });
      }
      
      showToast(`Welcome, ${user.displayName}!`, 'success');
    } catch (error) {
      console.error(error);
      showToast('Login failed', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  const handlePostQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newQuery.title.trim() || !newQuery.content.trim()) return;

    setIsUploading(true);
    try {
      const attachments: Attachment[] = [];
      
      for (const file of attachedFiles) {
        const filePath = `queries/${user.uid}/${Date.now()}_${file.name}`;
        const fileRef = ref(storage, filePath);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        attachments.push({
          name: file.name,
          url,
          type: file.type,
          path: filePath
        });
      }

      if (isEditing && editingQueryId) {
        await updateDoc(doc(db, 'queries', editingQueryId), {
          title: newQuery.title,
          content: newQuery.content,
          category: newQuery.category,
          attachments: attachments.length > 0 ? attachments : (queries.find(q => q.id === editingQueryId)?.attachments || [])
        });
        showToast('Query updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'queries'), {
          title: newQuery.title,
          content: newQuery.content,
          category: newQuery.category,
          author: user.displayName || 'Anonymous',
          authorId: user.uid,
          createdAt: serverTimestamp(),
          votes: 0,
          voters: {},
          attachments
        });
        showToast('Query posted successfully!', 'success');
      }
      
      setNewQuery({ title: '', content: '', category: 'General' });
      setAttachedFiles([]);
      setIsPosting(false);
      setIsEditing(false);
      setEditingQueryId(null);
    } catch (error) {
      handleFirestoreError(error, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'queries');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteQuery = async (queryId: string, attachments?: Attachment[]) => {
    if (!user) return;

    setIsUploading(true);
    try {
      // Delete attachments from storage
      if (attachments) {
        for (const attachment of attachments) {
          try {
            const fileRef = ref(storage, attachment.path);
            await deleteObject(fileRef);
          } catch (e) {
            console.error("Error deleting file:", e);
          }
        }
      }

      await deleteDoc(doc(db, 'queries', queryId));
      if (selectedQuery?.id === queryId) {
        setSelectedQuery(null);
      }
      showToast('Query deleted successfully!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `queries/${queryId}`);
    } finally {
      setIsUploading(false);
      setDeleteConfirmation(null);
    }
  };

  const startEditing = (query: Query) => {
    setNewQuery({ title: query.title, content: query.content, category: query.category || 'General' });
    setEditingQueryId(query.id);
    setIsEditing(true);
    setIsPosting(true);
  };

  const handleVoteQuery = async (queryId: string, vote: number) => {
    if (!user) {
      showToast('Please login to vote', 'info');
      return;
    }
    
    const queryRef = doc(db, 'queries', queryId);
    try {
      const querySnap = await getDoc(queryRef);
      if (!querySnap.exists()) return;
      
      const data = querySnap.data() as Query;
      const currentVote = data.voters?.[user.uid] || 0;
      let newVotes = data.votes || 0;
      const newVoters = { ...(data.voters || {}) };

      if (currentVote === vote) {
        newVotes -= vote;
        delete newVoters[user.uid];
      } else {
        newVotes = newVotes - currentVote + vote;
        newVoters[user.uid] = vote;
      }

      await updateDoc(queryRef, {
        votes: newVotes,
        voters: newVoters
      });

      // Send notification for upvote
      if (vote === 1 && currentVote !== 1 && data.authorId !== user.uid) {
        await sendNotification(
          data.authorId,
          'upvote',
          'Query Upvoted!',
          `${user.displayName} upvoted your query: "${data.title}"`,
          '/community'
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `queries/${queryId}`);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedQuery || !answerInput.trim()) return;

    try {
      const answersRef = collection(db, 'queries', selectedQuery.id, 'answers');
      await addDoc(answersRef, {
        content: answerInput,
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        votes: 0,
        voters: {},
        isBest: false
      });

      // Send notification to query author
      if (selectedQuery.authorId !== user.uid) {
        await sendNotification(
          selectedQuery.authorId,
          'answer',
          'New Answer!',
          `${user.displayName} answered your query: "${selectedQuery.title}"`,
          '/community'
        );
      }

      setAnswerInput('');
      showToast('Answer posted!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `queries/${selectedQuery.id}/answers`);
    }
  };

  const handleVoteAnswer = async (answerId: string, vote: number) => {
    if (!user || !selectedQuery) {
      showToast('Please login to vote', 'info');
      return;
    }
    
    const answerRef = doc(db, 'queries', selectedQuery.id, 'answers', answerId);
    try {
      const answerSnap = await getDoc(answerRef);
      if (!answerSnap.exists()) return;
      
      const data = answerSnap.data() as Answer;
      const currentVote = data.voters?.[user.uid] || 0;
      let newVotes = data.votes || 0;
      const newVoters = { ...(data.voters || {}) };

      if (currentVote === vote) {
        newVotes -= vote;
        delete newVoters[user.uid];
      } else {
        newVotes = newVotes - currentVote + vote;
        newVoters[user.uid] = vote;
      }

      await updateDoc(answerRef, {
        votes: newVotes,
        voters: newVoters
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `queries/${selectedQuery.id}/answers/${answerId}`);
    }
  };

  const handleMarkBest = async (answerId: string) => {
    if (!user || !selectedQuery) return;
    
    const answerRef = doc(db, 'queries', selectedQuery.id, 'answers', answerId);
    try {
      // Unmark all other answers as best
      const answersRef = collection(db, 'queries', selectedQuery.id, 'answers');
      const q = query(answersRef, where('isBest', '==', true));
      const bestAnswers = await getDocs(q);
      
      for (const bestDoc of bestAnswers.docs) {
        await updateDoc(doc(db, 'queries', selectedQuery.id, 'answers', bestDoc.id), {
          isBest: false
        });
      }

      // Mark selected answer as best
      await updateDoc(answerRef, {
        isBest: true
      });
      
      // Send notification to answer author
      const answerSnap = await getDoc(answerRef);
      if (answerSnap.exists()) {
        const answerData = answerSnap.data() as Answer;
        if (answerData.authorId !== user.uid) {
          await sendNotification(
            answerData.authorId,
            'best_answer',
            'Best Solution!',
            `Your answer to "${selectedQuery.title}" was marked as the best solution!`,
            '/community'
          );
        }
      }

      showToast('Marked as best solution!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `queries/${selectedQuery.id}/answers/${answerId}`);
    }
  };

  const filteredQueries = queries
    .filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           q.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || q.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : Date.now();
        return timeA - timeB;
      }
      if (sortBy === 'votes') {
        return b.votes - a.votes;
      }
      if (sortBy === 'activity') {
        return b.answers.length - a.answers.length;
      }
      return 0;
    });

  if (!isAuthReady) {
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
            <Users className="text-brand-primary" size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Join the Community</h1>
          <p className="text-slate-500 mt-2">Sign in with Google to post queries and interact with fellow students.</p>
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/20">
              <Users className="text-white" size={32} />
            </div>
            Community
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Interact, share knowledge, and solve problems together.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <User size={18} className="text-brand-primary" />
            )}
            <span className="font-bold text-sm">{user.displayName}</span>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:underline font-bold ml-2">Logout</button>
          </div>
          <button 
            onClick={() => {
              setIsPosting(true);
              setIsEditing(false);
              setEditingQueryId(null);
              setNewQuery({ title: '', content: '', category: 'General' });
              setAttachedFiles([]);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus size={20} />
            Post Query
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar / List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="votes">Most Upvoted</option>
                  <option value="activity">Most Active</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredQueries.map(query => (
              <motion.div
                key={query.id}
                layoutId={query.id}
                onClick={() => setSelectedQuery(query)}
                className={cn(
                  "p-5 rounded-3xl border transition-all cursor-pointer group",
                  selectedQuery?.id === query.id 
                    ? "bg-brand-primary/5 border-brand-primary shadow-lg shadow-brand-primary/5" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-primary/50"
                )}
              >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-md">
                          {query.category || 'General'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors line-clamp-1">{query.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{query.content}</p>
                    </div>
                  <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl min-w-[40px]">
                    <span className="text-xs font-black text-brand-primary">{query.votes}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Votes</span>
                  </div>
                </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <User size={12} />
                        {query.author}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <MessageSquare size={12} />
                        {query.answers.length}
                      </div>
                    </div>
                    {query.attachments && query.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-brand-primary">
                        <Paperclip size={12} />
                        <span className="text-[10px] font-black">{query.attachments.length}</span>
                      </div>
                    )}
                  </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content / Detail */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {isPosting ? (
              <motion.div
                key="posting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl"
              >
                <h2 className="text-2xl font-black mb-6">{isEditing ? 'Edit Query' : 'Create New Query'}</h2>
                <form onSubmit={handlePostQuery} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                    <input 
                      type="text" 
                      value={newQuery.title}
                      onChange={(e) => setNewQuery({...newQuery, title: e.target.value})}
                      placeholder="What's your question?"
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select 
                      value={newQuery.category}
                      onChange={(e) => setNewQuery({...newQuery, category: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content</label>
                    <textarea 
                      value={newQuery.content}
                      onChange={(e) => setNewQuery({...newQuery, content: e.target.value})}
                      placeholder="Explain your query in detail..."
                      rows={6}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Attachments</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {attachedFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                          <File size={14} className="text-brand-primary" />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button 
                            type="button"
                            onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                      <Paperclip size={20} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-500">Attach Files</span>
                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files) {
                            setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsPosting(false);
                        setIsEditing(false);
                        setEditingQueryId(null);
                      }}
                      className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isUploading}
                      className="px-8 py-2.5 bg-brand-primary hover:bg-brand-dark disabled:bg-brand-secondary text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                    >
                      {isUploading ? <RotateCcw className="animate-spin" size={18} /> : <Send size={18} />}
                      {isEditing ? 'Update Query' : 'Post Query'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : selectedQuery ? (
              <motion.div
                key={selectedQuery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Query Header */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-brand-primary/20 dark:border-brand-primary/10 p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="relative flex gap-8">
                    <div className="flex flex-col items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 h-fit">
                      <button 
                        onClick={() => handleVoteQuery(selectedQuery.id, 1)}
                        className={cn(
                          "p-3 rounded-xl transition-all shadow-sm",
                          selectedQuery.voters?.[user.uid] === 1 ? "bg-brand-primary text-white shadow-brand-primary/20" : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                        )}
                      >
                        <ThumbsUp size={24} />
                      </button>
                      <span className="font-black text-2xl text-slate-900 dark:text-white">{selectedQuery.votes}</span>
                      <button 
                        onClick={() => handleVoteQuery(selectedQuery.id, -1)}
                        className={cn(
                          "p-3 rounded-xl transition-all shadow-sm",
                          selectedQuery.voters?.[user.uid] === -1 ? "bg-red-500 text-white shadow-red-500/20" : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                        )}
                      >
                        <ThumbsDown size={24} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                            {selectedQuery.category || 'General'}
                          </span>
                          <div className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span className="text-xs font-bold text-slate-400">Query ID: {selectedQuery.id.slice(0, 8)}</span>
                        </div>
                        {selectedQuery.authorId === user.uid && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => startEditing(selectedQuery)}
                              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                              title="Edit Query"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmation({ id: selectedQuery.id, attachments: selectedQuery.attachments })}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                              title="Delete Query"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                      <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{selectedQuery.title}</h2>
                      <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black">
                            {selectedQuery.author[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Posted By</span>
                            <span className="text-slate-900 dark:text-white font-bold">{selectedQuery.author}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <Clock size={18} className="text-brand-secondary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Date Posted</span>
                            <span className="text-slate-900 dark:text-white font-bold">
                              {selectedQuery.createdAt instanceof Timestamp ? selectedQuery.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-10 text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedQuery.content}
                      </div>

                      {selectedQuery.attachments && selectedQuery.attachments.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Paperclip size={16} />
                            Attachments ({selectedQuery.attachments.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedQuery.attachments.map((file, i) => (
                              <a 
                                key={i}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-primary transition-all group/file"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-brand-primary">
                                    <File size={20} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{file.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{file.type.split('/')[1] || 'FILE'}</span>
                                  </div>
                                </div>
                                <Download size={18} className="text-slate-300 group-hover/file:text-brand-primary transition-colors" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answers List */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <MessageSquare className="text-brand-primary" size={20} />
                    {selectedQuery.answers.length} Answers
                  </h3>
                  
                  {selectedQuery.answers.sort((a, b) => (a.isBest ? -1 : 1) || b.votes - a.votes).map(answer => (
                    <div 
                      key={answer.id}
                      className={cn(
                        "bg-white dark:bg-slate-900 rounded-3xl border p-6 shadow-md transition-all",
                        answer.isBest ? "border-brand-accent ring-1 ring-brand-accent/20" : "border-slate-200 dark:border-slate-800"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <button 
                            onClick={() => handleVoteAnswer(answer.id, 1)}
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              answer.voters?.[user.uid] === 1 ? "bg-brand-primary text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                            )}
                          >
                            <ThumbsUp size={16} />
                          </button>
                          <span className="font-bold text-sm">{answer.votes}</span>
                          <button 
                            onClick={() => handleVoteAnswer(answer.id, -1)}
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              answer.voters?.[user.uid] === -1 ? "bg-red-500 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                            )}
                          >
                            <ThumbsDown size={16} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <User size={12} className="text-brand-secondary" />
                              {answer.author}
                              {answer.isBest && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded-full text-[10px] uppercase tracking-widest">
                                  <CheckCircle2 size={10} />
                                  Best Solution
                                </span>
                              )}
                            </div>
                            {selectedQuery.authorId === user.uid && !answer.isBest && (
                              <button 
                                onClick={() => handleMarkBest(answer.id)}
                                className="text-[10px] font-bold text-slate-400 hover:text-brand-accent transition-colors uppercase tracking-widest flex items-center gap-1"
                              >
                                <CheckCircle2 size={12} />
                                Mark Best
                              </button>
                            )}
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {answer.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Post Answer */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
                  <h3 className="text-lg font-black mb-4">Your Answer</h3>
                  <form onSubmit={handlePostAnswer} className="space-y-4">
                    <textarea 
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="Share your solution or thoughts..."
                      rows={4}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium resize-none"
                      required
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-8 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
                      >
                        <Send size={18} />
                        Post Answer
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-xl mb-6">
                  <MessageSquare className="text-brand-primary opacity-20" size={64} />
                </div>
                <h2 className="text-2xl font-black text-slate-400">Select a query to view details</h2>
                <p className="text-slate-500 mt-2 max-w-sm">Or start a new discussion by clicking the "Post Query" button above.</p>
                <button 
                  onClick={() => setIsPosting(true)}
                  className="mt-8 flex items-center gap-2 px-6 py-3 text-brand-primary font-bold hover:bg-brand-primary/10 rounded-2xl transition-all"
                >
                  Start a Discussion
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black mb-2">Delete Query?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to delete this query? This action cannot be undone and all attachments will be permanently removed.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteQuery(deleteConfirmation.id, deleteConfirmation.attachments)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20"
                >
                  {isUploading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Community() {
  return (
    <ErrorBoundary>
      <CommunityContent />
    </ErrorBoundary>
  );
}
