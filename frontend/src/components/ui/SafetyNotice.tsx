import { AlertTriangle } from 'lucide-react';

export function SafetyNotice({ compact = false }: { compact?: boolean }) {
 return (
 <div className={`flex gap-3 rounded-lg border border-[#F5B7B7] bg-[#FFE8E8] text-[#7A2323] ${compact ? 'p-3 text-sm' : 'p-4 text-sm leading-6'}`}>
 <AlertTriangle className="mt-0.5 shrink-0" size={18} />
 <p>
 Bingo supports reflection and grounding only. It is not a therapist, doctor, emergency responder, or crisis line. If there is immediate danger, contact local emergency services now.
 </p>
 </div>
 );
}
