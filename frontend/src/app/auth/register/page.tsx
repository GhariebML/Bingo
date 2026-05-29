'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { register } from '@/lib/api';

export default function Page() {
 const [displayName, setDisplayName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [status, setStatus] = useState('Create a local MVP account for owned data.');

 async function submit() {
 try {
 const auth = await register(email, password, displayName);
 setStatus(`Account created for ${auth.user.email}.`);
 } catch {
 setStatus('Registration failed. The email may already exist or the password is too short.');
 }
 }

 return <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
 <div className="space-y-5">
 <p className="text-sm font-semibold uppercase tracking-wide text-muted">Bingoo</p>
 <h1 className="text-4xl font-bold text-ink">Create account</h1>
 <p className="max-w-2xl text-lg text-textSecondary">Set up a private account for mood, journal, and settings history.</p>
 <Card>
 <div className="grid gap-3">
 <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="rounded-lg border border-border px-4 py-3" placeholder="Display name" />
 <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border border-border px-4 py-3" placeholder="Email" />
 <input value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-lg border border-border px-4 py-3" placeholder="Password, 8+ characters" type="password" />
 <Button onClick={() => void submit()}>Create account</Button>
 <p className="text-sm text-textSecondary">{status}</p>
 </div>
 </Card>
 </div>
 <Card title="Safety boundary">
 <p>Bingoo offers supportive reflection, not therapy, diagnosis, medication advice, or emergency care.</p>
 </Card>
 </section>;
}
