export default {
  appTitle: 'CoMMA Reader',
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
      title: 'Infos du Document',
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
      unknownLanguage: 'Inconnu',
      biblissimaLink: 'Lien Biblissima'
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
      title: 'Avis de Transcription Automatique :',
      text: 'Ce texte est le résultat d\'une transcription automatique. Une évaluation par échantillonnage a montré un taux d\'erreur variant entre 0 et 100% sur 600 manuscrits différents choisis au hasard, avec une moyenne inférieure à 10% CER globalement.'
    },
    iiif: {
      title: 'Visualiseur de Manuscrit',
      noManifest: 'Aucune image de manuscrit disponible',
      sync: 'Synchroniser avec le passage actuel'
    }
  },
  search: {
    title: 'Recherche de Texte',
    searchGuide: 'GUIDE DE RECHERCHE',
    searchMethod: 'Méthode de Recherche',
    searchType: 'Type de Recherche',
    traditional: 'Traditionnelle',
    vector: 'Sémantique',
    hybrid: 'Hybride',
    comingSoon: 'Bientôt Disponible',
    searchButton: 'Rechercher',
    virtualKeyboard: 'Clavier Virtuel',
    specialKeyboard: 'Clavier Spécial',
    results: 'Résultats',
    noResults: 'Aucun résultat.',
    showingResults: 'Affichage de {start}–{end} sur {total}',
    pagination: {
      first: 'Première',
      prev: 'Préc.',
      next: 'Suiv.',
      last: 'Dernière',
      page: 'Page {current} sur {total}'
    },
    placeholders: {
      traditional: 'Recherchez avec les opérateurs booléens (+, -, ｜, *, "phrases")…',
      vector: 'Recherche sémantique (ex. "homme pauvre", "cheval")…',
      hybrid: 'Recherche avec les méthodes traditionnelle et sémantique…'
    },
    mode: {
      title: 'Mode de Recherche',
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
        title: 'Conseils de Recherche',
        tips: {
          multiWord: 'pour rechercher plusieurs mots, ex. "deus,deum"',
          phrase: 'pour phrase exacte, ex. "la bouche"',
          wildcard: "utilisez '*' comme joker pour correspondre aux préfixes de mots (ex. 'reg*' correspond à 'regnum') — disponible uniquement en Correspondance Exacte"
        }
      },
      vector: {
        title: 'Conseils de Recherche Sémantique',
        tips: {
          natural: 'Utilisez des requêtes en langage naturel',
          conceptual: 'Recherche par similarité conceptuelle',
          variations: 'Trouve automatiquement les variations d\'orthographe',
          abbreviations: 'Fonctionne avec les abréviations médiévales',
          try1: 'Essayez :',
          try2: 'Essayez :',
          try3: 'Essayez :',
          ranking: 'Résultats classés par similarité'
        },
        examples: {
          poor: 'homme pauvre',
          horse: 'cheval',
          love: 'amour courtois'
        }
      },
      hybrid: {
        title: 'Recherche Hybride',
        description: 'Combine la correspondance exacte traditionnelle avec la similarité sémantique pour des résultats complets.',
        usage: 'Utilisez n\'importe quel type de requête - le système trouvera les correspondances exactes et le contenu conceptuellement similaire.'
      }
    },
    sections: {
      traditional: 'Résultats de Recherche Traditionnelle',
      semantic: 'Résultats de Recherche Sémantique'
    },
    results: {
      textMatch: 'correspondance textuelle',
      semantic: 'sémantique',
      semanticMatches: 'Correspondances sémantiques :',
      language: 'Langue :'
    },
    descriptions: {
      traditional: 'Correspondance exacte rapide avec opérateurs booléens et jokers',
      vector: 'Recherche par similarité sémantique - trouve du contenu conceptuellement similaire et des variantes d\'orthographe',
      hybrid: 'Combine la recherche traditionnelle et sémantique pour des résultats complets'
    }
  },
  about: {
    title: 'CoMMA Reader',
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
      preprint: 'Prépublication (PDF)',
      copyCitation: 'Copier la Citation',
      tryItNow: 'Essayez maintenant',
      searchPlaceholder: 'Rechercher dans 2,5 milliards de tokens de texte médiéval...',
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
      abstract: 'Nous présentons CoMMA, un corpus à grande échelle de manuscrits médiévaux produit par reconnaissance automatique de texte. Le corpus contient environ 2,5 milliards de tokens issus de plus de 23 000 manuscrits numérisés en latin et en ancien français, récoltés via IIIF.',
      viewPaper: 'Voir l\'Article Complet'
    },
    features: {
      title: 'Caractéristiques du Corpus',
      items: [
        {
          title: 'Un corpus massif :',
          description: 'plus de 23 000 manuscrits, environ 2,5 milliards de mots en latin et en ancien français.'
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
        description: 'développé par Hassen Aguili, dont le code est disponible à l\'adresse '
      },
      mydapytains: {
        description: 'développé par Thibault Clérice, financé par le projet PIQ CLLG (Mention ANR), disponible à l\'adresse '
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
  }
}