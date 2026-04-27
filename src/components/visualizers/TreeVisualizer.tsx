import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Play, RotateCcw, Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  id: string;
}

interface TreeVisualizerProps {
  algorithm: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

interface TreeStep {
  visitedNodes: string[];
}

export default function TreeVisualizer({ 
  algorithm, 
  onComplete, 
  speed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: TreeVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDelay = () => (101 - speed) * 10;

  useEffect(() => {
    if (!isPaused && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        onStepChange?.(currentStep + 1, steps.length - 1);
      }, getDelay());
    } else if (currentStep === steps.length - 1 && steps.length > 1) {
      onComplete?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, currentStep, steps.length, speed, onStepChange]);

  const initialData: TreeNode = {
    id: '1',
    name: '10',
    children: [
      {
        id: '2',
        name: '5',
        children: [
          { id: '4', name: '2' },
          { id: '5', name: '7' },
        ],
      },
      {
        id: '3',
        name: '15',
        children: [
          { id: '6', name: '12' },
          { id: '7', name: '20' },
        ],
      },
    ],
  };

  const generateSteps = () => {
    const order: string[] = [];
    if (algorithm === 'inorder') inorder(initialData, order);
    else if (algorithm === 'preorder') preorder(initialData, order);
    else if (algorithm === 'postorder') postorder(initialData, order);
    else inorder(initialData, order); // Default

    const generatedSteps: TreeStep[] = [{ visitedNodes: [] }];
    for (let i = 0; i < order.length; i++) {
      generatedSteps.push({
        visitedNodes: order.slice(0, i + 1)
      });
    }
    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  useEffect(() => {
    generateSteps();
  }, [algorithm]);

  const currentStepData = steps[currentStep] || { visitedNodes: [] };

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

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', 'translate(40, 40)');

    const treeLayout = d3.tree<TreeNode>().size([width - 80, height - 80]);
    const root = d3.hierarchy(initialData);
    treeLayout(root);

    // Links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical<any, any>()
        .x(d => d.x)
        .y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2);

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 24)
      .attr('fill', d => {
        const isVisited = currentStepData.visitedNodes.includes(d.data.id);
        const isCurrent = currentStepData.visitedNodes[currentStepData.visitedNodes.length - 1] === d.data.id;
        if (isCurrent) return 'url(#tree-grad-current)';
        return isVisited ? 'url(#tree-grad-visited)' : 'url(#tree-grad-default)';
      })
      .attr('stroke', d => {
        const isCurrent = currentStepData.visitedNodes[currentStepData.visitedNodes.length - 1] === d.data.id;
        return isCurrent ? '#8b5cf6' : '#636b2f';
      })
      .attr('stroke-width', 2)
      .attr('class', 'transition-all duration-500')
      .style('filter', d => {
        const isCurrent = currentStepData.visitedNodes[currentStepData.visitedNodes.length - 1] === d.data.id;
        return isCurrent ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' : 'none';
      });

    // Defs for gradients
    const defs = svg.append('defs');
    
    const gradDefault = defs.append('linearGradient').attr('id', 'tree-grad-default').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    gradDefault.append('stop').attr('offset', '0%').attr('stop-color', '#636b2f');
    gradDefault.append('stop').attr('offset', '100%').attr('stop-color', '#3d4127');

    const gradVisited = defs.append('linearGradient').attr('id', 'tree-grad-visited').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    gradVisited.append('stop').attr('offset', '0%').attr('stop-color', '#d4de95');
    gradVisited.append('stop').attr('offset', '100%').attr('stop-color', '#bac095');

    const gradCurrent = defs.append('linearGradient').attr('id', 'tree-grad-current').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    gradCurrent.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6');
    gradCurrent.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed');

    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text(d => d.data.name);

  }, [currentStepData]);

  const inorder = (node: TreeNode, order: string[]) => {
    if (!node) return;
    if (node.children?.[0]) inorder(node.children[0], order);
    order.push(node.id);
    if (node.children?.[1]) inorder(node.children[1], order);
  };

  const preorder = (node: TreeNode, order: string[]) => {
    if (!node) return;
    order.push(node.id);
    if (node.children?.[0]) preorder(node.children[0], order);
    if (node.children?.[1]) preorder(node.children[1], order);
  };

  const postorder = (node: TreeNode, order: string[]) => {
    if (!node) return;
    if (node.children?.[0]) postorder(node.children[0], order);
    if (node.children?.[1]) postorder(node.children[1], order);
    order.push(node.id);
  };

  const reset = () => {
    onStepChange?.(0, steps.length - 1);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Settings */}
      <div className="flex flex-wrap items-center justify-end gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Traversal Mode</span>
          <div className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">
            {algorithm.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-10">
        <div ref={containerRef} className="flex-1 flex items-center justify-center min-h-[400px]">
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="max-w-full h-auto drop-shadow-2xl" />
        </div>

        {/* Legend & Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#636b2f] border-2 border-white" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unvisited</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#d4de95] border-2 border-white shadow-lg shadow-[#d4de95]/30" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visited</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {currentStepData.visitedNodes.length > 0 
                ? `Visited nodes in ${algorithm} order: ${currentStepData.visitedNodes.join(' → ')}`
                : currentStep === 0 
                ? `Ready to start ${algorithm} traversal`
                : currentStep === steps.length - 1
                ? "Traversal complete!"
                : "Processing..."
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
