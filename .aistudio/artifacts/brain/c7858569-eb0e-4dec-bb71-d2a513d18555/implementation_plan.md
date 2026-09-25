# Console Albert DINUM & Portail IA Souveraine

Un centre de commande moderne, ergonomique et épuré conçu pour exploiter l'ensemble des capacités de l'API Albert de l'État français (DINUM / Etalab) : streaming de conversation, recherche sémantique documentaire (RAG), bibliothèque de gabarits administratifs, diagnostic d'API en temps réel et double persistance locale & Supabase.

---

### Examen utilisateur & Décisions critiques

> [!IMPORTANT]
> Les ajustements demandés par l'utilisateur sont intégrés au plan :

- **Langue de l'interface** : **100% Français (Confirmé)**. L'ensemble de la console (navigation, menus, paramètres, diagnostics, invites de commande, gabarits administratifs, infobulles et notifications) est exclusivement rédigé en français soigné.
- **Identité visuelle** : **Thème Clair Moderne & Épuré (Confirmé)**. Remplacement du thème sombre par une interface claire à haute lisibilité inspirée des standards du design public français (fond blanc pur `#ffffff` et gris très doux `#f8fafc`, séparateurs ultra-fins `#e2e8f0`, touches de bleu souverain/Marianne `#000091` / `#1d4ed8`, typographie haute densité `#0f172a` et chiffres tabulaires `tabular-nums`).
- **Persistance des données** : **Double architecture Locale & Supabase (Confirmée)**. Stockage local instantané et hors-ligne dans le navigateur (IndexedDB/localStorage) couplé à une synchronisation paramétrable vers l'instance Supabase privée (`http://185.219.215.120:8007`). Un proxy serveur Express (`/api/albert/*` et `/api/supabase/*`) neutralise le blocage navigateur HTTPS/HTTP (Mixed Content).
- **Périmètre fonctionnel Albert API** : **Suite Complète (Confirmée)**.
  1. *Studio de Conversation* : Sélecteur de modèles en direct (ex. `albert-light`, `albert-large`, `mistral`, etc.), prompt système ajustable, réglage température/tokens, streaming en direct, arborescence et exports (JSON, Markdown, format Ionos `/data/`).
  2. *Explorateur RAG & Recherche* : Interrogation directe de l'endpoint `/v1/search` et des corpus réglementaires et administratifs (Légifrance, circulaires, fiches usagers), réinjection du contexte pertinent dans le chat.
  3. *Bibliothèque d'invites administratives* : Gabarits métier pré-intégrés (synthèse de dossier, analyse juridique, courrier administratif officiel, simplification de texte pour l'usager) avec formulaire de variables et exécution instantanée.
  4. *Inspecteur d'API & Diagnostics* : Analyseur de latence, comptage des jetons, visualiseur de requêtes/réponses JSON brutes et générateur de commandes cURL.
- **Identifiants préconfigurés** : Clé API Albert fournie (`sk-eyJhbGciOi...`) et serveur Supabase (`http://185.219.215.120:8007`) pré-injectés côté serveur avec panneau de configuration modifiable par l'utilisateur.

---

### 1. Vue d'ensemble & Concept fondamental

- **Mission** : Offrir une interface souveraine, rapide et intuitive pour travailler avec les modèles d'intelligence artificielle de l'État (Albert DINUM), sans recourir à des outils propriétaires non souverains.
- **Utilisateurs cibles** : Agents publics, juristes, chefs de projet et développeurs souhaitant interagir avec Albert pour la génération de texte, l'interrogation de bases de connaissances publiques et l'archivage de leurs échanges.
- **Valeur ajoutée** : Regroupe en un seul écran le chat haute performance, la recherche documentaire RAG, des invites administratives éprouvées et un pont de données sécurisé vers votre base Supabase ou un dossier d'hébergement Ionos.

---

### 2. Expérience Utilisateur & Design Visuel (Thème Clair)

#### Parcours Utilisateur Clés
1. **Session de Conversation Studio** :
   - Sélection du modèle Albert via le menu déroulant dynamique alimenté par `/v1/models`.
   - Ajustement optionnel des paramètres (température, jetons max, consignes système).
   - Saisie d'une demande administrative avec affichage en streaming temps réel, coloration syntaxique, calcul du débit de jetons et copie/exportation en 1 clic.
2. **Explorateur Documentaire RAG & Recherche** :
   - Requête en langage naturel sur le corpus disponible via `/v1/search`.
   - Visualisation des extraits documentaires, scores de pertinence et sources.
   - Bouton d'action directe : "Injecter dans la conversation".
3. **Bibliothèque de Gabarits Administratifs** :
   - Navigation par rubriques (*Synthèse*, *Juridique*, *Communication Usagers*, *Courrier Officiel*).
   - Remplissage interactif des champs dynamiques et exécution immédiate dans le modèle sélectionné.
4. **Synchronisation Supabase & Export Ionos** :
   - Indicateur d'état de synchronisation en temps réel avec le serveur `185.219.215.120:8007`.
   - Bouton de sauvegarde / synchronisation immédiate et export d'un fichier JSON structuré prêt à être déposé dans un répertoire Ionos `/data/`.

