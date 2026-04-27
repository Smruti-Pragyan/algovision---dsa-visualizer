import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RotateCcw, Plus, Search, RefreshCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NAryTreeNode {
  id: string;
  name: string;
  children?: NAryTreeNode[];
}

interface NAryTreeStep {
  visitedNodes: string[];
  action: string;
}

interface NAryTreeVisualizerProps {
  algorithm: string;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

export default function NAryTreeVisualizer({
  algorithm,
  speed = 50,
  isPaused = true,
  currentStep = 0,
  onStepChange,
}: NAryTreeVisualizerProps) {
  const [treeData, setTreeData] = useState<NAryTreeNode>({
    id: '1',
    name: 'Root',
    children: [
      {
        id: '2',
        name: 'A',
        children: [
          { id: '5', name: 'E' },
          { id: '6', name: 'F' },
          { id: '7', name: 'G' },
        ],
      },
      {
        id: '3',
        name: 'B',
        children: [
          { id: '8', name: 'H' },
        ],
      },
      {
        id: '4',
        name: 'C',
        children: [
          { id: '9', name: 'I' },
          { id: '10', name: 'J' },
        ],
      },
    ],
  });
  const [steps, setSteps] = useState<NAryTreeStep[]>([]);
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

  const generateTraversalSteps = () => {
    const visited: string[] = [];
    const newSteps: NAryTreeStep[] = [{ visitedNodes: [], action: 'Ready' }];

    const traverse = (node: NAryTreeNode) => {
      visited.push(node.id);
      newSteps.push({
        visitedNodes: [...visited],
        action: `Visiting node ${node.name}...`,
      });
      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };

    traverse(treeData);
    setSteps(newSteps);
    onStepChange?.(0, newSteps.length - 1);
  };

  useEffect(() => {
    generateTraversalSteps();
  }, [treeData]);

  const currentStepData = steps[currentStep] || { visitedNodes: [], action: 'Ready' };

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', 'translate(40, 40)');

    const treeLayout = d3.tree<NAryTreeNode>().size([width - 80, height - 80]);
    const root = d3.hierarchy(treeData);
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
      .attr('r', 20)
      .attr('fill', d => currentStepData.visitedNodes.includes(d.data.id) ? '#d4de95' : '#636b2f')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-colors duration-300');

    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text(d => d.data.name);

  }, [currentStepData, treeData]);

  const reset = () => {
    onStepChange?.(0, steps.length - 1);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateTraversalSteps()}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Traverse (DFS)</span>
          </button>
        </div>
        <button
          onClick={reset}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-auto p-4">
        <div className="text-lg font-medium text-slate-600 dark:text-slate-400 h-8">
          {currentStepData.action}
        </div>

        <svg ref={svgRef} width="800" height="400" className="max-w-full h-auto" />
      </div>
    </div>
  );
}
