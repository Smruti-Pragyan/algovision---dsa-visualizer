import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  MousePointer2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  weight?: number;
}

interface GraphVisualizerProps {
  algorithm: string;
  onComplete?: () => void;
  speed?: number;
  isPaused?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, total: number, line?: number) => void;
}

interface GraphStep {
  visited: string[];
  current: string | null;
  stack: string[];
  path: string[]; // Current path nodes
  activeLinks: [string, string][]; // Links in the current path
  distances?: Record<string, number>;
  line?: number;
}

export default function GraphVisualizer({ 
  algorithm, 
  onComplete, 
  speed: externalSpeed = 50, 
  isPaused = true,
  currentStep = 0,
  onStepChange 
}: GraphVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    { id: '0', name: '0' },
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' },
    { id: '6', name: '6' },
  ]);
  const [links, setLinks] = useState<Link[]>([
    { source: '0', target: '1', weight: 4 },
    { source: '0', target: '2', weight: 3 },
    { source: '1', target: '3', weight: 2 },
    { source: '1', target: '4', weight: 5 },
    { source: '2', target: '5', weight: 6 },
    { source: '2', target: '6', weight: 1 },
    { source: '3', target: '4', weight: 3 },
  ]);
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [speed, setSpeed] = useState(externalSpeed);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSpeed(externalSpeed);
  }, [externalSpeed]);

  useEffect(() => {
    generateSteps();
  }, [algorithm, nodes, links]);

  useEffect(() => {
    if (!isPaused && currentStep < steps.length - 1) {
      const ms = 1000 - (speed * 9.5);
      timerRef.current = setTimeout(() => {
        onStepChange?.(currentStep + 1, steps.length - 1, steps[currentStep + 1].line);
      }, ms);
    } else if (currentStep === steps.length - 1 && steps.length > 1) {
      onComplete?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, currentStep, steps, speed, onStepChange]);

  const generateSteps = () => {
    const generatedSteps: GraphStep[] = [{
      visited: [],
      current: null,
      stack: [],
      path: [],
      activeLinks: []
    }];

    const adj: Record<string, { node: string; weight: number }[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    links.forEach(l => {
      const s = typeof l.source === 'string' ? l.source : (l.source as Node).id;
      const t = typeof l.target === 'string' ? l.target : (l.target as Node).id;
      const w = l.weight || 1;
      adj[s].push({ node: t, weight: w });
      adj[t].push({ node: s, weight: w });
    });

    const record = (visited: string[], current: string | null, stack: string[], path: string[], activeLinks: [string, string][], dists?: Record<string, number>, line?: number) => {
      generatedSteps.push({
        visited: [...visited],
        current,
        stack: [...stack],
        path: [...path],
        activeLinks: [...activeLinks],
        distances: dists ? { ...dists } : undefined,
        line
      });
    };

    if (algorithm === 'dfs') {
      const visited = new Set<string>();
      const stack: { node: string; path: string[] }[] = [{ node: '0', path: ['0'] }];
      
      record([], null, ['0'], [], [], undefined, 1);

      while (stack.length > 0) {
        const { node: current, path } = stack.pop()!;
        
        if (!visited.has(current)) {
          visited.add(current);
          
          const activeLinks: [string, string][] = [];
          for (let i = 0; i < path.length - 1; i++) {
            activeLinks.push([path[i], path[i+1]]);
          }

          record(Array.from(visited), current, stack.map(s => s.node), path, activeLinks, undefined, 2);

          const neighbors = adj[current];
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor.node)) {
              stack.push({ node: neighbor.node, path: [...path, neighbor.node] });
              
              record(Array.from(visited), current, stack.map(s => s.node), path, activeLinks, undefined, 5);
            }
          }
        }
      }
    } else if (algorithm === 'bfs') {
      const visited = new Set<string>();
      const queue: { node: string; path: string[] }[] = [{ node: '0', path: ['0'] }];
      visited.add('0');

      record(['0'], '0', ['0'], ['0'], [], undefined, 3);

      while (queue.length > 0) {
        const { node: current, path } = queue.shift()!;
        
        const activeLinks: [string, string][] = [];
        for (let i = 0; i < path.length - 1; i++) {
          activeLinks.push([path[i], path[i+1]]);
        }

        record(Array.from(visited), current, queue.map(q => q.node), path, activeLinks, undefined, 6);

        const neighbors = adj[current];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.node)) {
            visited.add(neighbor.node);
            queue.push({ node: neighbor.node, path: [...path, neighbor.node] });
            
            record(Array.from(visited), current, queue.map(q => q.node), path, activeLinks, undefined, 12);
          }
        }
      }
    } else if (algorithm === 'dijkstra') {
      const distances: Record<string, number> = {};
      const visited = new Set<string>();
      const pq: { node: string; dist: number; path: string[] }[] = [{ node: '0', dist: 0, path: ['0'] }];
      
      nodes.forEach(n => distances[n.id] = Infinity);
      distances['0'] = 0;

      record([], null, [], [], [], { ...distances }, 2);

      while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { node: u, dist, path } = pq.shift()!;
        
        if (visited.has(u)) continue;
        visited.add(u);

        const activeLinks: [string, string][] = [];
        for (let i = 0; i < path.length - 1; i++) {
          activeLinks.push([path[i], path[i+1]]);
        }

        record(Array.from(visited), u, pq.map(p => `${p.node}(${p.dist})`), path, activeLinks, { ...distances }, 9);

        const neighbors = adj[u];
        for (const neighbor of neighbors) {
          const v = neighbor.node;
          const weight = neighbor.weight;
          if (distances[u] + weight < distances[v]) {
            distances[v] = distances[u] + weight;
            pq.push({ node: v, dist: distances[v], path: [...path, v] });
            
            record(Array.from(visited), u, pq.map(p => `${p.node}(${p.dist})`), path, activeLinks, { ...distances }, 14);
          }
        }
      }
    }

    setSteps(generatedSteps);
    onStepChange?.(0, generatedSteps.length - 1);
  };

  const currentStepData = steps[currentStep] || {
    visited: [],
    current: null,
    stack: [],
    path: [],
    activeLinks: []
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

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        const s = d.source.id || d.source;
        const t = d.target.id || d.target;
        const isActive = currentStepData.activeLinks.some(al => 
          (al[0] === s && al[1] === t) || (al[0] === t && al[1] === s)
        );
        return isActive ? '#8b5cf6' : '#94a3b8';
      })
      .attr('stroke-width', (d: any) => {
        const s = d.source.id || d.source;
        const t = d.target.id || d.target;
        const isActive = currentStepData.activeLinks.some(al => 
          (al[0] === s && al[1] === t) || (al[0] === t && al[1] === s)
        );
        return isActive ? 5 : 2;
      })
      .attr('stroke-opacity', 0.6);

    const linkText = svg.append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .text((d: any) => d.weight);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 24)
      .attr('fill', (d: any) => {
        if (d.id === currentStepData.current) return 'url(#gradient-current)';
        if (currentStepData.visited.includes(d.id)) return 'url(#gradient-visited)';
        return 'url(#gradient-default)';
      })
      .attr('stroke', (d: any) => d.id === currentStepData.current ? '#8b5cf6' : '#636b2f')
      .attr('stroke-width', 2)
      .attr('class', 'transition-all duration-500')
      .style('filter', (d: any) => d.id === currentStepData.current ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' : 'none');

    // Defs for gradients
    const defs = svg.append('defs');
    
    const gradDefault = defs.append('linearGradient').attr('id', 'gradient-default').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    gradDefault.append('stop').attr('offset', '0%').attr('stop-color', '#636b2f');
    gradDefault.append('stop').attr('offset', '100%').attr('stop-color', '#3d4127');

    const gradVisited = defs.append('linearGradient').attr('id', 'gradient-visited').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    gradVisited.append('stop').attr('offset', '0%').attr('stop-color', '#d4de95');
    gradVisited.append('stop').attr('offset', '100%').attr('stop-color', '#bac095');

    const gradCurrent = defs.append('linearGradient').attr('id', 'gradient-current').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    gradCurrent.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6');
    gradCurrent.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed');

    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text((d: any) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => (d.source as Node).x!)
        .attr('y1', (d: any) => (d.source as Node).y!)
        .attr('x2', (d: any) => (d.target as Node).x!)
        .attr('y2', (d: any) => (d.target as Node).y!);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      linkText
        .attr('x', (d: any) => ((d.source as Node).x! + (d.target as Node).x!) / 2)
        .attr('y', (d: any) => ((d.source as Node).y! + (d.target as Node).y!) / 2);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, currentStepData]);

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Graph Area */}
        <div ref={containerRef} className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative min-h-[400px]">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#636b2f]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Unvisited</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#d4de95]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Visited</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Current</span>
            </div>
          </div>
          
          <div className="w-full h-full flex items-center justify-center">
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="max-w-full h-auto" />
          </div>
        </div>

        {/* Stack/Queue/PQ Visualization */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              {algorithm === 'dfs' ? 'Stack (LIFO)' : algorithm === 'bfs' ? 'Queue (FIFO)' : 'Priority Queue'}
            </h3>
            
            <div className="flex-1 flex flex-col-reverse gap-2 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence initial={false}>
                {currentStepData.stack.map((nodeInfo, idx) => (
                  <motion.div
                    key={`${nodeInfo}-${idx}`}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    className={cn(
                      "p-3 rounded-xl border-2 font-bold text-center transition-all",
                      idx === currentStepData.stack.length - 1 && algorithm === 'dfs'
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    {algorithm === 'dijkstra' ? `Node ${nodeInfo}` : `Node ${nodeInfo}`}
                  </motion.div>
                ))}
              </AnimatePresence>
              {currentStepData.stack.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic">
                  {algorithm === 'dfs' ? 'Stack is empty' : algorithm === 'bfs' ? 'Queue is empty' : 'PQ is empty'}
                </div>
              )}
            </div>
          </div>

          {algorithm === 'dijkstra' && currentStepData.distances && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Tentative Distances</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentStepData.distances).map(([nodeId, dist]) => (
                  <div key={nodeId} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500">Node {nodeId}</span>
                    <span className="text-xs font-black text-brand-primary">
                      {dist === Infinity ? '∞' : dist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-brand-primary/5 dark:bg-brand-primary/10 rounded-2xl border border-brand-primary/20 p-4">
            <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">Current Path</h4>
            <div className="flex flex-wrap gap-2">
              {currentStepData.path.map((nodeId, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-brand-primary text-white text-[10px] font-black flex items-center justify-center">
                    {nodeId}
                  </span>
                  {idx < currentStepData.path.length - 1 && (
                    <ChevronRight size={12} className="text-brand-primary/40" />
                  )}
                </div>
              ))}
              {currentStepData.path.length === 0 && (
                <span className="text-[10px] text-slate-400 italic">No active path</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
