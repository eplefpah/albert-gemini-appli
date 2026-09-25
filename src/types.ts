export interface AlbertModel {
  id: string;
  type?: string;
  aliases?: string[];
  owned_by?: string;
  max_context_length?: number | null;
  created?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  tokens?: number;
  latencyMs?: number;
  carbonKwh?: number;
  carbonCo2?: number;
  isStreaming?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  isSyncedSupabase?: boolean;
  category?: 'agrocampus' | 'pedagogie' | 'exploitation' | 'general';
}

export interface PromptVariable {
  key: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  options?: string[];
}

export interface AgrocampusPrompt {
  id: string;
  category: 'exploitation' | 'pedagogie' | 'reglementation' | 'administration' | 'circuits_courts';
  title: string;
  description: string;
  tag: string;
  systemPrompt?: string;
  template: string;
  variables: PromptVariable[];
}

export interface RagDocument {
  id: string;
  title: string;
  source: string;
  text: string;
  score: number;
  date?: string;
  url?: string;
  tags?: string[];
}

export interface ApiHealthStatus {
  status: string;
  timestamp: string;
  albert: {
    connected: boolean;
    latencyMs: number;
    endpoint: string;
  };
  supabase: {
    connected: boolean;
    latencyMs: number;
    url: string;
  };
}

export interface UserSettings {
  albertApiKey: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  supabaseUrl: string;
  supabaseUser: string;
  supabasePass: string;
  autoSync: boolean;
}
