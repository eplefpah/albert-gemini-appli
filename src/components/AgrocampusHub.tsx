import React, { useState } from 'react';
import {
  Sprout,
  GraduationCap,
  Store,
  Users,
  Calendar,
  Droplets,
  FileText,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { AGROCAMPUS_PROMPTS } from '../data/agrocampusPrompts';

interface AgrocampusHubProps {
  onExecutePrompt: (promptText: string, systemPrompt?: string) => void;
}

export const AgrocampusHub: React.FC<AgrocampusHubProps> = ({ onExecutePrompt }) => {
  const [activePole, setActivePole] = useState<
    'exploitation' | 'pedagogie' | 'circuits_courts' | 'riverains'
  >('exploitation');

  // État du mini-générateur d'assolement express
  const [assolementSurface, setAssolementSurface] = useState('1,5 hectare');
  const [assolementCultures, setAssolementCultures] = useState('Tomates, Poireaux, Carottes, Courges');
  const [assolementAnnees, setAssolementAnnees] = useState('4 ans');

  // État du mini-générateur de fiche TP express
  const [tpNiveau, setTpNiveau] = useState('Bac Pro CGEA (Première/Terminale)');
  const [tpAtelier, setTpAtelier] = useState('Verger conservatoire et maraîchage sous abri');
  const [tpDuree, setTpDuree] = useState('3h30');
  const [tpTheme, setTpTheme] = useState('Taille fruitière et préparation de planches de cultures');

  // État du mini-générateur d'annonce boutique de la ferme
  const [boutiqueLegumes, setBoutiqueLegumes] = useState('Paniers de tomates anciennes, courgettes bio, jus de pomme du verger, miel du campus');
  const [boutiqueHoraires, setBoutiqueHoraires] = useState('Mercredi 14h-18h et Vendredi 16h-19h');

  // État du mini-générateur de dialogue riverains
  const [riverainsSujet, setRiverainsSujet] = useState('Préparation des sols au tracteur et fauche raisonnée en bordure de lotissement');

  const handleLaunchAssolement = () => {
    const prompt = `Génère un plan d'assolement et de rotation des cultures maraîchères biologiques sur ${assolementAnnees} pour une surface de ${assolementSurface} à Agrocampus Saint-Germain-en-Laye (sol limoneux francilien).
Cultures prioritaires : ${assolementCultures}.
Intègre les engrais verts d'interculture, la rupture des cycles de bioagresseurs et la gestion de la fertilisation organique locale (fumier composté).`;
    onExecutePrompt(
      prompt,
      'Tu es agronome formateur expert en maraîchage biologique diversifié au sein d’un lycée agricole public.'
    );
  };

  const handleLaunchTp = () => {
    const prompt = `Conçois une fiche pédagogique complète de séance de Travaux Pratiques (TP) sur l'exploitation pédagogique pour la classe de : ${tpNiveau}.
Atelier support : ${tpAtelier}.
Durée de la séance : ${tpDuree}.
Thème de la séance : ${tpTheme}.
Inclus : objectifs du référentiel DGER, consignes de sécurité et port des EPI, déroulement chronologique minuté et critères d'évaluation des compétences.`;
    onExecutePrompt(
      prompt,
      'Tu es enseignant formateur en sciences et technologies agronomiques (STA) en lycée agricole public.'
    );
  };

  const handleLaunchBoutique = () => {
    const prompt = `Rédige une communication attractive pour les riverains et la communauté d'Agrocampus pour la vente directe à la Boutique de la Ferme du lycée.
Produits de saison récoltés par les élèves : ${boutiqueLegumes}.
Horaires d'ouverture : ${boutiqueHoraires}.
Mets en valeur la fraîcheur locale (zéro km), le label Bio/HVE et le soutien à la formation professionnelle des futurs agriculteurs et paysagistes.`;
    onExecutePrompt(
      prompt,
      'Tu es chargé de communication et responsable de la commercialisation en circuits courts pour un EPLEFPA.'
    );
  };

  const handleLaunchRiverains = () => {
    const prompt = `Rédige une note d'information courtoise et pédagogique à destination des riverains voisins de l'exploitation d'Agrocampus.
Objet : ${riverainsSujet}.
Explique la nécessité agronomique de ces interventions, les mesures prises pour limiter les nuisances sonores et de poussière, et rappelle l'engagement de la ferme dans le zéro produit chimique de synthèse et la préservation de la biodiversité.`;
    onExecutePrompt(
      prompt,
      'Tu es directeur d’exploitation agricole attaché au dialogue serein avec les collectivités et les riverains en zone péri-urbaine.'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Bannière de contexte territorial */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Établissement Public Local d’Enseignement Agricole (EPLEFPA)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Espace Agrocampus · Saint-Germain-en-Laye
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Pilotez l’exploitation agricole pédagogique et les activités du lycée dans son
            environnement péri-urbain francilien grâce aux modèles d’intelligence artificielle
            souverains Albert DINUM.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">Bassin Territorial</span>
            <span>Yvelines · Plaine de Versailles & Boucle de Seine</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">Conduite</span>
            <span>Agriculture Biologique & HVE 3</span>
          </div>
        </div>
      </div>

      {/* Sélecteur de pôle métier */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActivePole('exploitation')}
          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
            activePole === 'exploitation'
              ? 'bg-blue-50/70 border-blue-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900">
              Exploitation & Maraîchage
            </span>
            <span className="text-[11px] text-slate-500">
              Assolement, eau, sol, bio
            </span>
          </div>
        </button>

        <button
          onClick={() => setActivePole('pedagogie')}
          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
            activePole === 'pedagogie'
              ? 'bg-blue-50/70 border-blue-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900">
              Pédagogie & Lycée (DGER)
            </span>
            <span className="text-[11px] text-slate-500">
              Fiches TP, CCF, diplômes
            </span>
          </div>
        </button>

        <button
          onClick={() => setActivePole('circuits_courts')}
          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
            activePole === 'circuits_courts'
              ? 'bg-blue-50/70 border-blue-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900">
              Boutique & Circuits Courts
            </span>
            <span className="text-[11px] text-slate-500">
              Vente directe, cantines EGalim
            </span>
          </div>
        </button>

        <button
          onClick={() => setActivePole('riverains')}
          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
            activePole === 'riverains'
              ? 'bg-blue-50/70 border-blue-300 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900">
              Riverains & Péri-urbain
            </span>
            <span className="text-[11px] text-slate-500">
              Charte voisinage, information
            </span>
          </div>
        </button>
      </div>

      {/* Contenu interactif selon le pôle choisi */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        {activePole === 'exploitation' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                Générateur d’Assolement & Gestion Maraîchère Bio
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Optimisez la rotation pluriannuelle pour limiter les adventices et maladies,
                maintenir la fertilité du sol limoneux et planifier les récoltes pour la vente directe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Surface totale de culture
                </label>
                <input
                  type="text"
                  value={assolementSurface}
                  onChange={(e) => setAssolementSurface(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Cycle de rotation
                </label>
                <select
                  value={assolementAnnees}
                  onChange={(e) => setAssolementAnnees(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="3 ans">3 ans (Court)</option>
                  <option value="4 ans">4 ans (Recommandé maraîchage francilien)</option>
                  <option value="5 ans">5 ans (Haut niveau agroécologique)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Cultures prioritaires
                </label>
                <input
                  type="text"
                  value={assolementCultures}
                  onChange={(e) => setAssolementCultures(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleLaunchAssolement}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Générer le plan d’assolement dans Albert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activePole === 'pedagogie' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                Générateur de Fiche de Séance TP sur l’Exploitation
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Concevez des fiches de travaux pratiques conformes aux compétences des référentiels
                de la DGER avec protocole de sécurité et critères d’évaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Filière et classe
                </label>
                <input
                  type="text"
                  value={tpNiveau}
                  onChange={(e) => setTpNiveau(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Atelier support de la ferme
                </label>
                <input
                  type="text"
                  value={tpAtelier}
                  onChange={(e) => setTpAtelier(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Thème d’apprentissage
                </label>
                <input
                  type="text"
                  value={tpTheme}
                  onChange={(e) => setTpTheme(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Durée de la séance
                </label>
                <input
                  type="text"
                  value={tpDuree}
                  onChange={(e) => setTpDuree(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleLaunchTp}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Rédiger la fiche pédagogique dans Albert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activePole === 'circuits_courts' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                Valorisation Boutique & Circuits Courts de Proximité
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Fidélisez les consommateurs du bassin de Saint-Germain-en-Laye et valorisez le
                travail pédagogique des apprenants avec des annonces de vente directe percutantes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Produits et paniers disponibles
                </label>
                <textarea
                  rows={2}
                  value={boutiqueLegumes}
                  onChange={(e) => setBoutiqueLegumes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Créneaux d’ouverture au public
                </label>
                <input
                  type="text"
                  value={boutiqueHoraires}
                  onChange={(e) => setBoutiqueHoraires(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleLaunchBoutique}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Générer l’annonce commerciale dans Albert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activePole === 'riverains' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-slate-900">
                Communication Péri-urbaine & Dialogue avec les Riverains
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Maintenez un climat de confiance avec les résidents limitrophes des parcelles
                agricoles en expliquant en amont les opérations culturales nécessaires.
              </p>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-700 mb-1">
                Sujet de l’intervention agricole à expliquer
              </label>
              <textarea
                rows={2}
                value={riverainsSujet}
                onChange={(e) => setRiverainsSujet(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleLaunchRiverains}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Rédiger le message riverains dans Albert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guide des bonnes pratiques Agrocampus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>Gestion de l’eau en Île-de-France</span>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed">
            Pluviométrie annuelle moyenne de 650 mm dans les Yvelines. Privilégier les paillages
            biodégradables et le goutte-à-goutte sous abri pour anticiper les arrêtés sécheresse.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conformité Bio & HVE 3</span>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed">
            Traçabilité obligatoire des interventions culturales, semences biologiques certifiées
            non-traitées et respect des bandes enherbées tampons en bordure de zones d’habitation.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Plan "Enseigner à Produire Autrement"</span>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed">
            Mise en œuvre du plan ministériel EPA 2 : faire de l’exploitation le laboratoire
            d’expérimentation agroécologique pour les élèves et apprentis d’Agrocampus.
          </p>
        </div>
      </div>
    </div>
  );
};
