import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  Map as MapIcon, 
  BookOpen, 
  Users, 
  User, 
  Settings, 
  Bell,
  Menu,
  X,
  ChevronRight,
  LogOut,
  LogIn
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import NotificationCenter from '../NotificationCenter';
import SettingsDropdown from '../SettingsDropdown';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { to: '/roadmap', label: 'Roadmap', icon: MapIcon, color: 'text-brand-primary' },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-brand-secondary' },
    { to: '/resources', label: 'Resources', icon: BookOpen, color: 'text-brand-accent' },
    { to: '/community', label: 'Community', icon: Users, color: 'text-brand-primary' },
    { to: '/playground', label: 'Playground', icon: Code2, color: 'text-brand-secondary' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-serif italic font-black text-slate-900 dark:text-white tracking-tighter transition-all group-hover:tracking-normal">
              Algo
            </span>
            <span className="text-2xl font-serif font-black text-brand-primary dark:text-brand-accent tracking-tighter transition-all group-hover:tracking-normal">
              Vision
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 group",
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <link.icon size={16} className={cn("transition-transform group-hover:scale-110", link.color)} />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[18px] left-0 right-0 h-1 bg-brand-primary rounded-t-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            {user && (
              <Link
                to="/profile"
                title="Your Profile"
                className="hidden md:flex items-center gap-2 pl-2 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-brand-primary/30 transition-all hover:shadow-sm"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[10px] font-black">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.displayName || 'Profile'}</span>
              </Link>
            )}

            <div className="flex items-center gap-1 ml-2">
              {user && <NotificationCenter />}
              <SettingsDropdown />
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl font-bold transition-all",
                    location.pathname === link.to
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  <link.icon size={20} className={link.color} />
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all"
                    >
                      <User size={20} className="text-brand-primary" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all"
                    >
                      <Settings size={20} className="text-slate-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-4 text-brand-primary font-bold hover:bg-brand-primary/5 rounded-2xl transition-all"
                  >
                    <LogIn size={20} />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
