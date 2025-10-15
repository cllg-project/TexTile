export default {
  appTitle: 'CoMMA',
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
    browse: 'Browse',
    metadataSearch: 'Metadata Search',
    search: 'Search',
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
      date: 'e.g., 0-1600, 800, 1301, 800-1500, after 1200, before 1500, 14th century, around 1250'
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
    info: {
      title: 'Document Info',
      metadata: 'Metadata',
      author: 'Author',
      origin: 'Origin',
      date: 'Date',
      language: 'Language',
      type: 'Type',
      description: 'Description',
      id: 'ID',
      keywords: 'Keywords',
      sources: 'Sources',
      identifiers: 'Identifiers',
      unknownLanguage: 'Unknown',
      biblissimaLink: 'Biblissima link'
    },
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
      text: 'This text is the result of automatic transcription. A sample evaluation showed an error rate varying between 0 and 100% on 600 different randomly chosen manuscripts, with an average below 10% CER overall.'
    },
    iiif: {
      title: 'Manuscript Viewer',
      noManifest: 'No manuscript images available',
      sync: 'Sync with current passage'
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
    comingSoon: 'Coming Soon',
    searchButton: 'Search',
    virtualKeyboard: 'Virtual Keyboard',
    specialKeyboard: 'Special Keyboard',
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
      traditional: 'Search with Boolean operators (+, -, ｜, *, "phrases")…',
      vector: 'Search semantically (e.g., "homme pauvre", "cheval")…',
      hybrid: 'Search with both traditional and semantic methods…'
    },
    mode: {
      title: 'Search Mode',
      exact: 'Exact Match',
      partial: 'Partial Match', 
      fuzzy: 'Fuzzy Match',

      descriptions: {
        exact: 'Search for exact phrase matches only',
        partial: 'Allow partial word matches and substring search',
        fuzzy: 'Allow approximate matches with typo tolerance'
      }
    },
    guides: {
      traditional: {
        title: 'Search Tips',
        tips: {
          multiWord: 'for multiple word search, e.g. "deus,deum"',
          phrase: 'for exact phrase, e.g. "la bouche"',
          wildcard: "use '*' as a wildcard to match word prefixes (e.g., 'reg*' matches 'regnum') — only available in Exact Match"
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
    title: 'CoMMA',
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
      paperDescription: 'This work is described in detail in the research paper',
      paperTitle: '"CoMMA, a Large-scale Corpus of Multilingual Medieval Archives"',
      paperAuthors: 'by Thibault Clérice, Simon Gabay, Malamatenia Vlachou-Efstathiou, Ariane Pinche, and Benoît Sagot (2025).',
      readFull: 'Read Full About',
      preprint: 'Preprint (PDF)',
      copyCitation: 'Copy Citation',
      tryItNow: 'Try it Now',
      searchPlaceholder: 'Search through 2.5B tokens of medieval text...',
      downloadCorpus: 'Download Corpus'
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
  projectInfo: {
    overline: 'Medieval Manuscript Corpus',
    title: 'CoMMA - Automatic Transcription of Medieval Written Heritage',
    subtitle: 'A unique worldwide corpus of medieval manuscripts automatically transcribed using artificial intelligence.',
    introduction: {
      corpus: 'We have created a unique worldwide corpus of medieval manuscripts, automatically transcribed using artificial intelligence (HTR – Handwritten Text Recognition). It is the logical continuation of our previous work around ',
      catmusDescription: ', a massive dataset for training handwriting recognition models in medieval manuscripts.',
      paper: 'The corpus presented here is described in an article, in English, also presenting its limitations and the framework of its creation: ',
      paperLink: 'Research Paper'
    },
    paper: {
      title: 'Research Paper & Credits',
      description: 'This corpus is described in the research paper',
      paperTitle: 'CoMMA, a Large-scale Corpus of Multilingual Medieval Archives',
      authors: 'Thibault Clérice, Simon Gabay, Malamatenia Vlachou-Efstathiou, Ariane Pinche, Benoît Sagot',
      year: '2025',
      abstract: 'We present CoMMA, a large-scale corpus of medieval manuscripts produced through automatic text recognition. The corpus contains around 2.5b tokens drawn from more than 23,000 digitized manuscripts in Latin and Old French, harvested via IIIF.',
      viewPaper: 'View Full Paper'
    },
    features: {
      title: 'Corpus Features',
      items: [
        {
          title: 'A massive corpus:',
          description: 'more than 23,000 manuscripts, approximately 2.5 billion words in Latin and Old French.'
        },
        {
          title: 'Significant chronological span:',
          description: 'from the 9th century to the 16th century inclusive!'
        },
        {
          title: 'Sources from major European digital libraries:',
          description: '(BnF Gallica, Bodleian, e-codices, etc.).'
        },
        {
          title: 'An innovative approach:',
          description: 'texts automatically transcribed from images, without editorial normalization, allowing exploration of the richness and diversity of medieval writing.'
        },
        {
          title: 'A tool for science and technology:',
          description: 'freely available resource, useful both for digital humanities (language history, philology, book history) and computer science (training automatic language processing models).'
        },
        {
          title: 'Prospects:',
          description: 'the corpus will be progressively enriched with new collections and new medieval languages, including Italian and other traditions.'
        }
      ]
    },
    limitations: {
      title: 'Known Limitations',
      transcription: 'Automatic transcription is not perfect — depending on the manuscripts, the error can vary between 6% and 25%, and some difficult documents (cursive writing, damaged pages, poor quality digitizations) can produce even less reliable results. Errors such as "ri" for "n" are not excluded, but others producing nothing sensible are not impossible.',
      coverage: 'Not all BnF manuscripts are present, just as the corpus is the result of the very biases of different institutions in terms of digitization of their collections.'
    },
    projects: {
      title: 'Projects and Funding',
      description: 'This corpus was produced as part of the ',
      and: ' and',
      biblissima: 'Produced with the help of the Biblissima+ equipment of excellence for source identification and metadata, and software such as Kraken or eScriptorium.'
    },
    technology: {
      title: 'Technologies Used',
      dtsUi: {
        description: 'developed by Hassen Aguili, whose code is available at '
      },
      mydapytains: {
        description: 'developed by Thibault Clérice, funded by the PIQ CLLG project (ANR Mention), available at '
      }
    },
    stats: {
      title: 'Corpus Statistics',
      manuscripts: 'Manuscripts',
      words: 'Words',
      timespan: 'Time Period'
    },
    languages: {
      title: 'Languages',
      latin: 'Medieval Latin',
      oldFrench: 'Old French',
      italian: 'Italian'
    },
    sources: {
      title: 'Main Sources',
      others: 'And others...'
    },
    contact: {
      title: 'Contact',
      description: 'For any questions or suggestions regarding the corpus.',
      button: 'Contact the Team'
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