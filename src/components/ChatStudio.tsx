import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Copy,
  Check,
  Download,
  Trash2,
  Plus,
  Sliders,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  Cpu,
  Leaf,
  Clock,
  Sparkles,
  Bot,
  User,
  Code,
} from 'lucide-react';
import {
  AlbertModel,
  ChatMessage,
  ConversationSession,
  UserSettings,
} from '../types';
import { streamAlbertChat } from '../services/albertApi';
import {
  syncSessionToSupabase,
  exportSingleSessionMarkdown,
} from '../services/storageService';
import { MarkdownViewer } from './MarkdownViewer';

interface ChatStudioProps {
  models: AlbertModel[];
  sessions: ConversationSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: (initialMessage?: string, systemPrompt?: string) => ConversationSession;
  onUpdateSession: (session: ConversationSession) => void;
  onDeleteSession: (id: string) => void;
  settings: UserSettings;
  pendingPrompt?: { text: string; systemPrompt?: string } | null;
  onClearPendingPrompt?: () => void;
}

export const ChatStudio: React.FC<ChatStudioProps> = ({
  models,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onUpdateSession,
  onDeleteSession,
  settings,
  pendingPrompt,
  onClearPendingPrompt,
}) => {
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [rawModeMessageIds, setRawModeMessageIds] = useState<Record<string, boolean>>({});

  const toggleRawMode = (id: string) => {
    setRawModeMessageIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isStreaming]);

  useEffect(() => {
    if (pendingPrompt && pendingPrompt.text && !isStreaming) {
      const textToRun = pendingPrompt.text;
      onClearPendingPrompt?.();
      handleSendMessage(textToRun);
    }
  }, [pendingPrompt]);

  // Modèle actuel
  const selectedModelId = currentSession?.model || settings.defaultModel;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isStreaming) return;

    let targetSession = currentSession;
    if (!targetSession) {
      targetSession = onCreateSession(text);
    }

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const assistantPlaceholderId = 'msg_asst_' + Date.now();
    const assistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model: selectedModelId,
      isStreaming: true,
    };

    const existingMessages = Array.isArray(targetSession?.messages)
      ? targetSession.messages
      : [];
    const updatedMessages = [...existingMessages, userMessage, assistantMessage];
    const sessionWithNewMessages: ConversationSession = {
      ...targetSession,
      title:
        existingMessages.length === 0
          ? text.slice(0, 36) + (text.length > 36 ? '...' : '')
          : targetSession.title,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    onUpdateSession(sessionWithNewMessages);
    setInputMessage('');
    setIsStreaming(true);

    // Formater la conversation pour l'API
    const apiMessages: Array<{ role: string; content: string }> = [];
    if (targetSession.systemPrompt) {
      apiMessages.push({ role: 'system', content: targetSession.systemPrompt });
    }
    existingMessages.forEach((m) => {
      apiMessages.push({ role: m.role, content: m.content });
    });
    apiMessages.push({ role: 'user', content: text.trim() });

    let accumulatedContent = '';

    await streamAlbertChat(
      selectedModelId,
      apiMessages,
      {
        temperature: targetSession.temperature ?? 0.3,
        maxTokens: targetSession.maxTokens ?? 2048,
        customApiKey: settings.albertApiKey,
      },
      {
        onChunk: (chunk) => {
          accumulatedContent += chunk;
          const currentMsgs = [...sessionWithNewMessages.messages];
          const lastIdx = currentMsgs.length - 1;
          if (lastIdx >= 0) {
            currentMsgs[lastIdx] = {
              ...currentMsgs[lastIdx],
              content: accumulatedContent,
              isStreaming: true,
            };
            onUpdateSession({
              ...sessionWithNewMessages,
              messages: currentMsgs,
              updatedAt: Date.now(),
            });
          }
        },
        onUsage: (usage) => {
          const currentMsgs = [...sessionWithNewMessages.messages];
          const lastIdx = currentMsgs.length - 1;
          if (lastIdx >= 0) {
            currentMsgs[lastIdx] = {
              ...currentMsgs[lastIdx],
              content: accumulatedContent,
              isStreaming: false,
              tokens: usage.tokens,
              latencyMs: usage.latencyMs,
              carbonKwh: usage.carbonKwh,
              carbonCo2: usage.carbonCo2,
            };
            const finalizedSession: ConversationSession = {
              ...sessionWithNewMessages,
              messages: currentMsgs,
              updatedAt: Date.now(),
            };
            onUpdateSession(finalizedSession);

            if (settings.autoSync) {
              syncSessionToSupabase(finalizedSession).then((res) => {
                if (res.success) {
                  setSyncStatus('Synchronisé');
                  setTimeout(() => setSyncStatus(null), 3000);
                }
              });
            }
          }
        },
        onError: (err) => {
          const currentMsgs = [...sessionWithNewMessages.messages];
          const lastIdx = currentMsgs.length - 1;
          if (lastIdx >= 0) {
            currentMsgs[lastIdx] = {
              ...currentMsgs[lastIdx],
              content: `⚠️ Erreur Albert DINUM : ${err}`,
              isStreaming: false,
            };
            onUpdateSession({
              ...sessionWithNewMessages,
              messages: currentMsgs,
            });
          }
          setIsStreaming(false);
        },
        onDone: () => {
          setIsStreaming(false);
        },
      }
    );
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleManualSync = async () => {
    if (!currentSession) return;
    setSyncStatus('En cours...');
    const res = await syncSessionToSupabase(currentSession);
    setSyncStatus(res.statusText);
    setTimeout(() => setSyncStatus(null), 3500);
  };

  const quickPrompts = [
    'Conçois un plan de fertilisation bio pour carottes et poireaux en sol francilien.',
    'Rédige une fiche d’évaluation CCF pour élèves de Bac Pro Aménagements Paysagers.',
    'Quelles sont les restrictions d’arrosage pour le maraîchage lors d’un arrêté Crise sécheresse ?',
    'Rédige un message pour les riverains expliquant le travail matinal du sol sur la ferme.',
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
      {/* Panneau latéral des sessions */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Conversations</span>
          <button
            onClick={() => onCreateSession()}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-slate-400">
              Aucune conversation archivée. Démarrez un échange avec Albert.
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`group flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  s.id === currentSession?.id
                    ? 'bg-blue-50 text-blue-900 border border-blue-200/80 font-medium'
                    : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="truncate">{s.title || 'Nouvel échange'}</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {new Date(s.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(s.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-opacity"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pied de liste : État et persistance */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
          <span>{sessions.length} session(s) locale(s)</span>
          {syncStatus && (
            <span className="text-blue-700 font-medium">{syncStatus}</span>
          )}
        </div>
      </aside>

      {/* Zone Principale de Chat */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Barre d'outils supérieure de session */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Sélecteur de modèle Albert */}
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-700 shrink-0" />
              <select
                value={selectedModelId}
                onChange={(e) => {
                  if (currentSession) {
                    onUpdateSession({ ...currentSession, model: e.target.value });
                  }
                }}
                className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[240px] truncate"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}
                  </option>
                ))}
              </select>
            </div>

            <span className="hidden sm:inline text-slate-300">|</span>

            {/* Titre & métadonnées sans pilule */}
            <span className="hidden sm:inline text-xs text-slate-500 truncate max-w-sm">
              {currentSession?.title || 'Nouvelle session Agrocampus'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bouton Paramètres avancés de session */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                showConfig
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paramètres modèle</span>
              {showConfig ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {/* Bouton export Markdown */}
            {currentSession && (currentSession.messages?.length || 0) > 0 && (
              <button
                onClick={() => exportSingleSessionMarkdown(currentSession)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                title="Exporter cette conversation en Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export .md</span>
              </button>
            )}

            {/* Bouton Synchroniser Supabase */}
            {currentSession && (
              <button
                onClick={handleManualSync}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                title="Synchroniser vers votre instance Supabase (185.219.215.120:8007)"
              >
                <CloudUpload className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Sync Supabase</span>
              </button>
            )}
          </div>
        </div>

        {/* Volet déroulant de configuration du modèle */}
        {showConfig && currentSession && (
          <div className="bg-slate-100/90 border-b border-slate-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Température : <span className="font-mono">{currentSession.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.05"
                value={currentSession.temperature}
                onChange={(e) =>
                  onUpdateSession({
                    ...currentSession,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                0 = Factuel & strict · 1 = Créatif
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Jetons max (Max Tokens) : <span className="font-mono">{currentSession.maxTokens}</span>
              </label>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={currentSession.maxTokens}
                onChange={(e) =>
                  onUpdateSession({
                    ...currentSession,
                    maxTokens: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-blue-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Longueur maximale de la réponse
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Consigne système (System Prompt)
              </label>
              <textarea
                value={currentSession.systemPrompt || ''}
                placeholder="ex: Tu es agronome expert en maraîchage biologique..."
                onChange={(e) =>
                  onUpdateSession({
                    ...currentSession,
                    systemPrompt: e.target.value,
                  })
                }
                rows={2}
                className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Flux de messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!currentSession || !currentSession.messages || currentSession.messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-4 border border-blue-200">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Albert DINUM · Assistant Agrocampus
              </h2>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto">
                Posez vos questions agronomiques, administratives, pédagogiques ou réglementaires.
                Toutes les requêtes sont traitées par l’infrastructure souveraine de l’État français.
              </p>

              {/* Suggestions Agrocampus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp)}
                    className="p-3 text-xs bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-lg text-slate-700 transition-colors text-left flex items-start gap-2 shadow-2xs group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{qp}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            (currentSession.messages || []).map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl mx-auto ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    AL
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                      m.role === 'user'
                        ? 'bg-blue-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none w-full shadow-2xs'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      rawModeMessageIds[m.id] ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[11px] text-slate-400 font-mono">
                            <span>Format brut Markdown</span>
                          </div>
                          <pre className="whitespace-pre-wrap font-mono text-[11.5px] text-slate-700 break-words bg-slate-50 p-2.5 rounded border border-slate-200 overflow-x-auto">
                            {m.content}
                          </pre>
                        </div>
                      ) : (
                        <MarkdownViewer
                          content={m.content}
                          isStreaming={m.isStreaming}
                        />
                      )
                    ) : (
                      <div className="whitespace-pre-wrap font-sans break-words text-white">
                        {m.content}
                      </div>
                    )}
                  </div>

                  {/* Métadonnées épurées (zéro pillule, séparateur ·) */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-mono tabular-nums px-1">
                    <span>
                      {new Date(m.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {m.role === 'assistant' && (
                      <>
                        {m.tokens ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{m.tokens} jetons</span>
                          </>
                        ) : null}

                        {m.latencyMs ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{m.latencyMs} ms</span>
                          </>
                        ) : null}

                        {m.carbonCo2 !== undefined && m.carbonCo2 > 0 ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 flex items-center gap-0.5">
                              <Leaf className="w-3 h-3 inline" />
                              {(m.carbonCo2 * 1000).toFixed(4)} gCO₂eq
                            </span>
                          </>
                        ) : null}

                        <span aria-hidden="true">·</span>
                        <button
                          onClick={() => toggleRawMode(m.id)}
                          className="hover:text-blue-700 transition-colors p-0.5 flex items-center gap-1 text-[11px] text-slate-500 font-sans"
                          title={
                            rawModeMessageIds[m.id]
                              ? 'Revenir à la mise en page enrichie'
                              : 'Afficher le format brut Markdown'
                          }
                        >
                          <Code className="w-3 h-3 inline" />
                          <span>{rawModeMessageIds[m.id] ? 'Formaté' : 'Brut'}</span>
                        </button>

                        <span aria-hidden="true">·</span>
                        <button
                          onClick={() => handleCopy(m.content, m.id)}
                          className="hover:text-slate-700 transition-colors p-0.5 flex items-center gap-1 text-[11px] text-slate-500 font-sans"
                          title="Copier le texte"
                        >
                          {copiedMessageId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-slate-100 rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-600 transition-all p-1.5"
            >
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Rédigez votre demande pour Albert (ex: préparation de TP, rotation de culture, arrêté sécheresse...)"
                rows={1}
                className="w-full text-xs sm:text-[13px] bg-transparent text-slate-800 placeholder-slate-400 px-3 py-2 focus:outline-none resize-none max-h-32 min-h-[40px]"
              />

              <div className="flex items-center gap-1 shrink-0 px-1">
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={() => setIsStreaming(false)}
                    className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Arrêter la génération"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      inputMessage.trim()
                        ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    title="Envoyer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>
                Shift + Entrée pour un saut de ligne · Modèle actif :{' '}
                <span className="font-mono text-slate-700 font-medium">
                  {selectedModelId}
                </span>
              </span>
              <span className="hidden sm:inline">
                API Albert DINUM · Souveraineté & Données protégées
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
