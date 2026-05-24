'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const barColors: Record<string, string> = {
  calm: '#2563eb',     // primary
  stressed: '#ef4444', // error
  anxious: '#64748b',  // slate
  hopeful: '#10b981',  // emerald
  sad: '#3b82f6',      // blue
  tired: '#f59e0b',    // amber
  happy: '#22c55e',    // green
  energetic: '#f59e0b',// amber
  thoughtful: '#8b5cf6'// violet
};

export function MoodChart({ data }: { data?: Array<{ day: string; mood: string; score: number }> }) {
  const items = data && data.length > 0 ? data : [
    { day: 'Mon', mood: 'Stressed', score: 4 },
    { day: 'Tue', mood: 'Anxious', score: 5 },
    { day: 'Wed', mood: 'Calm', score: 6 },
    { day: 'Thu', mood: 'Hopeful', score: 7 },
    { day: 'Fri', mood: 'Happy', score: 8 },
  ];

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
            dy={10} 
          />
          <YAxis 
            hide 
            domain={[0, 10]} 
          />
          <Tooltip
            cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-surface border border-border shadow-soft rounded-lg p-3">
                    <p className="text-xs font-bold text-textSecondary uppercase mb-1">{data.day}</p>
                    <p className="text-sm font-extrabold text-textPrimary">{data.mood}</p>
                    <p className="text-xs font-medium text-muted mt-1">Score: {data.score}/10</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 4, 4]} barSize={24}>
            {items.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={barColors[entry.mood.toLowerCase()] || '#14b8a6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

