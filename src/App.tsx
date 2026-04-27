import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import Playground from './pages/Playground';
import Roadmap from './pages/Roadmap';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Navbar from './components/layout/Navbar';
import AITutor from './components/AITutor';
import { ToastProvider } from './components/Toast';

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Guest user: reset progress on refresh
        localStorage.removeItem('algo_progress');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/visualize/:category/:algorithm" element={<Visualizer />} />
              <Route path="/playground" element={<Playground />} />
            </Routes>
          </main>
          <AITutor />
        </div>
      </Router>
    </ToastProvider>
  );
}
