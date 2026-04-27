import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Moon, 
  Sun, 
  HelpCircle, 
  MessageSquare, 
  Shield, 
  Info, 
  LogOut,
  ChevronRight,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './Toast';

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'support' | 'faq'>('main');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [reportContent, setReportContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTimeout(() => setView('main'), 300);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      showToast('Logged out successfully', 'success');
      navigate('/');
    } catch (error) {
      showToast('Logout failed', 'error');
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        type: 'quick-support',
        content: reportContent,
        authorId: auth.currentUser?.uid || 'anonymous',
        authorEmail: auth.currentUser?.email || 'anonymous',
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setReportContent('');
      showToast('Support request sent!', 'success');
      setView('main');
    } catch (error) {
      showToast('Failed to send request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: "How to post?", a: "Go to Community and click 'Post Query'." },
    { q: "Is it free?", a: "Yes, AlgoVision is free for all students." },
    { q: "Dark mode?", a: "Toggle it right here in settings!" }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all",
          isOpen && "bg-slate-100 dark:bg-slate-800 rotate-90"
        )}
        title="Settings"
      >
        <SettingsIcon size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50"
          >
            <AnimatePresence mode="wait">
              {view === 'main' && (
                <motion.div
                  key="main"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  {/* User Profile Header */}
                  {user ? (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black">
                              {user.displayName?.[0] || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {user.displayName || 'User'}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 text-center bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-500">Sign in to sync progress</p>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsOpen(false)}
                        className="mt-2 inline-block px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-dark transition-all"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}

                  {/* Theme Toggle */}
                  <div className="p-2">
                    <button
                      onClick={() => setIsDark(!isDark)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl transition-colors",
                          isDark ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-600"
                        )}>
                          {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                          {isDark ? 'Light Mode' : 'Dark Mode'}
                        </span>
                      </div>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        isDark ? "bg-brand-primary" : "bg-slate-200 dark:bg-slate-700"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                          isDark ? "right-1" : "left-1"
                        )} />
                      </div>
                    </button>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">My Profile</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      onClick={() => setView('faq')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-secondary/10 text-brand-secondary">
                          <HelpCircle size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Help & FAQ</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => setView('support')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-accent/10 text-brand-accent">
                          <MessageSquare size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Quick Support</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-dark/10 text-brand-dark">
                          <Shield size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Privacy & About</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Logout */}
                  {user && (
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                      >
                        <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20">
                          <LogOut size={16} />
                        </div>
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {view === 'support' && (
                <motion.div
                  key="support"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setView('main')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <h4 className="font-black text-sm">Quick Support</h4>
                  </div>
                  <form onSubmit={handleReportSubmit} className="space-y-3">
                    <textarea
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                      placeholder="How can we help?"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                      rows={4}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={14} /> Send Request</>}
                    </button>
                  </form>
                </motion.div>
              )}

              {view === 'faq' && (
                <motion.div
                  key="faq"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setView('main')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <h4 className="font-black text-sm">Quick FAQ</h4>
                  </div>
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">{faq.q}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{faq.a}</p>
                      </div>
                    ))}
                    <Link 
                      to="/settings" 
                      onClick={() => setIsOpen(false)}
                      className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors pt-2"
                    >
                      View All FAQ
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
