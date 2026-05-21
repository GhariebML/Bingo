'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ChatInput({ disabled = false, onSend }: { disabled?: boolean; onSend: (message: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue('');
      }}
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="min-h-12 rounded-lg border border-sky bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-mint"
        disabled={disabled}
        placeholder="Share what is on your mind..."
      />
      <Button disabled={disabled || !value.trim()} type="submit">{disabled ? 'Sending...' : 'Send'}</Button>
    </form>
  );
}
