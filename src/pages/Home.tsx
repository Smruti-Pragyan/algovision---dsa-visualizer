import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Code2, Layers, Share2, User, Zap } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Home() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl space-y-6"
      >
        <h1 className="text-6xl md:text-8xl font-serif italic font-black tracking-tighter text-slate-900 dark:text-white">
          Algo<span className="text-brand-primary dark:text-brand-accent not-italic">Vision</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Master Data Structures and Algorithms through interactive, step-by-step visual animations. 
          Designed for students, developers, and competitive programmers.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Link
            to="/dashboard"
            className="px-10 py-5 bg-brand-primary hover:bg-brand-dark text-white rounded-full font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-brand-primary/30 active:scale-95"
          >
            Start Visualizing <ArrowRight size={22} />
          </Link>
          {user && (
            <Link
              to="/profile"
              className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-full font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl active:scale-95"
            >
              <User size={22} className="text-brand-primary" />
              My Profile
            </Link>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard
          icon={<Layers className="text-vibrant-cyan" />}
          title="Multiple Categories"
          description="Sorting, Searching, Trees, and Graphs. All in one place."
        />
        <FeatureCard
          icon={<Code2 className="text-brand-primary" />}
          title="Interactive Controls"
          description="Adjust speed, step through, pause, and resume animations."
        />
        <FeatureCard
          icon={<Share2 className="text-brand-secondary" />}
          title="Deep Learning"
          description="Understand time and space complexity with pseudocode."
        />
      </div>

      {!user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl w-full p-12 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 dark:from-brand-primary/20 dark:to-brand-secondary/20 rounded-[3rem] border-2 border-brand-primary/20 dark:border-brand-primary/40 text-center space-y-8 shadow-2xl"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Unlock Full Access</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Create a profile to track your progress, save your favorite algorithms, and join the community discussions. 
              Guest users can still explore, but your learning journey won't be saved.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl">
              <div className="mt-1 p-2 bg-brand-primary text-white rounded-xl">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="font-bold">Progress Tracking</h4>
                <p className="text-sm text-slate-500">See exactly which algorithms you've mastered.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl">
              <div className="mt-1 p-2 bg-brand-secondary text-white rounded-xl">
                <User size={18} />
              </div>
              <div>
                <h4 className="font-bold">Community Profile</h4>
                <p className="text-sm text-slate-500">Ask questions and help others in the community.</p>
              </div>
            </div>
          </div>
          <Link
            to="/community"
            className="inline-flex px-12 py-5 bg-brand-primary hover:bg-brand-dark text-white rounded-full font-black text-lg transition-all transform hover:scale-105 shadow-xl shadow-brand-primary/20 active:scale-95"
          >
            Create My Profile Now
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
    </motion.div>
  );
}
