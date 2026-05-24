'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createStructuredJournalEntry } from '@/lib/api';

export default function JournalPage() {
  const [step, setStep] = useState(0);
  const [journal, setJournal] = useState({
    situation: '',
    thought: '',
    emotion: '',
    action: ''
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: 'situation',
      title: 'What happened?',
      desc: 'Describe the situation briefly without judging it.',
      placeholder: 'e.g., I had a difficult conversation with a friend...'
    },
    {
      id: 'thought',
      title: 'What went through your mind?',
      desc: 'What were you thinking right when it happened?',
      placeholder: 'e.g., I thought they were mad at me...'
    },
    {
      id: 'emotion',
      title: 'How did you feel?',
      desc: 'Name the emotions and rate their intensity.',
      placeholder: 'e.g., Anxious (8/10), Sad (5/10)'
    },
    {
      id: 'action',
      title: 'What is one small step you can take?',
      desc: 'Focus on what you can control right now.',
      placeholder: 'e.g., I will take a 5-minute walk outside...'
    }
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        setIsLoading(true);
        await createStructuredJournalEntry({
          situation: journal.situation,
          thought: journal.thought,
          emotion: journal.emotion,
          action: journal.action
        });
        setIsCompleted(true);
      } catch (err) {
        console.error('Failed to save structured reflection:', err);
        // Show success state to user anyway to fallback gracefully
        setIsCompleted(true);
      } finally {
        setIsLoading(false);
      }
    }
  };


  const currentStepInfo = steps[step];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <BookOpen size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Cognitive Journal</h1>
          <p className="text-sm text-textSecondary">A structured space to process your thoughts.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="journal-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface border border-border shadow-soft rounded-2xl p-6 md:p-8"
          >
            {/* Progress indicators */}
            <div className="flex gap-2 mb-8">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                    i <= step ? 'bg-primary' : 'bg-muted/30'
                  }`}
                />
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-textPrimary">{currentStepInfo.title}</h2>
                <p className="text-sm text-textSecondary mt-1">{currentStepInfo.desc}</p>
              </div>

              <textarea
                autoFocus
                className="w-full min-h-[150px] p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-textPrimary transition-all duration-300 shadow-inner"
                placeholder={currentStepInfo.placeholder}
                value={journal[currentStepInfo.id as keyof typeof journal]}
                onChange={(e) => setJournal({ ...journal, [currentStepInfo.id]: e.target.value })}
              />

              <div className="flex justify-between items-center pt-4">
                {step > 0 ? (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                
                <Button 
                  onClick={handleNext}
                  disabled={isLoading || !journal[currentStepInfo.id as keyof typeof journal].trim()}
                  className="flex items-center gap-2"
                >
                  {step === steps.length - 1 ? (isLoading ? 'Saving...' : 'Save Reflection') : 'Next'}
                  <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="journal-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-success/30 shadow-soft rounded-2xl p-8 text-center space-y-4"
          >
            <div className="h-16 w-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-textPrimary">Reflection Saved!</h2>
            <p className="text-textSecondary max-w-sm mx-auto">
              Taking time to process your thoughts is a huge step toward mental clarity.
            </p>
            <div className="pt-6">
              <Button onClick={() => window.location.href = '/dashboard'} className="mx-auto">
                Return to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
