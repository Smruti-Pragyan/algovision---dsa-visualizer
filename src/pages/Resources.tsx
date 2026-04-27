import React from 'react';
import { motion } from 'motion/react';
import { 
  ExternalLink, 
  BookOpen, 
  Youtube, 
  Code2, 
  Globe, 
  Library, 
  GraduationCap,
  Search,
  ChevronRight
} from 'lucide-react';

const RESOURCE_CATEGORIES = [
  {
    title: "Learning Platforms",
    icon: <GraduationCap className="text-brand-primary" />,
    resources: [
      { name: "LeetCode", url: "https://leetcode.com", description: "The best platform to practice coding interviews.", type: "Practice" },
      { name: "GeeksforGeeks", url: "https://geeksforgeeks.org", description: "A computer science portal with extensive DSA articles.", type: "Articles" },
      { name: "HackerRank", url: "https://hackerrank.com", description: "Practice coding, prepare for interviews, and get hired.", type: "Practice" },
      { name: "Codeforces", url: "https://codeforces.com", description: "Competitive programming platform with regular contests.", type: "Competitive" }
    ]
  },
  {
    title: "Video Tutorials",
    icon: <Youtube className="text-red-500" />,
    resources: [
      { name: "Striver's A2Z DSA Course", url: "https://takeuforward.org/strivers-a2z-dsa-course-sheet-2-0", description: "Comprehensive roadmap and video series for DSA.", type: "Course" },
      { name: "FreeCodeCamp DSA", url: "https://www.youtube.com/watch?v=8hly31xKli0", description: "Full Data Structures and Algorithms course on YouTube.", type: "Video" },
      { name: "Abdul Bari's Algorithms", url: "https://www.youtube.com/@abdul_bari", description: "Master algorithms with simplified explanations.", type: "Video" },
      { name: "NeetCode", url: "https://neetcode.io", description: "Visual explanations of LeetCode problems.", type: "Video" }
    ]
  },
  {
    title: "Documentation & Books",
    icon: <Library className="text-emerald-500" />,
    resources: [
      { name: "Introduction to Algorithms (CLRS)", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", description: "The definitive textbook on algorithms.", type: "Book" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Excellent documentation for JavaScript and web technologies.", type: "Docs" },
      { name: "Visualgo", url: "https://visualgo.net", description: "Visualizing data structures and algorithms through animation.", type: "Visual" },
      { name: "CP-Algorithms", url: "https://cp-algorithms.com", description: "Articles on competitive programming algorithms.", type: "Articles" }
    ]
  },
  {
    title: "Interview Preparation",
    icon: <Search className="text-purple-500" />,
    resources: [
      { name: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org", description: "Curated interview preparation materials for busy engineers.", type: "Guide" },
      { name: "Pramp", url: "https://www.pramp.com", description: "Practice mock interviews with peers.", type: "Mock" },
      { name: "InterviewBit", url: "https://www.interviewbit.com", description: "Gamified platform for interview preparation.", type: "Practice" },
      { name: "Blind 75 List", url: "https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-Oghf0FiI", description: "The most important 75 LeetCode questions.", type: "List" }
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/20">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Learning <span className="text-brand-primary">Resources</span>
            </h1>
          </motion.div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
            A curated collection of the best external materials to help you master Data Structures and Algorithms.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RESOURCE_CATEGORIES.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {category.title}
                </h2>
              </div>

              <div className="grid gap-4">
                {category.resources.map((resource, resIdx) => (
                  <motion.a
                    key={resIdx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 10 }}
                    className="group flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-brand-primary/50 hover:shadow-xl hover:shadow-brand-primary/5 transition-all"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-brand-accent/10 dark:group-hover:bg-brand-primary/20 transition-colors">
                      <Globe className="text-slate-400 group-hover:text-brand-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-dark transition-colors">
                          {resource.name}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {resource.description}
                      </p>
                    </div>
                    <div className="self-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} className="text-brand-primary" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contribution CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-gradient-to-r from-brand-primary to-brand-dark rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl shadow-brand-primary/20"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-4 tracking-tight">Know a great resource?</h2>
            <p className="text-brand-accent/80 mb-8 max-w-xl mx-auto font-medium">
              Help the community by suggesting high-quality learning materials. We're always looking to expand our collection.
            </p>
            <button className="px-8 py-4 bg-white text-brand-primary font-black rounded-2xl hover:bg-brand-accent/10 transition-all shadow-xl active:scale-95 flex items-center gap-2 mx-auto">
              Suggest a Resource
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
