import { AlbertModel, ChatMessage, RagDocument } from '../types';
import { AGROCAMPUS_KNOWLEDGE_DOCS } from '../data/agrocampusKnowledge';

const DEFAULT_MODELS: AlbertModel[] = [
  {
    id: 'ministral-3-8b-instruct-2512',
    type: 'image-text-to-text',
    aliases: ['mistralai/Ministral-3-8B-Instruct-2512', 'openweight-small'],
    owned_by: 'Direction interministérielle du numérique (DINUM)',
    max_context_length: 262144,
  },
  {
    id: 'mistral-small-3-2-24b-instruct-2506',
    type: 'image-text-to-text',
    aliases: ['mistralai/Mistral-Small-3.2-24B-Instruct-2506', 'openweight-medium'],
    owned_by: 'Direction interministérielle du numérique (DINUM)',
    max_context_length: 128000,
  },
  {
    id: 'gpt-oss-120b',
    type: 'text-generation',
    aliases: ['openweight-large', 'openai/gpt-oss-120b'],
    owned_by: 'Direction interministérielle du numérique (DINUM)',
    max_context_length: 131072,
  },
  {
    id: 'qwen3-coder-30b-a3b-instruct',
    type: 'text-generation',
    aliases: ['openweight-code', 'Qwen/Qwen3-Coder-30B-A3B-Instruct'],
    owned_by: 'Direction interministérielle du numérique (DINUM)',
    max_context_length: 262144,
  },
  {
    id: 'gemma-4-31b-it',
    type: 'image-text-to-text',
    aliases: ['google/gemma-4-31B-it'],
    owned_by: 'Direction interministérielle du numérique (DINUM)',
    max_context_length: 262144,
  },
  {
    id: 'deepseek-v4-flash-0731',
    type: 'text-generation',
    aliases: ['deepseek-ai/DeepSeek-V4-Flash-0731'],
    owned_by: 'Direction interministérielle du numérique (DINUM)',
    max_context_length: 131072,
  },
];

export async function getAlbertModels(customApiKey?: string): Promise<AlbertModel[]> {
  try {
    const headers: Record<string, string> = {};
    if (customApiKey) {
      headers['x-albert-key'] = customApiKey;
    }
    const resp = await fetch('/api/albert/models', { headers });
    if (!resp.ok) {
      return DEFAULT_MODELS;
    }
    const data = await resp.json();
    if (Array.isArray(data?.data) && data.data.length > 0) {
      // Filtrer les modèles de génération textuelle et de chat
      const chatModels = data.data.filter(
        (m: any) =>
          m.type === 'text-generation' ||
          m.type === 'image-text-to-text' ||
          !m.type?.includes('embeddings')
      );
      return chatModels.length > 0 ? chatModels : data.data;
    }
    return DEFAULT_MODELS;
  } catch (err) {
    console.warn('[Albert API] Fallback sur les modèles par défaut', err);
    return DEFAULT_MODELS;
  }
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onUsage?: (usage: {
    tokens?: number;
    latencyMs?: number;
    carbonKwh?: number;
    carbonCo2?: number;
  }) => void;
  onError: (error: string) => void;
  onDone: () => void;
}

