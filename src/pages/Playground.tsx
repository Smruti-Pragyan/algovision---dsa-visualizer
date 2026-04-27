import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, Code2, ChevronDown, Copy, Check, Trash2, HelpCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { useToast } from '../components/Toast';

const DEFAULT_CODES: Record<string, string> = {
  javascript: `// JavaScript Example
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`,
  python: `# Python Example
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
  cpp: `// C++ Example
#include <iostream>
#include <vector>
#include <algorithm>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    for (int x : arr) std::cout << x << " ";
    return 0;
}`,
  java: `// Java Example
import java.util.Arrays;

public class Main {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
  c: `// C Example
#include <stdio.h>

void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(&arr[j], &arr[j+1]);
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    for (int i=0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
  csharp: `// C# Example
using System;

class Program {
    static void BubbleSort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }

    static void Main() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        BubbleSort(arr);
        Console.WriteLine(string.Join(", ", arr));
    }
}`,
  go: `// Go Example
package main

import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func main() {
    arr := []int{64, 34, 25, 12, 22, 11, 90}
    bubbleSort(arr)
    fmt.Println(arr)
}`
};

const SNIPPETS: Record<string, Record<string, string>> = {
  'Bubble Sort': DEFAULT_CODES,
  'Quick Sort': {
    javascript: `// Quick Sort Example
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let pivot = arr[arr.length - 1];
  let left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
console.log(quickSort([64, 34, 25, 12, 22, 11, 90]));`,
    python: `# Quick Sort Example
def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) - 1]
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)
print(quick_sort([64, 34, 25, 12, 22, 11, 90]))`,
  },
  'Binary Search': {
    javascript: `// Binary Search Example
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
console.log(binarySearch([11, 12, 22, 25, 34, 64, 90], 25));`,
    python: `# Binary Search Example
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        if arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1
print(binary_search([11, 12, 22, 25, 34, 64, 90], 25))`,
  },
  'Fibonacci': {
    javascript: `// Fibonacci Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));`,
    python: `# Fibonacci Example
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n - 1) + fibonacci(n - 2)
print(fibonacci(10))`,
  }
};

export default function Playground() {
  const { showToast } = useToast();
  const [code, setCode] = useState(DEFAULT_CODES.java);
  const [language, setLanguage] = useState('java');
  const [snippet, setSnippet] = useState('Bubble Sort');
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorData, setErrorData] = useState<{ message: string; line?: number; suggestion?: string } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setIsError(false);
    setErrorData(null);
    setOutput('Running code...\n');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Simulate the execution of the following ${language} code. 
        
        Code:
        ${code}`,
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
        setIsError(true);
        setErrorData(result.error || { message: 'An unknown error occurred during simulation.' });
        setOutput('');
      } else {
        setIsError(false);
        setOutput(result.stdout || 'No output.');
      }
    } catch (error) {
      setIsError(true);
      setErrorData({
        message: 'The simulation service is currently unavailable or returned an invalid response. Please check your connection or try again later.',
        suggestion: 'This might be due to a temporary API issue or an invalid code structure that the AI couldn\'t parse.'
      });
      setOutput('');
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    showToast('Output copied to clipboard!', 'success');
  };

  const resetCode = () => {
    setCode(DEFAULT_CODES[language]);
    setOutput('');
  };

  const handleLangChange = (lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODES[lang]);
    setOutput('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/20">
              <Code2 className="text-white" size={32} />
            </div>
            Code Playground
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Write, test, and simulate algorithms in real-time.</p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <select
              value={snippet}
              onChange={(e) => {
                const newSnippet = e.target.value;
                setSnippet(newSnippet);
                const snippetCode = SNIPPETS[newSnippet][language] || SNIPPETS[newSnippet]['javascript'] || SNIPPETS[newSnippet]['python'];
                if (snippetCode) setCode(snippetCode);
                setOutput('');
              }}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 pr-12 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer hover:border-brand-primary shadow-sm"
            >
              {Object.keys(SNIPPETS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-brand-primary transition-colors" size={18} />
          </div>

          <div className="relative group">
            <select
              value={language}
              onChange={(e) => handleLangChange(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 pr-12 rounded-2xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer hover:border-brand-primary shadow-sm"
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="csharp">C#</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-brand-primary transition-colors" size={18} />
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            {copied ? <Check size={18} className="text-brand-accent" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-8 py-2.5 bg-brand-primary hover:bg-brand-dark disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-primary/30 active:scale-95"
          >
            {isRunning ? <RotateCcw className="animate-spin" size={18} /> : <Play size={18} />}
            Run Code
          </button>

          <button
            onClick={resetCode}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all group shadow-sm"
            title="Reset Code"
          >
            <RotateCcw size={22} className="group-hover:text-red-500 transition-colors" />
          </button>

          <button
            onClick={() => setOutput('')}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all group shadow-sm"
            title="Clear Console"
          >
            <Trash2 size={22} className="group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
        {/* Editor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 flex flex-col bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl ring-1 ring-white/5"
        >
          <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-brand-primary/10 text-brand-accent rounded text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                {language}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language === 'csharp' ? 'csharp' : language === 'c' ? 'c' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 15,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                lineNumbers: 'on',
                folding: true,
                glyphMargin: false,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
              }}
            />
          </div>
        </motion.div>

        {/* Console */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 flex flex-col bg-[#010409] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl ring-1 ring-white/5"
        >
          <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={16} className="text-brand-primary" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output Console</span>
            </div>
            {output && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={copyOutput}
                  className="text-[10px] font-bold text-slate-500 hover:text-brand-primary transition-colors uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Copy size={12} />
                  Copy
                </button>
                <button 
                  onClick={() => setOutput('')}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 font-mono text-sm overflow-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {isRunning ? (
                <motion.div
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-brand-accent"
                >
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                  Executing code...
                </motion.div>
              ) : isError && errorData ? (
                <motion.div
                  key="error"
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
                        {errorData.line && (
                          <span className="bg-red-500/20 px-1.5 py-0.5 rounded mr-2 text-[10px] font-black">LINE {errorData.line}</span>
                        )}
                        {errorData.message}
                      </p>
                    </div>
                    
                    {errorData.suggestion && (
                      <div className="mt-4 pt-4 border-t border-red-500/10">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-1 bg-brand-primary text-white rounded-md">
                            <Zap size={14} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Suggested Fix</span>
                            <p className="text-sm text-slate-400 italic leading-relaxed">
                              {errorData.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-pre-wrap leading-relaxed text-slate-300"
                >
                  {output}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-600 italic flex flex-col items-center justify-center h-full gap-4"
                >
                  <Terminal size={48} className="opacity-10" />
                  <p>Click "Run Code" to see the output</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-4 bg-slate-900/30 border-t border-slate-800">
          </div>
        </motion.div>
      </div>
    </div>
  );
}
