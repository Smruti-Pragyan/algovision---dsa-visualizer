import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RotateCcw, Plus, Search, RefreshCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SegmentTreeNode {
  id: string;
  name: string;
  range: [number, number];
  children?: SegmentTreeNode[];
  value: number;
}

interface SegmentTreeStep {
  highlightedNodes: string[];
  action: string;
  queryRange?: [number, number];
}

interface SegmentTreeVisualizerProps {
  algorithm: string;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number) => void;
}

export default function SegmentTreeVisualizer({
  algorithm,
  speed = 50,
  isPaused = true,
  currentStep = 0,
  onStepChange,
}: SegmentTreeVisualizerProps) {
  const [data, setData] = useState<number[]>([1, 3, 5, 7, 9, 11]);
  const [steps, setSteps] = useState<SegmentTreeStep[]>([]);
  const [tree, setTree] = useState<SegmentTreeNode | null>(null);
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

  const buildTree = (arr: number[], start: number, end: number): SegmentTreeNode => {
    if (start === end) {
      return {
        id: `node-${start}-${end}`,
        name: `${arr[start]}`,
        range: [start, end],
        value: arr[start],
      };
    }
    const mid = Math.floor((start + end) / 2);
    const leftChild = buildTree(arr, start, mid);
    const rightChild = buildTree(arr, mid + 1, end);
    return {
      id: `node-${start}-${end}`,
      name: `${leftChild.value + rightChild.value}`,
      range: [start, end],
      value: leftChild.value + rightChild.value,
      children: [leftChild, rightChild],
    };
  };

  const generateQuerySteps = (qStart: number, qEnd: number) => {
    const newSteps: SegmentTreeStep[] = [];
    const highlightedNodes: string[] = [];

    const query = (node: SegmentTreeNode, qs: number, qe: number) => {
      const [ns, ne] = node.range;
      
      // Step: Visiting node
      newSteps.push({
        highlightedNodes: [...highlightedNodes, node.id],
        action: `Checking range [${ns}, ${ne}]...`,
        queryRange: [qs, qe],
      });

      // No overlap
      if (qe < ns || qs > ne) {
        newSteps.push({
          highlightedNodes: [...highlightedNodes],
          action: `No overlap for [${ns}, ${ne}]. Skipping.`,
          queryRange: [qs, qe],
        });
        return;
      }

      // Total overlap
      if (qs <= ns && qe >= ne) {
        highlightedNodes.push(node.id);
        newSteps.push({
          highlightedNodes: [...highlightedNodes],
          action: `Total overlap for [${ns}, ${ne}]. Adding ${node.value} to sum.`,
          queryRange: [qs, qe],
        });
        return;
      }

      // Partial overlap
      if (node.children) {
        query(node.children[0], qs, qe);
        query(node.children[1], qs, qe);
      }
    };

    if (tree) {
      query(tree, qStart, qEnd);
    }
    setSteps(newSteps);
    onStepChange?.(0, newSteps.length - 1);
  };

  useEffect(() => {
    const root = buildTree(data, 0, data.length - 1);
    setTree(root);
    setSteps([{ highlightedNodes: [], action: 'Ready' }]);
    onStepChange?.(0, 0);
  }, [data]);

  const currentStepData = steps[currentStep] || { highlightedNodes: [], action: 'Ready' };

  useEffect(() => {
    if (!svgRef.current || !tree) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', 'translate(40, 40)');

    const treeLayout = d3.tree<SegmentTreeNode>().size([width - 80, height - 80]);
    const root = d3.hierarchy(tree);
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
      .attr('r', 25)
      .attr('fill', d => currentStepData.highlightedNodes.includes(d.data.id) ? '#d4de95' : '#636b2f')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-colors duration-300');

    node.append('text')
      .attr('dy', '-0.2em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .text(d => d.data.name);

    node.append('text')
      .attr('dy', '1.2em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .text(d => `[${d.data.range[0]}, ${d.data.range[1]}]`);

  }, [currentStepData, tree]);

  const reset = () => {
    setData([1, 3, 5, 7, 9, 11]);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateQuerySteps(1, 3)}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Query Sum [1, 3]</span>
          </button>
          <button
            onClick={() => setData(prev => [...prev, Math.floor(Math.random() * 20)])}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Element</span>
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

        <div className="flex gap-2 mb-4">
          {data.map((val, i) => (
            <div
              key={i}
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300"
            >
              {val}
            </div>
          ))}
        </div>

        <svg ref={svgRef} width="800" height="400" className="max-w-full h-auto" />
      </div>
    </div>
  );
}