export async function streamAlbertChat(
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: {
    temperature?: number;
    maxTokens?: number;
    customApiKey?: string;
  },
  callbacks: StreamCallbacks
): Promise<void> {
  const startTime = Date.now();
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (options.customApiKey) {
      headers['x-albert-key'] = options.customApiKey;
    }

    const response = await fetch('/api/albert/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let errorMsg = `Erreur HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(errBody);
        if (parsed.error?.message) errorMsg = parsed.error.message;
        else if (typeof parsed.error === 'string') errorMsg = parsed.error;
      } catch {
        errorMsg = errBody || errorMsg;
      }
      callbacks.onError(errorMsg);
      return;
    }

    if (!response.body) {
      callbacks.onError('Flux de réponse non disponible');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let estimatedTokens = 0;
    let carbonKwh = 0;
    let carbonCo2 = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;

        if (trimmed.startsWith('data: ')) {
          try {
            const jsonStr = trimmed.slice(6);
            const parsed = JSON.parse(jsonStr);

            // Traitement du texte
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              callbacks.onChunk(deltaContent);
              estimatedTokens += Math.ceil(deltaContent.length / 4);
            }

            // Traitement de l'empreinte carbone et usage si fournis par l'API
            if (parsed.usage) {
              if (parsed.usage.completion_tokens) {
                estimatedTokens = parsed.usage.completion_tokens;
              }
              if (parsed.usage.carbon) {
                carbonKwh = parsed.usage.carbon.kWh?.min || parsed.usage.impacts?.kWh || 0;
                carbonCo2 = parsed.usage.carbon.kgCO2eq?.min || parsed.usage.impacts?.kgCO2eq || 0;
              }
            }
          } catch {
            // Ligne partielle ou non-JSON ignorée
          }
        }
      }
    }

    const latencyMs = Date.now() - startTime;
    callbacks.onUsage?.({
      tokens: estimatedTokens,
      latencyMs,
      carbonKwh: carbonKwh > 0 ? carbonKwh : estimatedTokens * 0.00000008,
      carbonCo2: carbonCo2 > 0 ? carbonCo2 : estimatedTokens * 0.0000000045,
    });
    callbacks.onDone();
  } catch (err: any) {
    callbacks.onError(err.message || 'Erreur de connexion à l’API Albert');
  }
}

export async function searchRagCorpus(
  query: string,
  categoryFilter?: string
): Promise<RagDocument[]> {
  const normalized = query.toLowerCase();

  // 1. Tenter un appel à l'API Albert /search
  try {
    const resp = await fetch('/api/albert/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 5 }),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data?.results) && data.results.length > 0) {
        return data.results.map((r: any, idx: number) => ({
          id: `remote-${idx}`,
          title: r.title || 'Document réglementaire Albert',
          source: r.source || 'Corpus DINUM / Légifrance',
          text: r.content || r.text || '',
          score: r.score || 0.85,
          date: r.date || '2026',
        }));
      }
    }
  } catch (err) {
    console.log('[RAG] Recherche locale sur le corpus Agrocampus', err);
  }

  // 2. Recherche sémantique / lexicale sur le corpus spécialisé Agrocampus & Enseignement Agricole
  const tokens = normalized.split(/\s+/).filter((t) => t.length > 2);
  const scored = AGROCAMPUS_KNOWLEDGE_DOCS.map((doc) => {
    let matchCount = 0;
    const fullText = (doc.title + ' ' + doc.text + ' ' + (doc.tags || []).join(' ')).toLowerCase();
    for (const token of tokens) {
      if (fullText.includes(token)) matchCount += 1;
    }
    const calculatedScore =
      tokens.length > 0
        ? Math.min(0.98, Math.max(0.4, 0.4 + (matchCount / tokens.length) * 0.55))
        : doc.score;

    return {
      ...doc,
      score: Math.round(calculatedScore * 100) / 100,
    };
  });

  return scored
    .filter((doc) => {
      if (categoryFilter && categoryFilter !== 'tous') {
        return doc.tags?.some((t) => t.toLowerCase() === categoryFilter.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => b.score - a.score);
}

export async function testAlbertConnection(key?: string): Promise<{
  ok: boolean;
  latencyMs: number;
  modelsCount: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const headers: Record<string, string> = {};
    if (key) headers['x-albert-key'] = key;

    const resp = await fetch('/api/albert/models', { headers });
    const latencyMs = Date.now() - start;

    if (!resp.ok) {
      const err = await resp.text();
      return { ok: false, latencyMs, modelsCount: 0, error: err };
    }

    const data = await resp.json();
    const count = Array.isArray(data?.data) ? data.data.length : 0;
    return { ok: true, latencyMs, modelsCount: count };
  } catch (err: any) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      modelsCount: 0,
      error: err.message || 'Hôte Albert inaccessible',
    };
  }
}
