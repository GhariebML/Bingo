'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { login, mockLogin } from '@/lib/api';

export default function Page() {
 const [email, setEmail] = useState('demo@bingo.local');
 const [password, setPassword] = useState('demo-password');
 const [status, setStatus] = useState('Use demo login for local MVP testing.');

 async function submit(demo = false) {
 try {
 const auth = demo ? await mockLogin() : await login(email, password);
 setStatus(`Logged in as ${auth.user.email}. Your journal, mood, and settings records are owner-scoped.`);
 } catch {
 setStatus('Login failed. Check the backend and credentials.');
 }
 }

 return <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
 <div className="space-y-5">
 <p className="text-sm font-semibold uppercase tracking-wide text-muted">Bingo</p>
 <h1 className="text-4xl font-bold text-ink">Log in</h1>
 <p className="max-w-2xl text-lg text-textSecondary">Return to your private wellness workspace.</p>
 <Card>
 <div className="grid gap-3">
 <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border border-border px-4 py-3" placeholder="Email" />
 <input value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-lg border border-border px-4 py-3" placeholder="Password" type="password" />
 <div className="flex flex-wrap gap-3">
 <Button onClick={() => void submit(false)}>Continue</Button>
 <Button onClick={() => void submit(true)} variant="secondary">Demo login</Button>
 </div>
 <p className="text-sm text-textSecondary">{status}</p>
 </div>
 </Card>
 </div>
 <Card title="Safety boundary">
 <p>Bingo offers supportive reflection, not therapy, diagnosis, medication advice, or emergency care.</p>
 </Card>
 </section>;
}
