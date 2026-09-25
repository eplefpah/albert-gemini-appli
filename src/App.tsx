import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatStudio } from './components/ChatStudio';
import { AgrocampusHub } from './components/AgrocampusHub';
import { PromptsLibrary } from './components/PromptsLibrary';
import { RagSearch } from './components/RagSearch';
import { ApiDiagnostics } from './components/ApiDiagnostics';
import { SettingsModal } from './components/SettingsModal';
import {
  AlbertModel,
  ApiHealthStatus,
  ConversationSession,
  RagDocument,
  UserSettings,
} from './types';
import { getAlbertModels } from './services/albertApi';
import {
  loadLocalSessions,
  saveLocalSessions,
  upsertLocalSession,
  deleteLocalSession,
  loadUserSettings,
  saveUserSettings,
  exportToIonosDataFile,
} from './services/storageService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'chat' | 'agrocampus' | 'prompts' | 'rag' | 'diagnostics'
  >('chat');

  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());
  const [models, setModels] = useState<AlbertModel[]>([]);
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    const loaded = loadLocalSessions();
    if (loaded && loaded.length > 0) return loaded;
    const initialSession: ConversationSession = {
      id: 'session_' + Date.now(),
      title: 'Accueil & Échange Albert',
      model: 'ministral-3-8b-instruct-2512',
      systemPrompt:
        'Tu es Albert, l’intelligence artificielle souveraine développée par la DINUM pour le service public et l’enseignement agricole.',
      temperature: 0.3,
      maxTokens: 2048,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    upsertLocalSession(initialSession);
    return [initialSession];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    () => (sessions[0]?.id || null)
  );
  const [pendingPrompt, setPendingPrompt] = useState<{
    text: string;
    systemPrompt?: string;
  } | null>(null);
  const [health, setHealth] = useState<ApiHealthStatus | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Charger les modèles réels d'Albert DINUM
  const refreshModels = async (key?: string) => {
    const list = await getAlbertModels(key || settings.albertApiKey);
    setModels(list);
  };

  // Contrôler la santé des services
  const refreshHealth = async () => {
    try {
      const resp = await fetch('/api/health');
      if (resp.ok) {
        const data = await resp.json();
        setHealth(data);
      }
    } catch {
      // Échec silencieux
    }
  };

  useEffect(() => {
    refreshModels();
    refreshHealth();

    const interval = setInterval(() => {
      refreshHealth();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Création d'une nouvelle session
  const handleCreateSession = (
    initialMessage?: string,
    systemPrompt?: string
  ): ConversationSession => {
    const newSession: ConversationSession = {
      id: 'session_' + Date.now(),
      title: initialMessage
        ? initialMessage.slice(0, 36) + (initialMessage.length > 36 ? '...' : '')
        : 'Nouvel échange',
      model: settings.defaultModel || models[0]?.id || 'ministral-3-8b-instruct-2512',
      systemPrompt:
        systemPrompt ||
        'Tu es Albert, l’intelligence artificielle souveraine développée par la DINUM pour le service public et l’enseignement agricole.',
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    const updated = upsertLocalSession(newSession);
    setSessions(updated);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  // Mise à jour d'une session
  const handleUpdateSession = (session: ConversationSession) => {
    const updated = upsertLocalSession(session);
    setSessions(updated);
  };

  // Suppression d'une session
  const handleDeleteSession = (id: string) => {
    const updated = deleteLocalSession(id);
    setSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated[0]?.id || null);
    }
  };

  // Exécution d'un gabarit ou prompt depuis un autre onglet
  const handleExecutePromptFromOtherTab = (
    promptText: string,
    systemPrompt?: string
  ) => {
    handleCreateSession(promptText, systemPrompt);
    setPendingPrompt({ text: promptText, systemPrompt });
    setCurrentTab('chat');
  };

  // Injection d'un document RAG dans une question pour Albert
  const handleInjectRagIntoChat = (doc: RagDocument) => {
    const prompt = `Voici un texte de référence (${doc.source}) :
"""
${doc.text}
"""

Peux-tu m'expliquer précisément comment cette réglementation ou ces dispositions s'appliquent à un lycée agricole et une exploitation péri-urbaine comme celle d'Agrocampus Saint-Germain-en-Laye ?`;

    handleExecutePromptFromOtherTab(
      prompt,
      'Tu es juriste et conseiller agronomique pour l’enseignement public agricole.'
    );
  };

  // Sauvegarde des paramètres
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
    refreshModels(newSettings.albertApiKey);
    refreshHealth();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        health={health}
        onRefreshHealth={refreshHealth}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportIonos={() => exportToIonosDataFile(sessions)}
      />

      <div className="flex-1 flex flex-col">
        {currentTab === 'chat' && (
          <ChatStudio
            models={models}
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onCreateSession={handleCreateSession}
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
            settings={settings}
            pendingPrompt={pendingPrompt}
            onClearPendingPrompt={() => setPendingPrompt(null)}
          />
        )}

        {currentTab === 'agrocampus' && (
          <AgrocampusHub onExecutePrompt={handleExecutePromptFromOtherTab} />
        )}

        {currentTab === 'prompts' && (
          <PromptsLibrary onExecutePrompt={handleExecutePromptFromOtherTab} />
        )}

        {currentTab === 'rag' && (
          <RagSearch onInjectIntoChat={handleInjectRagIntoChat} />
        )}

        {currentTab === 'diagnostics' && (
          <ApiDiagnostics
            models={models}
            health={health}
            settings={settings}
            onRefreshHealth={refreshHealth}
          />
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
