import { Card } from '@/components/ui/Card';
import { Lightbulb } from 'lucide-react';

export function InsightPanel() {
  return (
    <Card title="Mental Wellness Insights" className="shadow-sm">
      <div className="flex gap-4 items-start py-2 select-none">
        <div className="p-3 bg-mint/50 text-ocean rounded-2xl border border-white/60 shadow-sm shrink-0">
          <Lightbulb size={22} className="text-calm animate-pulse-subtle" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-ocean text-sm uppercase tracking-wider">Gentle Trend Detected</h3>
          <p className="leading-relaxed text-xs text-slate-600">
            Your recent entries mention overthinking and low energy. A useful next step might be parking one repeating worry, then doing a short grounding exercise before returning to work.
          </p>
        </div>
      </div>
    </Card>
  );
}
