export default {
  appTitle: 'CoMMA Reader',
  navigation: {
    browseLibrary: 'Browse Library',
    textSearch: 'Text Search',
    about: 'About'
  },
  theme: {
    switchTo: 'Switch to {mode} mode',
    light: 'light',
    dark: 'dark'
  },
  language: {
    switch: 'Switch language',
    current: 'Language: {lang}'
  },
  catalog: {
    title: 'Manuscript Catalog',
    subtitle: 'Browse collections and documents',
    searchPlaceholder: 'Search catalog...',
    metadataSearchPlaceholder: 'Search manuscript metadata...',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    searchMode: 'Search Mode',
    legacyBrowse: 'Legacy Browse',
    metadataSearch: 'Metadata Search',
    noResults: 'No results found',
    loading: 'Loading...',
    searchTypes: {
      general: 'General Search',
      language: 'Language Search',
      date: 'Date Search'
    },
    searchDescriptions: {
      general: 'Search across all metadata fields (content, language, location, notes, etc.)',
      language: 'Search specifically for manuscript languages',
      date: 'Search by manuscript creation dates and date ranges with flexible syntax'
    },
    placeholders: {
      general: 'e.g., Tournai, manuscript, notes, content...',
      language: 'e.g., lat, fre, "lat, fre", latin...',
      date: 'e.g., 1301, 1300-1400, after 1200, before 1500, 14th century, exactly 1250'
    }
  },
  collection: {
    backToCatalog: 'Back to Catalog',
    collections: 'Collections',
    resources: 'Resources',
    pickResource: 'Pick a resource to open the reader.',
    rawResponse: 'Raw response (debug)',
    hideLeft: 'hide left',
    showLeft: 'show left'
  },
  document: {
    loading: 'Loading...',
    navigation: 'Navigation',
    search: 'Search',
    settings: 'Settings',
    citation: 'Citation',
    previousPage: 'Previous Page',
    nextPage: 'Next Page',
    goToPage: 'Go to passage',
    goToPlaceholder: 'Go to passage',
    pageCounter: '{current} / {total}',
    textSize: 'Text Size',
    increase: 'Increase',
    decrease: 'Decrease',
    reset: 'Reset',
    searchPlaceholder: 'Search in document...',
    searchResults: 'Search Results',
    noMatches: 'No results yet.',
    clearHighlights: 'Clear',
    copyCitation: 'Copy Citation',
    cite: {
      title: 'Cite this document',
      copy: 'Copy'
    },
    display: {
      title: 'Display',
      textSize: 'Text size'
    },
    disclaimer: {
      title: 'Automatic Transcription Notice:',
      text: 'This text is the result of automatic transcription. A sampled evaluation has shown an error rate varying between 6 and 20% on 600 random different manuscripts.'
    }
  },
  search: {
    title: 'Text Search',
    searchGuide: 'SEARCH GUIDE',
    searchMethod: 'Search Method',
    searchType: 'Search Type',
    traditional: 'Traditional',
    vector: 'Semantic',
    hybrid: 'Hybrid',
    searchButton: 'Search',
    virtualKeyboard: 'Virtual Keyboard',
    results: 'Results',
    noResults: 'No results.',
    showingResults: 'Showing {start}–{end} of {total}',
    pagination: {
      first: 'first',
      prev: 'prev',
      next: 'next',
      last: 'last',
      page: 'page {current} of {total}'
    },
    placeholders: {
      traditional: 'Search with Boolean operators (+, -, |, *, "phrases")…',
      vector: 'Search semantically (e.g., "homme pauvre", "cheval")…',
      hybrid: 'Search with both traditional and semantic methods…'
    },
    guides: {
      traditional: {
        title: 'Traditional Search Operators',
        tips: {
          and: 'signifies AND operation',
          or: 'signifies OR operation',
          not: 'negates a single token',
          phrase: 'wraps tokens to make a phrase',
          prefix: 'at the end of a term is a prefix query',
          precedence: 'signify precedence',
          fuzziness: 'after a word = fuzziness',
          slop: 'after a phrase = slop'
        }
      },
      vector: {
        title: 'Semantic Search Tips',
        tips: {
          natural: 'Use natural language queries',
          conceptual: 'Searches for conceptual similarity',
          variations: 'Finds spelling variations automatically',
          abbreviations: 'Works with medieval abbreviations',
          try1: 'Try:',
          try2: 'Try:',
          try3: 'Try:',
          ranking: 'Results ranked by similarity'
        },
        examples: {
          poor: 'homme pauvre',
          horse: 'cheval',
          love: 'amour courtois'
        }
      },
      hybrid: {
        title: 'Hybrid Search',
        description: 'Combines traditional exact matching with semantic similarity for comprehensive results.',
        usage: 'Use any query type - the system will find both exact matches and conceptually similar content.'
      }
    },
    sections: {
      traditional: 'Traditional Search Results',
      semantic: 'Semantic Search Results'
    },
    results: {
      textMatch: 'text match',
      semantic: 'semantic',
      semanticMatches: 'Semantic matches:',
      language: 'Language:'
    },
    descriptions: {
      traditional: 'Fast exact matching with Boolean operators and wildcards',
      vector: 'Semantic similarity search - finds conceptually similar content and spelling variants',
      hybrid: 'Combines traditional and semantic search for comprehensive results'
    }
  },
  about: {
    title: 'About CoMMA Reader',
    subtitle: 'Transcribing the Middle Ages',
    description: 'Browsable manuscripts c. 800–1600, preserving original spelling and abbreviations.',
    projectTitle: 'About the Project',
    overline: 'Medieval Latin & Old French',
    hero: {
      description: 'Browsable manuscripts c. 800–1600, preserving original spelling and abbreviations.'
    },
    stats: {
      tokens: 'Tokens',
      manuscripts: 'Manuscripts',
      timePeriod: 'Time Period',
      languages: 'Languages',
      languageSubtitle: 'Latin & Old French'
    },
    intro: {
      browsableCollection: 'A browsable collection of {count}+ manuscript digitizations in medieval Latin and Old French.',
      preservation: 'Texts preserve original abbreviations, spellings, and layout features — useful for research, but not a substitute for human transcription.',
      readFull: 'Read Full About',
      preprint: 'Preprint (PDF)',
      copyCitation: 'Copy Citation'
    },
    detailed: {
      title: 'About this Corpus',
      description: 'This platform provides access to a large-scale corpus of medieval manuscripts produced between c. 800–1600. The corpus was created from publicly available digitizations and preserves the original, non-normalized text — including abbreviations, spelling variation, and many features normally removed in editorial editions.',
      limitations: {
        title: 'Important Limitations',
        automatic: 'Automatic transcription only: texts were produced by HTR/OCR systems. Character Error Rate (CER) ≈ 9–11% on average.',
        segmentation: 'Segmentation & layout issues: automatic zone detection can miss marginalia or complex decorations.',
        abbreviations: 'Abbreviations preserved: abbreviations are retained in their graphematic form (MUFI/NFD encodings).',
        substitute: 'Not a substitute for critical edition: validate with manual transcription for publication-grade text.'
      },
      showShort: 'Show Short Intro'
    },
    contact: {
      title: 'Questions, Corrections, or Feedback?',
      description: 'If you find errors, missing pages, or suspect important OCR failures, please contact the corpus team with the manuscript identifier and a short description.',
      contactTeam: 'Contact the Team',
      projectPage: 'Project Page / Code'
    },
    citation: {
      copied: 'Citation copied',
      failed: 'Copy failed — please copy manually'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    open: 'Open',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No'
  }
}