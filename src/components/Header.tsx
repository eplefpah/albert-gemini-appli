import React from 'react';
import { MessageSquare, Sprout, BookOpen, Search, Activity, Settings, Download, Database, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, RefreshCw } from 'lucide-react';
import { ApiHealthStatus } from '../types';

interface HeaderProps {
  currentTab: 'chat' | 'agrocampus' | 'prompts' | 'rag' | 'diagnostics';
  onSelectTab: (tab: 'chat' | 'agrocampus' | 'prompts' | 'rag' | 'diagnostics') => void;
  health: ApiHealthStatus | null;
  onRefreshHealth: () => void;
  onOpenSettings: () => void;
  onExportIonos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  health,
  onRefreshHealth,
  onOpenSettings,
  onExportIonos,
}) => {
  const albertOk = health?.albert.connected ?? true;
  const supabaseOk = health?.supabase.connected ?? true;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1 : Marque & Armoiries Républicaines discrètes */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-sm border border-blue-800">
              <span className="text-white text-xs font-semibold tracking-tighter">AL</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Albert DINUM
                </span>
                <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  Agrocampus
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Saint-Germain-en-Laye · Lycée & Exploitation
              </span>
            </div>
          </div>

          {/* Zone 2 : Navigation principale (Onglets métier) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => onSelectTab('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'chat'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Studio Chat</span>
            </button>

            <button
              onClick={() => onSelectTab('agrocampus')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'agrocampus'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exploitation & Lycée</span>
            </button>

            <button
              onClick={() => onSelectTab('prompts')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'prompts'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Gabarits Métier</span>
            </button>

            <button
              onClick={() => onSelectTab('rag')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'rag'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Recherche RAG</span>
            </button>

            <button
              onClick={() => onSelectTab('diagnostics')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'diagnostics'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Inspecteur API</span>
            </button>
          </nav>

          {/* Zone 3 : Indicateurs souverains & Actions */}
          <div className="flex items-center gap-2">
            {/* Statuts connectivité */}
            <div className="hidden lg:flex items-center gap-3 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 text-[11px] font-mono tabular-nums text-slate-600">
              <div
                className="flex items-center gap-1.5"
                title={`Albert DINUM API: ${albertOk ? 'Opérationnel' : 'Hors-ligne'}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${albertOk ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
                <span>Albert</span>
              </div>
              <span className="text-slate-300">|</span>
              <div
                className="flex items-center gap-1.5"
                title={`Supabase 185.219.215.120: ${supabaseOk ? 'Connecté' : 'Non joignable'}`}
              >
                <Database className="w-3 h-3 text-slate-400" />
                <span
                  className={`w-2 h-2 rounded-full ${supabaseOk ? 'bg-emerald-500' : 'bg-amber-500'}`}
                />
                <span>Supabase</span>
              </div>
            </div>

            {/* Export Ionos */}
            <button
              onClick={onExportIonos}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
              title="Exporter les conversations au format compatible Ionos /data/"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export Ionos /data/</span>
            </button>

            {/* Bouton Paramètres */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              title="Paramètres API & Connexions"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre mobile pour navigation rapide */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 text-xs">
          <button
            onClick={() => onSelectTab('chat')}
            className={`py-1 px-2 rounded ${currentTab === 'chat' ? 'font-bold text-blue-700' : 'text-slate-600'}`}
          >
            Chat
          </button>
          <button
            onClick={() => onSelectTab('agrocampus')}
            className={`py-1 px-2 rounded ${currentTab === 'agrocampus' ? 'font-bold text-blue-700' : 'text-slate-600'}`}
          >
            Exploitation
          </button>
          <button
            onClick={() => onSelectTab('prompts')}
            className={`py-1 px-2 rounded ${currentTab === 'prompts' ? 'font-bold text-blue-700' : 'text-slate-600'}`}
          >
            Gabarits
          </button>
          <button
            onClick={() => onSelectTab('rag')}
            className={`py-1 px-2 rounded ${currentTab === 'rag' ? 'font-bold text-blue-700' : 'text-slate-600'}`}
          >
            RAG
          </button>
          <button
            onClick={() => onSelectTab('diagnostics')}
            className={`py-1 px-2 rounded ${currentTab === 'diagnostics' ? 'font-bold text-blue-700' : 'text-slate-600'}`}
          >
            API
          </button>
        </div>
      </div>
    </header>
  );
};
