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
    metadataSearch: 'Recherche de Métadonnées',
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
      date: 'ex. 1301, 1300-1400, après 1200, avant 1500, 14ème siècle, exactement 1250'
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
      text: 'Ce texte est le résultat d\'une transcription automatique. Une évaluation par échantillonnage a montré un taux d\'erreur variant entre 6 et 20% sur 600 manuscrits différents choisis au hasard. Certains manuscrits peuvent afficher des résultats médiocres.'
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
    searchButton: 'Rechercher',
    virtualKeyboard: 'Clavier Virtuel',
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
      traditional: 'Recherchez avec les opérateurs booléens (+, -, |, *, "phrases")…',
      vector: 'Recherche sémantique (ex. "homme pauvre", "cheval")…',
      hybrid: 'Recherche avec les méthodes traditionnelle et sémantique…'
    },
    guides: {
      traditional: {
        title: 'Opérateurs de Recherche Traditionnelle',
        tips: {
          and: 'signifie l\'opération ET',
          or: 'signifie l\'opération OU',
          not: 'nie un seul token',
          phrase: 'entoure les tokens pour former une phrase',
          prefix: 'à la fin d\'un terme est une requête de préfixe',
          precedence: 'signifient la précédence',
          fuzziness: 'après un mot = flou',
          slop: 'après une phrase = écart'
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
    title: 'À Propos de CoMMA Reader',
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
      readFull: 'Lire le Texte Complet',
      preprint: 'Prépublication (PDF)',
      copyCitation: 'Copier la Citation'
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