#### Charte Graphique & Ambiance
- **Ambiance** : Console claire, professionnelle, précise et structurée selon les codes de l'administration républicaine moderne.
- **Palette de couleurs** :
  - *Toile de fond (60%)* : Blanc pur `#ffffff` et fond de travail très doux `#f8fafc`.
  - *Surfaces et cartes (30%)* : Blanc immaculé `#ffffff`, bordures ultra-fines nettes `border-slate-200` (`#e2e8f0`), texte principal ardoise foncée `#0f172a`, texte secondaire `#64748b`.
  - *Accents (10%)* : Bleu Marianne institutionnel `#000091`, bleu d'action `#1d4ed8`, vert émeraude `#059669` (état connecté), ambre `#d97706` (traitement), rouge rubis `#dc2626` (erreur).
- **Typographie** :
  - *Titres et navigation* : Plus Jakarta Sans (graisse 600, espacement soigné).
  - *Corps de texte* : Plus Jakarta Sans / Satoshi (lecture confortable à 13px–14px).
  - *Données et code* : JetBrains Mono / IBM Plex Mono avec chiffres tabulaires (`tabular-nums`) pour les jetons, la latence et les payloads JSON.
- **Discipline anti-slop** :
  - Métadonnées épurées sans capsules superflues, séparées par des puces discrètes `·` (ex. `albert-large · 380 jetons · 210 ms`).
  - Aucun faux compteur ni score arbitraire : métriques réelles basées sur les appels d'API.

---

### 3. Décisions Techniques & Arbitrages

- **Proxy Serveur Express (`server.ts`)** :
  - *Solution* : Un backend Express léger relaie les requêtes client vers `https://albert.api.etalab.gouv.fr/v1` et `http://185.219.215.120:8007`.
  - *Justification* : Évite le blocage du navigateur dû à la politique de sécurité "Mixed Content" (appel d'une IP HTTP non chiffrée depuis une URL d'application HTTPS) et gère les en-têtes CORS sans conflit.
- **Architecture de Persistance Hybride** :
  - *Solution* : Stockage local instantané (IndexedDB/localStorage) par défaut, avec passerelle de synchronisation vers la table Supabase de l'utilisateur.
  - *Justification* : Zéro temps de latence au chargement, résistance aux coupures réseau temporaires du serveur privé, et réplication transparente quand le serveur distant répond.
- **Export compatible Ionos `/data/`** :
  - *Solution* : Module d'exportation générant un fichier `albert_conversations.json` ou par date (`YYYY-MM-DD_session.json`) directement téléchargeable ou synchronisable.

---

### 4. Architecture Technique & Schéma des Composants

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CLIENT REACT VITE (THÈME CLAIR)                      │
│  ┌───────────────────┐  ┌────────────────────┐  ┌───────────────────┐  │
│  │ Studio de Chat    │  │ Explorateur RAG    │  │ Gabarits Prompts  │  │
│  │ (Flux streaming)  │  │ (Corpus & Sources) │  │ (Métiers Publics) │  │
│  └─────────┬─────────┘  └──────────┬─────────┘  └─────────┬─────────┘  │
│            │                       │                      │            │
│            ▼                       ▼                      ▼            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                Gestionnaires d'État & Contrôleurs                │  │
│  │   • Cache Local IndexedDB / LocalStorage (Snappy & Offline)      │  │
│  │   • Gestionnaire de Sync Supabase & Export Ionos /data/          │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ Requêtes HTTP internes
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         SERVEUR PROXY EXPRESS                          │
│  ┌─────────────────────────────────┬────────────────────────────────┐  │
│  │     Route /api/albert/*         │     Route /api/supabase/*      │  │
│  │  • Injection du Bearer Albert   │  • Relais IP 185.219.215.120   │  │
│  │  • Gestion du flux SSE          │  • Contourne le Mixed Content  │  │
│  └─────────────────┬───────────────┴────────────────┬───────────────┘  │
└────────────────────┼────────────────────────────────┼──────────────────┘
                     │ HTTPS                          │ HTTP
                     ▼                                ▼
       ┌───────────────────────────┐   ┌───────────────────────────────┐
       │     API Albert DINUM      │   │   Instance Supabase Privée    │
       │ albert.api.etalab.gouv.fr │   │     185.219.215.120:8007      │
       └───────────────────────────┘   └───────────────────────────────┘
```

#### Modèles de données
- **Conversation** : `id`, `titre`, `modele`, `inviteSysteme`, `creeLe`, `misAJourLe`, `messages: Message[]`, `synchroniseSupabase: boolean`.
- **Message** : `id`, `role: 'user' | 'assistant' | 'system'`, `contenu: string`, `horodatage: number`, `jetons?: number`, `latenceMs?: number`.
- **GabaritPrompt** : `id`, `categorie: 'synthese' | 'juridique' | 'courrier' | 'usagers'`, `titre: string`, `description: string`, `inviteSysteme?: string`, `modelePrompt: string`, `variables: string[]`.
- **Configuration** : Clés d'API, adresses d'accès, paramètres de génération et état de la connexion Supabase.
