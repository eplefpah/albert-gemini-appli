import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  ExternalLink,
  MessageSquareShare,
  Sparkles,
  FileCheck,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { RagDocument } from '../types';
import { searchRagCorpus } from '../services/albertApi';

interface RagSearchProps {
  onInjectIntoChat: (contextDoc: RagDocument) => void;
}

export const RagSearch: React.FC<RagSearchProps> = ({ onInjectIntoChat }) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('tous');
  const [results, setResults] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tags = [
    'tous',
    'Législation',
    'Maraîchage',
    'Pédagogie',
    'Péri-urbain',
    'Sécheresse',
    'EGalim',
  ];

  const handleSearch = async (searchTerm = query) => {
    setIsLoading(true);
    try {
      const docs = await searchRagCorpus(searchTerm, selectedTag);
      setResults(docs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, [selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Explorateur RAG · Recherche Documentaire & Textes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Interrogez les corpus réglementaires, codes ruraux, arrêtés préfectoraux franciliens et
          référentiels de diplômes DGER. Les extraits pertinents peuvent être directement injectés
          dans Albert pour fonder une analyse sourcée.
        </p>
      </div>

      {/* Barre de recherche & filtres */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: seuils nitrates Île-de-France, dispense CCF, restrictions irrigation crise, Loi EGalim cantines..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Rechercher</span>
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
          <span className="text-slate-400 text-[11px] mr-1">Filtrer :</span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                selectedTag === t
                  ? 'bg-blue-100 text-blue-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des résultats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{results.length} document(s) trouvé(s)</span>
          <span className="font-mono text-[11px]">Index : Albert /v1/search + Agrocampus</span>
        </div>

        {results.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
            Aucun extrait ne correspond à votre recherche. Essayez d’autres mots-clés ou réinitialisez les filtres.
          </div>
        ) : (
          results.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                    <FileCheck className="w-4 h-4 shrink-0" />
                    <span>{doc.source}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-500">
                    {doc.date && <span>{doc.date}</span>}
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">
                      Score : {(doc.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {doc.text}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  {doc.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-slate-500 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-blue-700 transition-colors ml-2"
                      title="Consulter le texte officiel"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-[11px]">Texte source</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => onInjectIntoChat(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-2xs"
                >
                  <MessageSquareShare className="w-3.5 h-3.5" />
                  <span>Analyser avec Albert dans le Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
