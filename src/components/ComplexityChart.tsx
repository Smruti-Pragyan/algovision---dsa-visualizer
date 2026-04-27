import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';

interface ComplexityChartProps {
  algorithmComplexity: string;
  title: string;
}

const data = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  return {
    n,
    'O(1)': 1,
    'O(log n)': Math.log2(n),
    'O(n)': n,
    'O(n log n)': n * Math.log2(n),
    'O(n²)': n * n,
    'O(2ⁿ)': Math.pow(2, n),
  };
});

const complexityColors: Record<string, string> = {
  'O(1)': '#10b981', // Green
  'O(log n)': '#3b82f6', // Blue
  'O(n)': '#f59e0b', // Amber
  'O(n log n)': '#8b5cf6', // Violet
  'O(n²)': '#ef4444', // Red
  'O(2ⁿ)': '#ec4899', // Pink
};

export default function ComplexityChart({ algorithmComplexity, title }: ComplexityChartProps) {
  // Normalize complexity string to match data keys
  const normalizedComplexity = algorithmComplexity
    .replace(/\s/g, '')
    .replace('O(nlog n)', 'O(n log n)')
    .replace('O(n^2)', 'O(n²)')
    .replace('O(2^n)', 'O(2ⁿ)')
    .replace('O(logn)', 'O(log n)');

  const isHighlighted = (key: string) => normalizedComplexity.includes(key);

  return (
    <div className="w-full h-[400px] bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-between">
        <span>{title} Growth Comparison</span>
        {normalizedComplexity && (
          <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800">
            Current: {normalizedComplexity}
          </span>
        )}
      </h4>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="n" 
            label={{ value: 'Input Size (n)', position: 'insideBottomRight', offset: -5, fontSize: 12 }} 
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            label={{ value: 'Operations', angle: -90, position: 'insideLeft', fontSize: 12 }} 
            tick={{ fontSize: 10 }}
            domain={[0, 100]}
            allowDataOverflow={true}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            itemStyle={{ padding: '2px 0' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
          
          {Object.entries(complexityColors).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={isHighlighted(key) ? 4 : 1.5}
              dot={isHighlighted(key)}
              activeDot={{ r: 6 }}
              opacity={isHighlighted(key) ? 1 : 0.3}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-slate-400 mt-4 italic text-center">
        * Chart shows relative growth. Y-axis is capped for visibility.
      </p>
    </div>
  );
}
