import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const steps = [
 { title: 'Set your intention', body: 'Choose what you need today: calm, clarity, reflection, or a small next step.' },
 { title: 'Talk with Bingo', body: 'Use supportive AI-driven responses that validate, reflect, ask, and suggest one action.' },
 { title: 'Track patterns', body: 'Capture moods and journal notes so future product work can reveal gentle trends.' },
];

export default function Page() {
 return (
 <section className="space-y-16 py-4 animate-fade-in">
 {/* Hero Section */}
 <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
 <div className="space-y-8 animate-fade-in-up">
 <div className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-textPrimary border border-border">
 <Sparkles size={14} className="text-muted " />
 AI Mental Wellness Companion
 </div>
 
 <div className="space-y-4">
 <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.15] text-textPrimary lg:max-w-xl">
 Meet Bingo, a calm place to <span className="text-primary font-bold bg-clip-text text-transparent">pause, reflect</span>, and take one safe step.
 </h1>
 <p className="max-w-xl text-md leading-relaxed text-textSecondary/90">
 Bingo offers warm emotional support, journaling prompts, mood reflection, and guided grounding exercises. It is not a therapist, doctor, or emergency service.
 </p>
 </div>

 <div className="flex flex-wrap gap-4 pt-2">
 <Link href="/chat">
 <Button className="px-8 py-3 text-base">Start chat</Button>
 </Link>
 <Link href="/safety">
 <Button variant="ghost" className="px-6 py-3 text-base">
 Read safety boundaries
 </Button>
 </Link>
 </div>
 </div>

 {/* Hero Card */}
 <Card className="overflow-hidden p-0 border border-border shadow-soft animate-fade-in-up delay-100">
 <div className="relative h-64 w-full bg-surface">
 <Image 
 alt="Bingo floating in a calm ocean scene" 
 className="object-cover transition-transform duration-500 hover:scale-105" 
 fill 
 priority 
 sizes="(min-width: 1024px) 520px, 100vw" 
 src="/bingo/bingo-hero.png" 
 />
 </div>
 
 <div className="space-y-6 p-6">
 <div className="border-b border-border pb-4">
 <h2 className="text-xl font-bold text-textPrimary">Welcome from Bingo</h2>
 <p className="mt-2 text-sm leading-relaxed text-textSecondary">
 Hi, I am Bingo. I can sit with you for a moment, help name what feels heavy, and suggest one gentle step. You do not have to solve everything at once.
 </p>
 </div>

 <div className="grid gap-3 sm:grid-cols-2">
 {[
 ['Calming Chat', MessageCircle, 'bg-surface text-textPrimary'],
 ['Journal Tool', BookOpen, 'bg-surface text-textPrimary'],
 ['Safety First', ShieldCheck, 'bg-error/20 text-error'],
 ['Small Steps', Sparkles, 'bg-surface text-textPrimary'],
 ].map(([label, Icon, colorClass]) => (
 <div 
 key={String(label)} 
 className={`flex items-center gap-3 rounded-xl p-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] border border-border ${colorClass}`}
 >
 <Icon size={18} className="shrink-0" />
 {label as string}
 </div>
 ))}
 </div>
 </div>
 </Card>
 </div>

 {/* Steps Section */}
 <div className="space-y-8 animate-fade-in-up delay-200">
 <div className="text-center max-w-2xl mx-auto space-y-2">
 <h2 className="text-3xl font-extrabold text-textPrimary">How Bingo works</h2>
 <p className="text-muted text-sm">A gentle, three-step cycle to bring peace and mental margin into your day.</p>
 </div>

 <div className="grid gap-6 md:grid-cols-3">
 {steps.map((step, index) => (
 <Card 
 key={step.title} 
 className={`relative overflow-hidden pt-8 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up delay-${(index + 3) * 100}`}
 >
 {/* Process Number Bubble */}
 <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 translate-y-[-1rem] rounded-full bg-surface flex items-center justify-center font-heading text-3xl font-extrabold text-muted/40 select-none">
 0{index + 1}
 </div>
 
 <h3 className="text-lg font-bold text-textPrimary mb-3">{step.title}</h3>
 <p className="text-textSecondary text-sm leading-relaxed">{step.body}</p>
 </Card>
 ))}
 </div>
 </div>

 {/* Footer Link */}
 <div className="text-center pt-4">
 <Link 
 className="inline-flex items-center gap-2 font-bold text-textPrimary hover:text-muted transition-colors group" 
 href="/dashboard"
 >
 <span>View the wellness dashboard</span> 
 <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 </section>
 );
}
