'use client';

import { useState } from 'react';

export function AssistantComposer({ viewId, matterId }: { viewId: string; matterId: string }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    setStatus(undefined);
    try {
      const response = await fetch('/api/land/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ viewId, matterId, query }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Assistant request failed');
      setAnswer(payload.content);
      setStatus(payload.status === 'needs-review' ? payload.escalation : `Run ${payload.runId}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Assistant request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {answer ? <div className="assistant-response" role="status"><p>{answer}</p><small>{status}</small></div> : null}
      <form className="chat-composer" onSubmit={submit}>
        <button className="composer-icon" type="button" aria-label="Add context">+</button>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask anything" aria-label="Ask anything" />
        <button className="send-button" type="submit" aria-label="Send" disabled={busy}>{busy ? '…' : '→'}</button>
      </form>
    </>
  );
}
