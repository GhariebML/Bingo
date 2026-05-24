'use client';

interface MoodCheckItem {
  day: string;
  dateStr: string;
  mood?: string;
  intensity?: number;
}

interface WellnessGridProps {
  moodHistory?: Array<{ label: string; intensity: number; created_at?: string }>;
}

const moodColors: Record<string, string> = {
  calm: 'bg-primary/95 text-white',
  stressed: 'bg-[#D97862] text-white', // Coral
  anxious: 'bg-[#5D6B89] text-white',  // Slate-blue
  hopeful: 'bg-emerald-500 text-white',
  sad: 'bg-blue-500 text-white',
  tired: 'bg-amber-600/90 text-white',
};

const moodLabels: Record<string, string> = {
  calm: '😌 Calm',
  stressed: '🤯 Stressed',
  anxious: '😰 Anxious',
  hopeful: '✨ Hopeful',
  sad: '😢 Sad',
  tired: '🥱 Tired',
};

export function WellnessGrid({ moodHistory = [] }: WellnessGridProps) {
  // Generate last 14 days
  const gridItems: MoodCheckItem[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - i);
    const dateStr = dayDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const weekday = dayDate.toLocaleDateString('en-US', { weekday: 'short' });

    // Look for matching check-in in history
    const match = moodHistory.find((m) => {
      if (!m.created_at) return false;
      const checkDate = new Date(m.created_at);
      return (
        checkDate.getDate() === dayDate.getDate() &&
        checkDate.getMonth() === dayDate.getMonth() &&
        checkDate.getFullYear() === dayDate.getFullYear()
      );
    });

    gridItems.push({
      day: weekday,
      dateStr: dateStr,
      mood: match?.label,
      intensity: match?.intensity,
    });
  }

  return (
    <div className="glass-card rounded-2xl p-6 shadow-soft space-y-4">
      <div>
        <h3 className="font-bold text-textPrimary text-base font-heading">14-Day Wellness Grid</h3>
        <p className="text-xs text-muted leading-relaxed">A daily visualization of your emotional patterns.</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridItems.map((item, idx) => {
          const colorClass = item.mood ? moodColors[item.mood.toLowerCase()] || 'bg-slate-300 text-white' : 'bg-slate-100 border border-slate-200/50 text-muted';
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between rounded-xl p-2.5 h-16 transition-all duration-300 transform hover:scale-105 hover:shadow-sm select-none ${colorClass}`}
              title={item.mood ? `${moodLabels[item.mood.toLowerCase()] || item.mood} (Intensity: ${item.intensity}/10) on ${item.dateStr}` : `No entry logged for ${item.dateStr}`}
            >
              <span className="text-[9px] font-bold uppercase opacity-85 tracking-wider">{item.day}</span>
              <span className={`text-[13px] font-extrabold font-sans`}>
                {item.mood ? (
                  <span className="text-[14px]">
                    {item.mood.toLowerCase() === 'calm' && '😌'}
                    {item.mood.toLowerCase() === 'stressed' && '🤯'}
                    {item.mood.toLowerCase() === 'anxious' && '😰'}
                    {item.mood.toLowerCase() === 'hopeful' && '✨'}
                    {item.mood.toLowerCase() === 'sad' && '😢'}
                    {item.mood.toLowerCase() === 'tired' && '🥱'}
                  </span>
                ) : (
                  <span>{item.dateStr.split('/')[1]}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-border/80 text-[10px] font-bold text-muted uppercase tracking-wider select-none justify-center">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/95" />
          <span>Calm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D97862]" />
          <span>Stressed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5D6B89]" />
          <span>Anxious</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Hopeful</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span>Sad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600/90" />
          <span>Tired</span>
        </div>
      </div>
    </div>
  );
}
