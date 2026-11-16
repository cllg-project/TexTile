export default {
  appTitle: 'CoMMA',
  navigation: {
    browseLibrary: 'Parcourir la Bibliothèque',
    textSearch: 'Recherche de Texte',
    about: 'À Propos'
  },
  theme: {
    switchTo: 'Basculer vers le mode {mode}',
    light: 'clair',
    dark: 'sombre'
  },
  language: {
    switch: 'Changer de langue',
    current: 'Langue : {lang}'
  },
  catalog: {
    title: 'Catalogue de Manuscrits',
    subtitle: 'Parcourir les collections et documents',
    searchPlaceholder: 'Rechercher dans le catalogue...',
    metadataSearchPlaceholder: 'Rechercher dans les métadonnées des manuscrits...',
    expandAll: 'Développer Tout',
    collapseAll: 'Réduire Tout',
    searchMode: 'Mode de Recherche',
    legacyBrowse: 'Navigation Classique',
    browse: 'Navigation',
    metadataSearch: 'Recherche de Métadonnées',
    search: 'Recherche',
    noResults: 'Aucun résultat trouvé',
    loading: 'Chargement...',
    searchTypes: {
      general: 'Recherche Générale',
      language: 'Recherche par Langue',
      date: 'Recherche par Date'
    },
    searchDescriptions: {
      general: 'Rechercher dans tous les champs de métadonnées (contenu, langue, localisation, notes, etc.)',
      language: 'Rechercher spécifiquement les langues des manuscrits',
      date: 'Rechercher par dates de création des manuscrits et plages de dates avec syntaxe flexible'
    },
    placeholders: {
      general: 'ex. Tournai, manuscrit, notes, contenu...',
      language: 'ex. lat, fre, "lat, fre", latin...',
      date: 'ex. 0-1600, 800, 1301, 800-1500, après 1200, avant 1500, 14ème siècle, vers 1250'
    }
  },
  collection: {
    backToCatalog: 'Retour au Catalogue',
    collections: 'Collections',
    resources: 'Ressources',
    pickResource: 'Choisissez une ressource pour ouvrir le lecteur.',
    rawResponse: 'Réponse brute (debug)',
    hideLeft: 'Masquer à gauche',
    showLeft: 'Afficher à gauche'
  },
  document: {
    loading: 'Chargement...',
    navigation: 'Navigation',
    search: 'Recherche',
    settings: 'Paramètres',
    citation: 'Citation',
    info: {
      title: 'Informations du document',
      metadata: 'Métadonnées',
      author: 'Auteur',
      origin: 'Origine',
      date: 'Date',
      language: 'Langue',
      type: 'Type',
      description: 'Description',
      id: 'ID',
      keywords: 'Mots-clés',
      sources: 'Sources',
      identifiers: 'Identifiants',
      tokens: 'Mots',
      ocrQuality: 'Lignes bien reconnues',
      unknownLanguage: 'Inconnue',
      biblissimaLink: 'Lien Biblissima',
      downloadDocument: 'Télécharger le document'
    },
    previousPage: 'Page Précédente',
    nextPage: 'Page Suivante',
    goToPage: 'Aller au passage',
    goToPlaceholder: 'Aller au passage',
    pageCounter: '{current} / {total}',
    textSize: 'Taille du Texte',
    increase: 'Augmenter',
    decrease: 'Diminuer',
    reset: 'Réinitialiser',
    searchPlaceholder: 'Rechercher dans le document...',
    searchResults: 'Résultats de Recherche',
    noMatches: 'Aucun résultat pour l\'instant.',
    clearHighlights: 'Effacer',
    copyCitation: 'Copier la Citation',
    cite: {
      title: 'Citer ce document',
      copy: 'Copier'
    },
    display: {
      title: 'Affichage',
      textSize: 'Taille du texte'
    },
    disclaimer: {
      title: 'Avertissement — Transcription automatique :',
      text: 'Ce texte a été généré automatiquement. La plupart des transcriptions atteignent plus de 90 % de précision, mais certains manuscrits — notamment ceux à l’écriture difficile ou de mauvaise qualité d’image — peuvent comporter de nombreuses erreurs, voire être totalement erronés. Les premières pages contiennent souvent des notes manuscrites plutôt que le texte principal ; nous vous recommandons de faire défiler jusqu’à la première page de contenu pour une meilleure impression.'
    },
    iiif: {
      title: 'Visualiseur de Manuscrit',
      noManifest: 'Aucune image de manuscrit disponible',
      sync: 'Synchroniser avec le passage actuel'
    }
  },
  search: {
    title: 'Recherche de Texte',
    subtitle: 'Rechercher dans le texte transcrit de tous les manuscrits',
    exportConcordance: 'Exporter la concordance (CSV)',
    exportConcordanceHint: 'Télécharger chaque occurrence avec son contexte gauche et droit, dans l\'ordre de lecture',
    tabResults: 'Passages',
    tabConcordance: 'Concordance',
    tabStats: 'Statistiques',
    concWidth: 'Contexte (caractères)',
    concSort: 'Trier cette page par',
    concSortOrder: 'Ordre de lecture',
    concSortLeft: 'Contexte gauche',
    concSortRight: 'Contexte droit',
    concSummary: '{pages} pages correspondantes · {rows} occurrences sur cette page',
    statsOccurrences: 'Occurrences',
    statsPer10k: 'Pour 10 000 tokens',
    statsPer10kHint: 'Occurrences pour 10 000 tokens des manuscrits du périmètre recherché',
    statsManuscripts: 'Manuscrits concernés',
    statsDistinctForms: 'Formes distinctes',
    statsMetric: 'Mesure',
    statsForms: 'Formes trouvées',
    statsByCentury: 'Par siècle',
    statsByLanguage: 'Par langue',
    statsByManuscript: 'Par manuscrit',
    statsUndated: '{count} occurrences dans des manuscrits non datés ne sont pas affichées ci-dessus',
    statsMore: 'Afficher {count} de plus',
    statsLess: 'Afficher moins',
    statsDownload: 'Télécharger les statistiques (CSV)',
    statsComputing: 'Comptage des occurrences…',
    statsProgress: '{pages} pages sur {total} · {occurrences} occurrences pour le moment',
    statsPreliminary: 'Chiffres provisoires, le comptage continue',
    statsStop: 'Arrêter',
    statsStopped: 'Le comptage a été arrêté : ces chiffres sont partiels.',
    statsCached: 'Résultat enregistré le {when}',
    statsRecompute: 'Recalculer',
    statsBusy: 'Le serveur calcule déjà d\'autres statistiques. Réessayez dans quelques secondes.',
    statsRetry: 'Réessayer',
    statsTruncatedOccurrences: 'Le comptage s\'est arrêté au maximum de {count} occurrences : ces chiffres ne portent que sur la première partie du corpus.',
    statsTruncatedTime: 'Le comptage s\'est arrêté après {seconds} secondes : ces chiffres ne portent que sur la première partie du corpus.',
    tipsButton: 'Aide à la recherche',
    tryExamples: 'Essayez',
    resultsCount: '{count} résultat | {count} résultats',
    modeLabel: 'Correspondance',
    searchButton: 'Rechercher',
    specialKeyboard: 'Clavier Spécial',
    languageFilter: 'Langue',
    allLanguages: 'Toutes les Langues',
    noResults: 'Aucun résultat.',
    pagination: {
      page: 'Page {current} sur {total}'
    },
    placeholders: {
      traditional: 'Recherchez avec les opérateurs booléens (+, -, ｜, *, "phrases")…'
    },
    mode: {
      exact: 'Correspondance Exacte',
      partial: 'Correspondance Partielle',
      fuzzy: 'Correspondance Floue',
      descriptions: {
        exact: 'Recherche uniquement les correspondances de phrases exactes',
        partial: 'Permet les correspondances de mots partiels et la recherche de sous-chaînes',
        fuzzy: 'Permet les correspondances approximatives avec tolérance aux fautes de frappe'
      }
    },
    guides: {
      traditional: {
        tips: {
          multiWord: 'pour rechercher plusieurs mots, ex. "deus,deum"',
          phrase: 'pour phrase exacte, ex. "la bouche"',
          wildcard: 'utilisez \'*\' comme joker pour correspondre aux préfixes de mots (ex. \'reg*\' correspond à \'regnum\') — disponible uniquement en Correspondance Exacte'
        }
      }
    }
  },
  about: {
    title: 'CoMMA',
    subtitle: 'Transcrire le Moyen Âge',
    description: 'Manuscrits navigables vers 800–1600, préservant l\'orthographe et les abréviations originales.',
    projectTitle: 'À Propos du Projet',
    overline: 'Latin Médiéval et Ancien Français',
    hero: {
      description: 'Manuscrits navigables vers 800–1600, préservant l\'orthographe et les abréviations originales.'
    },
    stats: {
      tokens: 'Tokens',
      manuscripts: 'Manuscrits',
      timePeriod: 'Période',
      languages: 'Langues',
      languageSubtitle: 'Latin et Ancien Français'
    },
    intro: {
      browsableCollection: 'Une collection navigable de {count}+ numérisations de manuscrits en latin médiéval et ancien français.',
      preservation: 'Les textes préservent les abréviations, orthographes et caractéristiques de mise en page originales — utiles pour la recherche, mais ne remplacent pas la transcription humaine.',
      paperDescription: 'Ce travail est décrit en détail dans l\'article de recherche',
      paperTitle: '"CoMMA, a Large-scale Corpus of Multilingual Medieval Archives"',
      paperAuthors: 'par Thibault Clérice, Simon Gabay, Malamatenia Vlachou-Efstathiou, Ariane Pinche, et Benoît Sagot (2025).',
      readFull: 'Lire le Texte Complet',
      lrecPaper: 'Article LREC (PDF)',
      copyCitation: 'Copier la Citation',
      tryItNow: 'Essayez maintenant',
      searchPlaceholder: 'Rechercher dans 3,3 milliards de tokens de texte médiéval...',
      downloadCorpus: 'Télécharger le Corpus'
    },
    detailed: {
      title: 'À propos de ce Corpus',
      description: 'Cette plateforme donne accès à un corpus à grande échelle de manuscrits médiévaux produits entre vers 800–1600. Le corpus a été créé à partir de numérisations publiquement disponibles et préserve le texte original, non normalisé — y compris les abréviations, les variations d\'orthographe et de nombreuses caractéristiques généralement invisibles dans les éditions.',
      limitations: {
        title: 'Limitations Importantes',
        automatic: 'Transcription automatique uniquement : les textes ont été produits par des systèmes HTR/OCR. Taux d\'erreur de caractères (CER) ≈ 9–11% en moyenne.',
        segmentation: 'Problèmes de segmentation et de mise en page : la détection automatique de zones peut manquer les marginalia ou les décorations complexes.',
        abbreviations: 'Abréviations préservées : les abréviations sont conservées sous leur forme graphématique (encodages MUFI/NFD).',
        substitute: 'Ne remplace pas une édition critique : validez avec une transcription manuelle pour un texte de qualité publication.'
      },
      showShort: 'Afficher l\'Introduction Courte'
    },
    contact: {
      title: 'Questions, Corrections ou Commentaires ?',
      description: 'Si vous trouvez des erreurs, des pages manquantes, ou soupçonnez des échecs OCR importants, veuillez contacter l\'équipe du corpus avec l\'identifiant du manuscrit et une brève description.',
      contactTeam: 'Contacter l\'Équipe',
      projectPage: 'Page du Projet / Code'
    },
    sponsors: {
      title: 'Financement et Soutien',
      fundingText: 'Ce travail a bénéficié d\'une aide de l\'État gérée par l\'Agence Nationale de la Recherche au titre de France 2030 portant la référence « ANR-24-RRII-0002 » et opéré par le Programme Inria Quadran.'
    },
    citation: {
      copied: 'Citation copiée',
      failed: 'Échec de la copie — veuillez copier manuellement'
    }
  },
  projectInfo: {
    overline: 'Corpus de Manuscrits Médiévaux',
    title: 'CoMMA - Transcription Automatique du Patrimoine Écrit Médiéval',
    subtitle: 'Un corpus unique au monde de manuscrits médiévaux transcrits automatiquement grâce à l\'intelligence artificielle.',
    introduction: {
      corpus: 'Nous avons constitué un corpus unique au monde de manuscrits médiévaux, transcrits automatiquement grâce à l\'intelligence artificielle (HTR – Handwritten Text Recognition). Il est la suite logique de nos travaux antérieurs autour de ',
      catmusDescription: ', un jeu de données massif pour l\'entraînement de modèle de reconnaissance d\'écriture manuscrite dans les manuscrits médiévaux.',
      paper: 'Le corpus présenté ici est décrit dans un article, en anglais, présentant aussi ses limites et le cadre de sa création: ',
      paperLink: 'Article de Recherche'
    },
    paper: {
      title: 'Article de Recherche et Crédits',
      description: 'Ce corpus est décrit dans l\'article de recherche',
      paperTitle: 'CoMMA, a Large-scale Corpus of Multilingual Medieval Archives',
      authors: 'Thibault Clérice, Simon Gabay, Malamatenia Vlachou-Efstathiou, Ariane Pinche, Benoît Sagot',
      year: '2025',
      abstract: 'Nous présentons CoMMA, un corpus à grande échelle de manuscrits médiévaux produit par reconnaissance automatique de texte. Le corpus contient environ 3,3 milliards de tokens issus de plus de 33 000 manuscrits numérisés en latin et en ancien français, récoltés via IIIF.',
      viewPaper: 'Voir l\'Article Complet'
    },
    features: {
      title: 'Caractéristiques du Corpus',
      items: [
        {
          title: 'Un corpus massif :',
          description: 'plus de 33 000 manuscrits, environ 3,3 milliards de mots en latin et en ancien français.'
        },
        {
          title: 'Un empan chronologique important :',
          description: 'du 9e siècle au 16e siècle inclu !'
        },
        {
          title: 'Des sources issues de grandes bibliothèques numériques européennes :',
          description: '(BnF Gallica, Bodleian, e-codices, etc.).'
        },
        {
          title: 'Une approche innovante :',
          description: 'textes transcrits automatiquement à partir des images, sans normalisation éditoriale, permettant d\'explorer la richesse et la diversité de l\'écrit médiéval.'
        },
        {
          title: 'Un outil pour les sciences et les technologies :',
          description: 'ressource librement disponible, utile aussi bien pour les humanités numériques (histoire de la langue, philologie, histoire du livre) que pour les sciences informatiques (entraînement de modèles de traitement automatique du langage).'
        },
        {
          title: 'Perspectives :',
          description: 'le corpus sera progressivement enrichi de nouveaux fonds et de nouvelles langues médiévales, incluant l\'italien et d\'autres traditions.'
        },
        {
          title: 'Une évaluation de la reconnaissance de texte automatisée :',
          description: 'chaque ligne de texte produite est soumise à un modèle chargé d\'estimer sa qualité du point de vue linguistique et de sa plausibilité générale. Ce dispositif sert de proxy à l\'évaluation de la qualité de transcription, en l\'absence de vérité de terrain. Le système s\'inspire des méthodes présentées dans <a href="https://enc.hal.science/hal-03828529/" target="_blank" rel="noopener" class="text-primary text-decoration-none font-weight-medium">Ground-truth Free Evaluation of HTR on Old French and Latin Medieval Literary Manuscripts</a>. Une bonne ligne correspond à une ligne avec entre 25% et 0% d\'erreurs.'
        }
      ]
    },
    limitations: {
      title: 'Limites Connues',
      transcription: 'La transcription automatique n\'est pas parfaite — selon les manuscrits, l\'erreur peut varier entre 6 % et 25 %, et certains documents difficiles (écriture cursive, pages endommagées, numérisations de faible qualité) peuvent produire des résultats encore moins fiables. Des erreurs telles que "ri" pour "n" ne sont pas exclues, mais d\'autres ne produisant rien de sensé ne sont pas impossibles.',
      coverage: 'Tous les manuscrits de la BnF ne sont pas présents, de même que le corpus est le fruit des biais même des différentes institutions en termes de numérisation de leurs fonds.'
    },
    projects: {
      title: 'Projets et Financements',
      description: 'Ce corpus a été produit dans le cadre des projets ',
      and: ' et',
      biblissima: 'Produit avec l\'aide de l\'équipex Biblissima+ pour l\'identification des sources et les métadonnées, et des logiciels tels que Kraken ou eScriptorium.'
    },
    technology: {
      title: 'Technologies Utilisées',
      dtsUi: {
        description: 'Interface web pour parcourir et rechercher dans le corpus, développée par Hassen Aguili.',
        uiRepo: 'Dépôt Interface',
        backendRepo: 'Dépôt Backend'
      },
      mydapytains: {
        description: 'Développé par Thibault Clérice, financé par le projet PIQ CLLG (Mention ANR).',
        viewRepo: 'Voir le Dépôt'
      },
      kraken: {
        description: 'Développé par Benjamin Kiessling, Kraken a été utilisé pour la reconnaissance automatique du texte manuscrit médiéval.',
        viewRepo: 'Voir le Dépôt'
      },
      catmus: {
        description: 'Un modèle spécialisé pour transcrire les manuscrits médiévaux en écriture latine, utilisé avec Kraken pour une reconnaissance de texte de haute précision.',
        viewPaper: 'Voir l\'Article'
      }
    },
    stats: {
      title: 'Statistiques du Corpus',
      manuscripts: 'Manuscrits',
      words: 'Mots',
      timespan: 'Période'
    },
    languages: {
      title: 'Langues',
      latin: 'Latin Médiéval',
      oldFrench: 'Ancien Français',
      italian: 'Italien'
    },
    sources: {
      title: 'Sources Principales',
      others: 'Et d\'autres...'
    },
    contact: {
      title: 'Contact',
      description: 'Pour toute question ou suggestion concernant le corpus.',
      button: 'Contacter l\'Équipe'
    }
  },
  browse: {
    title: 'Bibliothèque',
    subtitle: 'Rechercher et parcourir les collections et les manuscrits',
    searchLabel: 'Rechercher dans la bibliothèque',
    searchPlaceholder: 'Titre, cote, éditeur, année… ex. Smith 19',
    searchIn: 'Rechercher dans {title}',
    searchingIn: 'Recherche dans {title}',
    searchWholeLibrary: 'Rechercher dans toute la bibliothèque',
    searchButton: 'Rechercher',
    language: 'Langue',
    yearFrom: 'De l\'année',
    yearTo: 'À l\'année',
    reset: 'Réinitialiser',
    tabManuscripts: 'Manuscrits',
    tabCollections: 'Collections',
    resultsCount: '{count} résultat | {count} résultats',
    noResults: 'Aucun résultat. Essayez moins de mots ou retirez un filtre.',
    topLevel: 'Collections',
    emptyLibrary: 'La bibliothèque est vide.',
    emptyCollection: 'Cette collection est vide.',
    sortDefault: 'Ordre par défaut',
    sortTitle: 'Titre (A–Z)',
    sortSize: 'Plus volumineuses d\'abord',
    collection: 'Collection',
    manuscript: 'Manuscrit',
    manuscripts: 'Manuscrits',
    subCollections: 'Sous-collections',
    contents: 'Contenu',
    items: '{count} élément | {count} éléments',
    pages: '{count} page | {count} pages',
    tokens: '{count} tokens',
    identifier: 'Identifiant',
    read: 'Lire',
    backToLibrary: 'Retour à la bibliothèque',
    notFound: 'Cette collection est introuvable.'
  },
  common: {
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    close: 'Fermer',
    open: 'Ouvrir',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non'
  },
  languages: {
    latin: 'Latin',
    french: 'Français',
    oldFrench: 'Ancien français',
    middleFrench: 'Moyen français',
    italian: 'Italien',
    english: 'Anglais',
    german: 'Allemand',
    spanish: 'Espagnol',
    occitan: 'Occitan',
    hebrew: 'Hébreu',
    ancientGreek: 'Grec ancien',
    dutch: 'Néerlandais',
    oldEnglish: 'Vieil anglais',
    irish: 'Irlandais',
    catalan: 'Catalan',
    arabic: 'Arabe',
    czech: 'Tchèque',
    turkish: 'Turc',
    welsh: 'Gallois',
    cornish: 'Cornique',
    undetermined: 'Indéterminé',
    hebrewItalian: 'Hébreu/Italien'
  }
}