import React, { useState } from 'react';
import { BookOpen, ListFilter as Filter, ArrowRight, Copy, Check, Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { AgrocampusPrompt } from '../types';
import { AGROCAMPUS_PROMPTS } from '../data/agrocampusPrompts';

interface PromptsLibraryProps {
  onExecutePrompt: (promptText: string, systemPrompt?: string) => void;
}

export const PromptsLibrary: React.FC<PromptsLibraryProps> = ({ onExecutePrompt }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrompt, setActivePrompt] = useState<AgrocampusPrompt | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'tous', label: 'Toutes les catégories' },
    { id: 'exploitation', label: 'Exploitation & Maraîchage' },
    { id: 'pedagogie', label: 'Pédagogie & Lycée' },
    { id: 'circuits_courts', label: 'Circuits Courts & Cantines' },
    { id: 'reglementation', label: 'Réglementation & Bio' },
    { id: 'administration', label: 'Administration EPLEFPA' },
  ];

  const filteredPrompts = AGROCAMPUS_PROMPTS.filter((p) => {
    const matchCategory = selectedCategory === 'tous' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenPrompt = (prompt: AgrocampusPrompt) => {
    setActivePrompt(prompt);
    const initialVals: Record<string, string> = {};
    prompt.variables.forEach((v) => {
      initialVals[v.key] = v.defaultValue;
    });
    setVariableValues(initialVals);
  };

  const computeSubstitutedText = (prompt: AgrocampusPrompt): string => {
    let result = prompt.template;
    prompt.variables.forEach((v) => {
      const val = variableValues[v.key] ?? v.defaultValue;
      result = result.replaceAll(`[${v.key}]`, val);
    });
    return result;
  };

  const handleCopySubstituted = () => {
    if (!activePrompt) return;
    const text = computeSubstitutedText(activePrompt);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    if (!activePrompt) return;
    const text = computeSubstitutedText(activePrompt);
    onExecutePrompt(text, activePrompt.systemPrompt);
    setActivePrompt(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bibliothèque de Gabarits Métier Albert
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Gabarits d’ingénierie d’invites rédigés et validés pour l’enseignement agricole,
            la conduite d’exploitation péri-urbaine et l’administration d’établissement.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un gabarit..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grille des gabarits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            onClick={() => handleOpenPrompt(p)}
            className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500 font-mono">
                <span>{p.tag}</span>
                <span>{p.variables.length} paramètre(s)</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                {p.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-medium">
              <span>Personnaliser & exécuter</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal interactif de configuration du gabarit */}
      {activePrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider">
                  {activePrompt.tag}
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {activePrompt.title}
                </h2>
              </div>
              <button
                onClick={() => setActivePrompt(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                {activePrompt.description}
              </p>

              {/* Formulaire des variables */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-800 block">
                  Paramètres de votre situation :
                </span>

                {activePrompt.variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700">
                      {v.label}
                    </label>
                    <input
                      type="text"
                      value={variableValues[v.key] ?? v.defaultValue}
                      onChange={(e) =>
                        setVariableValues({
                          ...variableValues,
                          [v.key]: e.target.value,
                        })
                      }
                      placeholder={v.placeholder}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                ))}
              </div>

              {/* Aperçu du texte résolu */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-800 block mb-1">
                  Aperçu de la requête pour Albert :
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700 font-sans whitespace-pre-wrap max-h-44 overflow-y-auto">
                  {computeSubstitutedText(activePrompt)}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={handleCopySubstituted}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copié dans le presse-papier</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le texte</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePrompt(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLaunch}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lancer dans le Studio Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
