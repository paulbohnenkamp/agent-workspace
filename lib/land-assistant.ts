import { randomUUID } from 'node:crypto';

import { loadLandWorkspace } from './land-workspace';
import { recordLandAssistantRun } from './land-workspace';

export type LandAssistantResponse = {
  content: string;
  citations: Array<{ id: string; title: string; href: string }>;
  runId: string;
  mode: 'deterministic' | 'live';
  status: 'complete' | 'needs-review' | 'failed';
  escalation?: string;
};

export async function answerLandQuestion(viewId: string, matterId: string, query: string): Promise<LandAssistantResponse> {
  const runId = `assistant-run-${randomUUID()}`;
  const interpreted = await loadLandWorkspace(viewId, matterId);
  const sources = Array.isArray(interpreted.state.knowledge_links) ? interpreted.state.knowledge_links : [];
  const citations = sources.slice(0, 3).flatMap((source) => {
    if (!source || typeof source !== 'object') return [];
    const item = source as Record<string, unknown>;
    return typeof item.id === 'string' && typeof item.title === 'string' && typeof item.href === 'string'
      ? [{ id: item.id, title: item.title, href: item.href }]
      : [];
  });
  const selected = interpreted.fields.selectedMatter as Record<string, unknown> | undefined;
  const name = typeof selected?.name === 'string' ? selected.name : 'the selected land matter';
  const normalizedMode = process.env.LAND_ASSISTANT_MODE === 'live' ? 'live' : 'deterministic';

  if (normalizedMode === 'live') {
    const providerUrl = process.env.LAND_ASSISTANT_PROVIDER_URL;
    if (providerUrl) {
      try {
        const response = await fetch(providerUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ projectId: 'land-project', viewId, matterId, query, citations }),
          signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok) throw new Error(`provider returned ${response.status}`);
        const payload = await response.json() as { content?: unknown; citations?: unknown; status?: unknown };
      const result: LandAssistantResponse = {
          content: typeof payload.content === 'string' ? payload.content : 'The configured assistant provider returned no message.',
          citations,
          runId,
          mode: 'live',
          status: payload.status === 'needs-review' ? 'needs-review' : 'complete',
      };
      await recordLandAssistantRun({ ...result, matterId, query });
      return result;
      } catch (error) {
        return {
          content: 'The live assistant provider could not complete this request.',
          citations,
          runId,
          mode: 'live',
          status: 'failed',
          escalation: error instanceof Error ? error.message : 'Provider failure',
        };
      }
    }
    const result: LandAssistantResponse = {
      content: 'Live assistant mode is configured, but no provider adapter is available in this local demo.',
      citations,
      runId,
      mode: 'live',
      status: 'failed',
      escalation: 'Configure the provider-neutral assistant adapter before relying on a live response.',
    };
    await recordLandAssistantRun({ ...result, matterId, query });
    return result;
  }

  const result: LandAssistantResponse = {
    content: `For ${name}, I can summarize the supplied workspace record for “${query}”. The current view shows coordination dependencies and open records; it does not establish title, legal, permit, payment, or accounting conclusions. Route unresolved questions to the qualified reviewer identified by the project workflow.`,
    citations,
    runId,
    mode: 'deterministic',
    status: 'needs-review',
    escalation: 'Educational context only. Qualified professional review is required for legal, title, regulatory, ownership, payment, or accounting judgment.',
  };
  await recordLandAssistantRun({ ...result, matterId, query });
  return result;
}
