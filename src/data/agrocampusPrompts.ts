import { AgrocampusPrompt } from '../types';

export const AGROCAMPUS_PROMPTS: AgrocampusPrompt[] = [
  // --- EXPLOITATION AGRICOLE & MARAÎCHAGE PÉRI-URBAIN ---
  {
    id: 'exp-assolement-maraichage',
    category: 'exploitation',
    title: 'Plan d’assolement et rotation légumière bio',
    tag: 'Exploitation & Maraîchage',
    description:
      'Conception d’un plan de rotation pluriannuel (4 à 5 ans) sous abris et plein champ adapté au sol francilien et aux contraintes bio.',
    systemPrompt:
      'Tu es un ingénieur agronome expert en maraîchage biologique diversifié et formateur en lycée agricole. Tu apportes des conseils précis, agronomiquement rigoureux et opérationnels.',
    template: `Rédige un plan de rotation des cultures légumières sur [Nombre_Annees] ans pour une parcelle de [Surface_Parcelle] en maraîchage biologique péri-urbain.

Paramètres de l'exploitation :
- Type de sol et contexte : [Type_Sol]
- Cultures principales souhaitées : [Cultures_Cibles]
- Disponibilité en matière organique et compost de l'exploitation : [Ressources_Fertilisation]
- Débouchés : vente directe à la ferme et cantines scolaires

Structure attendue :
1. Découpage en blocs de rotation par familles botaniques (Solanacées, Brassicacées, Fabacées, Apiacées, Cucurbitacées).
2. Intégration d'engrais verts (trèfle, seigle, phacélie) pour la rupture des cycles de pathogènes.
3. Calendrier d'implantation et d'occupation des planches.
4. Synthèse des bénéfices agronomiques et sanitaires.`,
    variables: [
      {
        key: 'Nombre_Annees',
        label: 'Durée de la rotation (années)',
        defaultValue: '4',
        placeholder: 'ex: 4 ou 5',
      },
      {
        key: 'Surface_Parcelle',
        label: 'Surface concernée',
        defaultValue: '1,5 hectare (dont 1500 m² de tunnels froids)',
        placeholder: 'ex: 2 hectares',
      },
      {
        key: 'Type_Sol',
        label: 'Sol et localisation',
        defaultValue: 'Limon profond de plateau francilien, bien drainant (pH 6.8)',
        placeholder: 'ex: Limon-argileux, bord de Seine',
      },
      {
        key: 'Cultures_Cibles',
        label: 'Cultures prioritaires',
        defaultValue: 'Tomates anciennes, carottes de garde, poireaux, courges, salades, haricots',
        placeholder: 'ex: légumes d’hiver, courges, tomates',
      },
      {
        key: 'Ressources_Fertilisation',
        label: 'Fertilisation organique disponible',
        defaultValue: 'Fumier équin composté local (Yvelines) + compost de déchets verts de l’atelier paysage',
        placeholder: 'ex: compost vert + fumier bovin',
      },
    ],
  },

  {
    id: 'exp-gestion-eau-climat',
    category: 'exploitation',
    title: 'Plan de résilience hydrique & canicule en zone péri-urbaine',
    tag: 'Climat & Hydrologie',
    description:
      'Stratégie d’économie d’eau, dimensionnement de retenue/récupération d’eau de toiture des serres et gestion de crise sécheresse.',
    systemPrompt:
      'Tu es conseiller technique en gestion de l’eau agricole en Île-de-France auprès des chambres d’agriculture et des fermes expérimentales.',
    template: `Élabore un protocole technique de gestion et d'optimisation de la ressource en eau pour l'exploitation agricole d'Agrocampus.

Données du site :
- Surface de toiture des serres et hangars : [Surface_Toitures]
- Système d'irrigation actuel : [Systeme_Irrigation]
- Contraintes préfectorales en période estivale : [Niveau_Alerte_Secheresse]
- Besoins prioritaires : maraîchage diversifié, pépinière horticole et verger

Livrables attendus :
1. Calcul du potentiel de récupération annuel des eaux pluviales en Île-de-France (pluviométrie moyenne ~650mm).
2. Préconisations techniques de pilotage (sondes capacitives/tensiométriques, paillage organique, bâches tissées).
3. Plan d'urgence et d'arbitrage en cas d'arrêté préfectoral "Crise" (interdiction d'arrosage en journée).
4. Valorisation pédagogique pour les apprenants du lycée.`,
    variables: [
      {
        key: 'Surface_Toitures',
        label: 'Surface de toitures collectables (serres + hangars)',
        defaultValue: '2 800 m²',
        placeholder: 'ex: 2500 m²',
      },
      {
        key: 'Systeme_Irrigation',
        label: 'Matériel en place',
        defaultValue: 'Goutte-à-goutte sous abris et aspersion plein champ, forage avec compteur agréé',
        placeholder: 'ex: goutte-à-goutte, forages',
      },
      {
        key: 'Niveau_Alerte_Secheresse',
        label: 'Niveau de restriction cible',
        defaultValue: 'Arrêté sécheresse niveau "Alerte Renforcée" / "Crise"',
        placeholder: 'ex: Alerte ou Crise',
      },
    ],
  },

  {
    id: 'exp-charte-voisinage',
    category: 'exploitation',
    title: 'Charte de bon voisinage agricole en zone péri-urbaine',
    tag: 'Péri-urbain & Riverains',
    description:
      'Rédaction d’une charte d’engagement mutuel entre l’exploitation pédagogique et les riverains (bruit, poussière, travail matinal, traitements autorisés en bio).',
    systemPrompt:
      'Tu es médiateur et juriste spécialiste du droit rural et des zones de transition péri-urbaines (interface ville-campagne).',
    template: `Rédige une "Charte de bon voisinage et d'agribienveillance" pour l'exploitation agricole pédagogique de l'Agrocampus située à l'interface résidentielle péri-urbaine.

Contexte d'insertion :
- Quartier riverain : [Quartier_Riverains]
- Activités sources d'interrogations : [Activites_Sensibles]
- Actions vertueuses de l'exploitation : conduite 100% bio/HVE, ruches pédagogiques, vente de légumes aux riverains, entretien paysager durable

La charte doit comprendre :
1. Préambule rappelant la mission éducative, vivrière et paysagère de la ferme du lycée.
2. Engagements de l'exploitation (plages horaires des engins motorisés, information préalable des riverains, zéro produit phytosanitaire de synthèse).
3. Recommandations aux riverains (gestion des chiens non tenus en laisse, respect des clôtures et vergers, pas de déchets verts jetés sur les parcelles).
4. Modalités de dialogue (permanence d'échange, visite annuelle réservée aux voisins).`,
    variables: [
      {
        key: 'Quartier_Riverains',
        label: 'Contexte des riverains',
        defaultValue: 'Pavillons résidentiels bordant les parcelles de maraîchage et le verger conservatoire',
        placeholder: 'ex: Lotissement limitrophe, lisière de forêt',
      },
      {
        key: 'Activites_Sensibles',
        label: 'Activités à encadrer',
        defaultValue: 'Travail du sol au tracteur tôt le matin, fauche, livraison de compost, préservation des ruches',
        placeholder: 'ex: passage de tracteur, livraison fumier',
      },
    ],
  },

  // --- PÉDAGOGIE & ENSEIGNEMENT AGRICOLE (DGER) ---
  {
    id: 'ped-fiche-seance-tp',
    category: 'pedagogie',
    title: 'Fiche pédagogique de Travaux Pratiques (TP) sur l’exploitation',
    tag: 'Pédagogie DGER',
    description:
      'Préparation complète d’une séance de TP sur le plateau technique de la ferme avec objectifs pédagogiques, règles de sécurité EPI et grille d’observation.',
    systemPrompt:
      'Tu es enseignant formateur certifié en agronomie et sciences et techniques des équipements agricoles (STEI / STA) au sein de l’enseignement public agricole.',
    template: `Conçois une fiche de séance de Travaux Pratiques (TP) sur l'exploitation pédagogique pour des élèves de [Classe_Diplome].

Thématique de la séance : [Theme_Seance]
Durée : [Duree_TP]
Atelier support : [Atelier_Ferme]
Objectifs du référentiel DGER visés : [Capacites_Referentiel]

La fiche doit comprendre :
1. Fiche d'identité de la séance (prérequis, matériel, EPI obligatoires).
2. Consignes de sécurité et gestion des risques professionnels (chute, outil tranchant, TMS, produits autorisés).
3. Déroulement chronologique (phase d'accueil/briefing, mise en situation par binômes, débriefing collectif).
4. Critères de réussite observables et fiche d'auto-évaluation pour l'élève.`,
    variables: [
      {
        key: 'Classe_Diplome',
        label: 'Filière et niveau des élèves',
        defaultValue: 'Bac Pro Conduite et Gestion de l’Entreprise Agricole (CGEA) ou Aménagements Paysagers',
        placeholder: 'ex: BTSA Agronomie, Bac Pro CGEA',
      },
      {
        key: 'Theme_Seance',
        label: 'Thème du TP',
        defaultValue: 'Taille hivernale et greffage sur le verger conservatoire francilien',
        placeholder: 'ex: Plantation sous serre, diagnostic sol',
      },
      {
        key: 'Duree_TP',
        label: 'Durée',
        defaultValue: '3 heures 30',
        placeholder: 'ex: 4 heures',
      },
      {
        key: 'Atelier_Ferme',
        label: 'Atelier de la ferme',
        defaultValue: 'Verger pédagogique et pépinière arboricole',
        placeholder: 'ex: Serre horticole, maraîchage bio',
      },
      {
        key: 'Capacites_Referentiel',
        label: 'Capacité DGER visée',
        defaultValue: 'C5 : Réaliser les opérations de conduite technique des végétaux dans le respect de l’agroécologie',
        placeholder: 'ex: C6 Pilotage agronomique',
      },
    ],
  },

  {
    id: 'ped-grille-ccf',
    category: 'pedagogie',
    title: 'Sujet et grille d’évaluation CCF (Contrôle en Cours de Formation)',
    tag: 'Examens & CCF',
    description:
      'Élaboration d’une situation d’évaluation certificative CCF conforme à la note de service DGER avec grille critériée.',
    systemPrompt:
      'Tu es inspecteur pédagogique ou coordonnateur de filière dans l’enseignement agricole public.',
    template: `Rédige un sujet d'épreuve de CCF et sa grille d'évaluation sommative pour le diplôme [Diplome_Evalue].

Module / Épreuve ciblée : [Module_Epreuve]
Situation professionnelle support : [Situation_Professionnelle]

Le document doit comprendre :
1. Descriptif de la mise en situation professionnelle contextualisée sur une exploitation péri-urbaine.
2. Consignes remises au candidat et livrables attendus (dossier technique ou prestation pratique orale).
3. Grille d'évaluation critériée conforme DGER avec 4 niveaux d'acquisition (Non Acquis, En cours, Acquis, Maîtrisé).
4. Barème indicatif et guide de questionnement pour le jury de formateurs.`,
    variables: [
      {
        key: 'Diplome_Evalue',
        label: 'Diplôme préparé',
        defaultValue: 'BTSA Métiers du Végétal : alimentation, ornement et environnement (ou Aménagements Paysagers)',
        placeholder: 'ex: BTSA Agronomie, Bac Pro CGEA',
      },
      {
        key: 'Module_Epreuve',
        label: 'Module / Unité certificative',
        defaultValue: 'Épreuve E5 / Capacité professionnelle d’analyse et de choix techniques en agroécologie',
        placeholder: 'ex: E7 Conduite de projet',
      },
      {
        key: 'Situation_Professionnelle',
        label: 'Situation support',
        defaultValue: 'Transition vers le zéro plastique en maraîchage péri-urbain et choix de paillage biodégradable',
        placeholder: 'ex: Conversion AB d’un atelier',
      },
    ],
  },

  // --- CIRCUITS COURTS & ÉCONOMIE LOCALE ---
  {
    id: 'cc-boutique-ferme',
    category: 'circuits_courts',
    title: 'Stratégie de valorisation de la boutique de la ferme du lycée',
    tag: 'Vente directe & Circuits courts',
    description:
      'Plan d’action commercial pour fidéliser la clientèle de riverains franciliens, fixer les prix justes et valoriser le travail des apprenants.',
    systemPrompt:
      'Tu es conseiller en circuits courts et valorisation des productions fermières pour les établissements d’enseignement agricole.',
    template: `Rédige une stratégie d'attractivité et de gestion pour le point de vente direct (Boutique de la Ferme) d'Agrocampus.

Données du point de vente :
- Produits proposés : [Produits_Vente]
- Horaires d'ouverture : [Horaires_Ouverture]
- Clientèle cible : riverains de Saint-Germain-en-Laye et des communes voisines, personnels du campus, parents d'élèves
- Particularité : vitrine pédagogique de l'établissement public local

Éléments requis :
1. Argumentaire de vente valorisant la pédagogie ("Produit et récolté par les lycéens et apprentis") et le label Bio/HVE.
2. Proposition d'un système de paniers hebdomadaires avec pré-commande en ligne (type AMAP de campus).
3. Recommandations sur la grille tarifaire (équilibre entre accessibilité usagers et juste rémunération de l'atelier).
4. Plan de communication numérique et signalétique locale pour guider les usagers.`,
    variables: [
      {
        key: 'Produits_Vente',
        label: 'Gammes de produits',
        defaultValue: 'Légumes de saison bio, plants maraîchers et fleurs en pots de la serre, miel des ruches du campus, jus de pomme du verger',
        placeholder: 'ex: légumes bio, œufs, miel, plants',
      },
      {
        key: 'Horaires_Ouverture',
        label: 'Créneaux d’ouverture',
        defaultValue: 'Mercredi après-midi (14h-18h) et Vendredi soir (16h-19h)',
        placeholder: 'ex: Mercredi et Vendredi',
      },
    ],
  },

  {
    id: 'cc-restauration-collective',
    category: 'circuits_courts',
    title: 'Offre d’approvisionnement cantines scolaires & Loi EGalim',
    tag: 'EGalim & Cantines',
    description:
      'Montage d’une convention de fourniture locale entre l’exploitation du lycée et la restauration scolaire d’établissements voisins (lycées, collèges du département).',
    systemPrompt:
      'Tu es juriste en commande publique et gestionnaire de restauration collective durable.',
    template: `Rédige une proposition de conventionnement et un bordereau de prix indicatif pour fournir des légumes bio de l'exploitation d'Agrocampus aux cantines scolaires du bassin [Bassin_Territorial].

Cadre réglementaire :
- Respect des obligations de la Loi EGalim (au moins 50% de produits durables dont 20% bio).
- Volumes disponibles : [Volumes_Hebdo]
- Produits éligibles au calibre cantine : courges butternut, carottes de garde, poireaux lavés, pommes de terre, salades

Livrables de la proposition :
1. Note de présentation de l'offre locale et souveraine (traçabilité zéro kilomètre, intérêt éducatif inter-établissements).
2. Clauses logistiques et sanitaires (conditionnement en cagettes consignées, respect de la chaîne du froid, fréquence de livraison).
3. Clauses juridiques conformes au Code de la commande publique (achats sous le seuil des marchés publics ou allotissement géographique).
4. Modèle d'avenant pédagogique pour organiser une visite de la ferme par les collégiens mangeurs.`,
    variables: [
      {
        key: 'Bassin_Territorial',
        label: 'Territoire concerné',
        defaultValue: 'Boucle de la Seine / Communauté d’agglomération Saint Germain Boucles de Seine',
        placeholder: 'ex: Yvelines Nord / Communauté d’agglomération',
      },
      {
        key: 'Volumes_Hebdo',
        label: 'Capacité hebdomadaire estimée',
        defaultValue: '200 à 350 kg de légumes calibrés pour la cuisine centrale',
        placeholder: 'ex: 200 kg / semaine',
      },
    ],
  },

  // --- RÉGLEMENTATION & VEILLE SOUVERAINE ---
  {
    id: 'reg-cahier-bio-hve',
    category: 'reglementation',
    title: 'Audit de conformité cahier des charges Bio & HVE 3',
    tag: 'Réglementation & Labels',
    description:
      'Vérification des critères d’audit pour la double labellisation Agriculture Biologique et Haute Valeur Environnementale (biodiversité, phytos, fertilisation).',
    systemPrompt:
      'Tu es auditeur certificateur spécialisé dans les référentiels AB (règlement européen 2018/848) et HVE niveau 3 rénové.',
    template: `Rédige une grille d'auto-évaluation et de préparation d'audit pour le renouvellement des certifications AB et HVE de l'exploitation agricole d'Agrocampus.

Ateliers audités : [Ateliers_Audites]

Détaille de façon exhaustive :
1. Les 4 indicateurs clés HVE (biodiversité végétale/animale, stratégie phytosanitaire, gestion de la fertilisation, gestion de l'irrigation).
2. Les points de contrôle critiques en Agriculture Biologique (origine des semences et plants, registre d'interventions phytopharmaceutiques agréées, stockage des engrais).
3. La liste des pièces justificatives obligatoires à présenter à l'auditeur (factures semences non-OGM, carnet de parcelles, attestations de compostage).
4. Les écarts fréquents en milieu péri-urbain et comment les anticiper (risques de contaminations par dérive extérieure, étiquetage en vente directe).`,
    variables: [
      {
        key: 'Ateliers_Audites',
        label: 'Ateliers concernés',
        defaultValue: 'Maraîchage diversifié plein champ et tunnels, verger de pommiers/poiriers, rucher et pépinière',
        placeholder: 'ex: Maraîchage et verger',
      },
    ],
  },

  // --- ADMINISTRATION & GOUVERNANCE EPLEFPA ---
  {
    id: 'adm-note-conseil-administration',
    category: 'administration',
    title: 'Note de cadrage budgétaire pour le Conseil d’Administration',
    tag: 'Gouvernance EPLEFPA',
    description:
      'Rapport officiel présenté au Directeur d’EPLEFPA et au CA sur le bilan technico-économique de l’exploitation et les investissements à voter.',
    systemPrompt:
      'Tu es directeur d’exploitation agricole (DEA) rattaché à la direction générale de l’enseignement et de la recherche (DGER).',
    template: `Rédige la note d'orientation budgétaire et stratégique pour le prochain Conseil d'Administration de l'EPLEFPA Agrocampus concernant l'exploitation agricole.

Ordre du jour :
- Bilan de la campagne maraîchère et arboricole écoulée : [Bilan_Campagne]
- Projet d'investissement proposé : [Projet_Investissement]
- Montant estimé et plan de financement : [Montant_Financement]
- Rôle pédagogique : heures de formation délivrées sur l'exploitation au profit des apprenants

La note doit être formalisée selon les usages administratifs :
1. Synthèse exécutive pour les membres du CA (Région Île-de-France, représentants professionnels, syndicats agricoles, parents d'élèves).
2. Analyse technico-économique de l'atelier (chiffre d'affaires vente directe, charges opérationnelles).
3. Justification stratégique de l'investissement (transition écologique, diminution de la pénibilité pour les salariés et élèves).
4. Projet de délibération formelle à soumettre au vote du CA.`,
    variables: [
      {
        key: 'Bilan_Campagne',
        label: 'Résultat de la campagne précédente',
        defaultValue: 'Chiffre d’affaires boutique en hausse de 12%, récolte verger satisfaisante, charges énergie en hausse sous serres chauffées',
        placeholder: 'ex: CA en hausse, charges stables',
      },
      {
        key: 'Projet_Investissement',
        label: 'Investissement proposé',
        defaultValue: 'Acquisition d’une bineuse électrique maraîchère à guidage caméra et pose de filets anti-insectes climatiques',
        placeholder: 'ex: Bineuse électrique, serres bioclimatiques',
      },
      {
        key: 'Montant_Financement',
        label: 'Montant et subventions envisagées',
        defaultValue: '38 000 € HT (sollicitation aide PCAE Région Île-de-France à hauteur de 40%, autofinancement 60%)',
        placeholder: 'ex: 45 000 € HT',
      },
    ],
  },
];
