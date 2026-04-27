import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Plus, RotateCcw } from 'lucide-react';

interface HeapVisualizerProps {
  algorithm?: string;
  onComplete?: () => void;
  speed?: number;
  onStepChange?: (step: number, total: number) => void;
}

interface HeapVisualizerProps {
  algorithm?: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

interface HeapStep {
  heap: number[];
  highlightedIndices: number[];
}

export default function HeapVisualizer({ 
  algorithm, 
  onComplete, 
  speed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: HeapVisualizerProps) {
  const [heap, setHeap] = useState<number[]>([]);
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [inputValue, setInputValue] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDelay = () => (101 - speed) * 10;

  useEffect(() => {
    if (!isPaused && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        onStepChange?.(currentStep + 1, steps.length - 1);
      }, getDelay());
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, currentStep, steps.length, speed, onStepChange]);

  const generateSteps = (initialHeap: number[], operation: 'insert' | 'extract', val?: number) => {
    const generatedSteps: HeapStep[] = [{
      heap: [...initialHeap],
      highlightedIndices: []
    }];

    const record = (h: number[], high: number[]) => {
      generatedSteps.push({
        heap: [...h],
        highlightedIndices: [...high]
      });
    };

    if (operation === 'insert' && val !== undefined) {
      const newHeap = [...initialHeap, val];
      record(newHeap, [newHeap.length - 1]);
      
      let index = newHeap.length - 1;
      while (index > 0) {
        let parentIndex = Math.floor((index - 1) / 2);
        record(newHeap, [index, parentIndex]);
        if (newHeap[parentIndex] >= newHeap[index]) break;
        [newHeap[parentIndex], newHeap[index]] = [newHeap[index], newHeap[parentIndex]];
        index = parentIndex;
        record(newHeap, [index]);
      }
    } else if (operation === 'extract' && initialHeap.length > 0) {
      const newHeap = [...initialHeap];
      const lastIdx = newHeap.length - 1;
      record(newHeap, [0, lastIdx]);
      [newHeap[0], newHeap[lastIdx]] = [newHeap[lastIdx], newHeap[0]];
      newHeap.pop();
      record(newHeap, []);
      
      if (newHeap.length > 0) {
        let index = 0;
        while (true) {
          let left = 2 * index + 1;
          let right = 2 * index + 2;
          let largest = index;
          let high = [index];
          if (left < newHeap.length) high.push(left);
          if (right < newHeap.length) high.push(right);
          record(newHeap, high);

          if (left < newHeap.length && newHeap[left] > newHeap[largest]) largest = left;
          if (right < newHeap.length && newHeap[right] > newHeap[largest]) largest = right;

          if (largest === index) break;
          [newHeap[index], newHeap[largest]] = [newHeap[largest], newHeap[index]];
          index = largest;
          record(newHeap, [index]);
        }
      }
    }

    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  const handleInsert = () => {
    if (inputValue === '') return;
    generateSteps(heap, 'insert', parseInt(inputValue));
    setHeap(prev => {
      const next = [...prev, parseInt(inputValue)];
      // Bubble up logic for final state
      let idx = next.length - 1;
      while (idx > 0) {
        let p = Math.floor((idx - 1) / 2);
        if (next[p] >= next[idx]) break;
        [next[p], next[idx]] = [next[idx], next[p]];
        idx = p;
      }
      return next;
    });
    setInputValue('');
  };

  const handleExtract = () => {
    if (heap.length === 0) return;
    generateSteps(heap, 'extract');
    setHeap(prev => {
      const next = [...prev];
      if (next.length <= 1) return [];
      next[0] = next.pop()!;
      // Bubble down logic for final state
      let idx = 0;
      while (true) {
        let l = 2 * idx + 1;
        let r = 2 * idx + 2;
        let lg = idx;
        if (l < next.length && next[l] > next[lg]) lg = l;
        if (r < next.length && next[r] > next[lg]) lg = r;
        if (lg === idx) break;
        [next[idx], next[lg]] = [next[lg], next[idx]];
        idx = lg;
      }
      return next;
    });
  };

  const reset = () => {
    setHeap([]);
    setSteps([]);
    onStepChange?.(0, 0);
  };

  const currentStepData = steps[currentStep] || {
    heap: heap,
    highlightedIndices: []
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height: Math.max(height, 400) });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (currentStepData.heap.length === 0) return;

    const { width, height } = dimensions;
    const nodeRadius = 20;

    const treeData = buildTree(currentStepData.heap, 0);
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    const g = svg.append('g').attr('transform', 'translate(50, 50)');

    // Links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d, i) => {
        return currentStepData.highlightedIndices.includes(d.data.index) ? '#ff79c6' : '#636b2f';
      })
      .attr('stroke', '#3d4127')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .text(d => d.data.value);

  }, [currentStepData]);

  function buildTree(arr: number[], index: number): any {
    if (index >= arr.length) return null;
    return {
      value: arr[index],
      index: index,
      children: [
        buildTree(arr, 2 * index + 1),
        buildTree(arr, 2 * index + 2)
      ].filter(child => child !== null)
    };
  }

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
            placeholder="Value"
            className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
          />
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={16} /> Insert
          </button>
          <button
            onClick={handleExtract}
            disabled={heap.length === 0}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            Extract Max
          </button>
          <button
            onClick={reset}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 flex items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
        {currentStepData.heap.length > 0 ? (
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="max-w-full h-auto" />
        ) : (
          <div className="text-slate-400 italic">Empty Heap. Insert values to visualize!</div>
        )}
      </div>
    </div>
  );
}
