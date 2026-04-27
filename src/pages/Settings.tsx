import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  HelpCircle, 
  Shield, 
  Bell, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2,
  AlertCircle,
  Mail,
  Info,
  User as UserIcon,
  LogOut,
  Camera,
  Trash2
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { cn } from '../lib/utils';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut, updateProfile } from 'firebase/auth';
import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I post a query in the community?",
    answer: "Go to the Community page, sign in with your Google account, and click the 'Post Query' button. Provide a clear title and detailed description of your problem."
  },
  {
    question: "What makes a good query?",
    answer: "Include the algorithm you're working on, the specific part you're struggling with, and any code snippets if applicable. Clear, concise questions get faster and better answers."
  },
  {
    question: "How does the voting system work?",
    answer: "Upvote queries or answers that are helpful and high-quality. Downvote content that is incorrect or off-topic. This helps the community highlight the best solutions."
  },
  {
    question: "How can I mark an answer as the best solution?",
    answer: "If you are the author of a query, you will see a 'Mark Best' button on each answer. Clicking this will highlight that answer as the definitive solution for your query."
  },
  {
    question: "My query was deleted. Why?",
    answer: "Queries may be removed if they violate community guidelines, such as being spam, offensive, or completely unrelated to Data Structures and Algorithms."
  }
];

export default function Settings() {
  const { showToast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'help' | 'support' | 'privacy' | 'about'>('profile');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reportType, setReportType] = useState<'bug' | 'content' | 'other'>('bug');
  const [reportContent, setReportContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setNewName(firebaseUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;

    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: newName });
      // Update in Firestore as well if needed
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { username: newName });
      
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsUpdatingProfile(false);
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeletingAccount(true);
    try {
      // Delete user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      
      // Delete user from Firebase Auth
      await user.delete();
      
      showToast('Account deleted successfully.', 'success');
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        showToast('Please sign in again to delete your account.', 'error');
      } else {
        showToast('Failed to delete account.', 'error');
      }
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        type: reportType,
        content: reportContent,
        authorId: auth.currentUser?.uid || 'anonymous',
        authorEmail: auth.currentUser?.email || 'anonymous',
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setReportContent('');
      showToast('Your report has been submitted. Thank you!', 'success');
    } catch (error) {
      console.error("Error submitting report:", error);
      showToast('Failed to submit report. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/20">
          <SettingsIcon className="text-white" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Settings & Help</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your experience and get support for community queries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: UserIcon, activeColor: 'bg-brand-primary/10 text-brand-primary' },
            { id: 'help', label: 'Help & FAQ', icon: HelpCircle, activeColor: 'bg-brand-secondary/10 text-brand-secondary' },
            { id: 'support', label: 'Report an Issue', icon: MessageSquare, activeColor: 'bg-brand-accent/10 text-brand-accent' },
            { id: 'privacy', label: 'Privacy & Safety', icon: Shield, activeColor: 'bg-brand-dark/10 text-brand-dark' },
            { id: 'about', label: 'About Platform', icon: Info, activeColor: 'bg-brand-primary/10 text-brand-primary' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left",
                activeSection === item.id
                  ? `${item.activeColor} shadow-sm`
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 space-y-12">
          {activeSection === 'profile' && (
            <section className="space-y-8">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <UserIcon className="text-brand-primary" size={24} />
                Profile Settings
              </h2>
              
              {!user ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <UserIcon size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Please sign in to manage your profile.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-lg">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-3xl font-black">
                            {user.displayName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-brand-primary text-white rounded-full shadow-lg hover:scale-110 transition-all">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-black">{user.displayName || 'Anonymous User'}</h3>
                      <p className="text-slate-500 font-medium">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                        Verified Account
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                        <input 
                          type="text" 
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={user.email || ''}
                          disabled
                          className="w-full px-5 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isUpdatingProfile || newName === user.displayName}
                      className="px-8 py-3 bg-brand-primary hover:bg-brand-dark disabled:bg-slate-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
                    >
                      {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
                    </button>
                  </form>

                  <div className="pt-8 border-t border-red-100 dark:border-red-900/30 space-y-6">
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle size={20} />
                      <h4 className="text-sm font-black uppercase tracking-widest">Danger Zone</h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold transition-all"
                      >
                        <LogOut size={20} />
                        Sign Out
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl font-bold transition-all"
                      >
                        <Trash2 size={20} />
                        Delete Account
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showDeleteConfirm && (
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
                          <h3 className="text-2xl font-black mb-2">Delete Account?</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            This action is permanent and will delete all your progress, queries, and account data. You cannot undo this.
                          </p>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => setShowDeleteConfirm(false)}
                              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleDeleteAccount}
                              disabled={isDeletingAccount}
                              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20"
                            >
                              {isDeletingAccount ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </section>
          )}

          {activeSection === 'help' && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <HelpCircle className="text-brand-secondary" size={24} />
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button 
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          <div className="p-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'support' && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <MessageSquare className="text-brand-accent" size={24} />
                Report an Issue
              </h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                <p className="text-slate-500 mb-6 font-medium">
                  Encountered a bug or found inappropriate content in a query? Let us know and we'll look into it.
                </p>
                <form onSubmit={handleReportSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {(['bug', 'content', 'other'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReportType(type)}
                        className={cn(
                          "py-2 rounded-xl font-bold text-sm border transition-all capitalize",
                          reportType === type 
                            ? "bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm" 
                            : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Details</label>
                    <textarea 
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                      placeholder="Describe the problem in detail..."
                      rows={4}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium resize-none"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-brand-primary hover:bg-brand-dark disabled:bg-slate-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Report
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>
          )}

          {activeSection === 'privacy' && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Shield className="text-brand-dark" size={24} />
                Privacy & Safety
              </h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Data Protection</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Your learning progress and community interactions are securely stored. We use industry-standard encryption to protect your personal information.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">Community Guidelines</h3>
                  <p className="text-slate-500 leading-relaxed">
                    We maintain a safe learning environment. Inappropriate content, harassment, or spam will result in immediate account suspension.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'about' && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <Info className="text-slate-400" size={24} />
                About Platform
              </h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">AlgoVision v1.0.0</h3>
                  <p className="text-slate-500 leading-relaxed">
                    AlgoVision is an interactive platform designed to help students master Data Structures and Algorithms through visualization and community support.
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium">© 2026 AlgoVision Education</span>
                  <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 font-bold">STABLE RELEASE</span>
                </div>
              </div>
            </section>
          )}

          {/* Contact Info */}
          <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
              <Mail className="text-brand-primary" size={24} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-black">Still need help?</h3>
              <p className="text-sm text-slate-500">Contact our support team at <span className="text-brand-primary font-bold">support@algovision.edu</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
