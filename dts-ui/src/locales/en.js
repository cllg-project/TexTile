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
      tokens: 'Tokens',
      ocrQuality: 'High quality lines',
      unknownLanguage: 'Unknown',
      biblissimaLink: 'Biblissima link',
      downloadDocument: 'Download document'
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
      text: 'This text was created by automatic transcription. Most transcriptions are over 90% accurate, but some manuscripts — especially those with difficult handwriting or poor image quality — may contain many errors or even fail completely. The first pages often include handwritten notes rather than the main text; we recommend scrolling to the first content page for a better impression.'
    },
    iiif: {
      title: 'Manuscript Viewer',
      noManifest: 'No manuscript images available',
      sync: 'Sync with current passage'
    }
  },
  search: {
    title: 'Text Search',
    subtitle: 'Search the transcribed text of every manuscript',
    exportConcordance: 'Export concordance (CSV)',
    exportConcordanceHint: 'Download every occurrence with its left and right context, in reading order',
    tabResults: 'Passages',
    tabConcordance: 'Concordance',
    tabStats: 'Statistics',
    concWidth: 'Context (characters)',
    concPageSize: 'Pages per page',
    concCapped: 'Only the first {count} matching pages can be browsed here. Export the CSV for the complete concordance.',
    concSort: 'Sort this page by',
    concSortOrder: 'Reading order',
    concSortLeft: 'Left context',
    concSortRight: 'Right context',
    concSummary: '{pages} matching pages · {rows} occurrences on this page',
    statsOccurrences: 'Occurrences',
    statsPer10k: 'Per 10,000 tokens',
    statsPer10kHint: 'Occurrences per 10,000 tokens of the manuscripts in the searched scope',
    statsManuscripts: 'Manuscripts with hits',
    statsDistinctForms: 'Distinct forms',
    statsMetric: 'Measure',
    statsForms: 'Forms found',
    statsAllForms: 'All forms',
    statsFormPicker: 'Statistics for one form',
    statsByCentury: 'By century',
    statsByLanguage: 'By language',
    statsByManuscript: 'By manuscript',
    statsUndated: '{count} occurrences in undated manuscripts are not shown above',
    statsMore: 'Show {count} more',
    statsLess: 'Show less',
    statsDownload: 'Download statistics (CSV)',
    statsComputing: 'Counting occurrences…',
    statsProgress: '{pages} of {total} pages · {occurrences} occurrences so far',
    statsPreliminary: 'Preliminary figures, still counting',
    statsStop: 'Stop',
    statsStopped: 'Counting was stopped: these figures are partial.',
    statsCached: 'Saved result from {when}',
    statsRecompute: 'Recompute',
    statsBusy: 'The server is busy computing other statistics. Try again in a few seconds.',
    statsRetry: 'Try again',
    statsTruncatedOccurrences: 'Counting stopped at the maximum of {count} occurrences: these figures cover the first part of the corpus only.',
    statsTruncatedTime: 'Counting stopped after {seconds} seconds: these figures cover the first part of the corpus only.',
    tipsButton: 'Search tips',
    tryExamples: 'Try',
    resultsCount: '{count} result | {count} results',
    modeLabel: 'Match',
    searchButton: 'Search',
    specialKeyboard: 'Special Keyboard',
    languageFilter: 'Language',
    allLanguages: 'All Languages',
    noResults: 'No results.',
    pagination: {
      page: 'page {current} of {total}'
    },
    placeholders: {
      traditional: 'Search with Boolean operators (+, -, ｜, *, "phrases")…'
    },
    mode: {
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
        tips: {
          multiWord: 'for multiple word search, e.g. "deus,deum"',
          phrase: 'for exact phrase, e.g. "la bouche"',
          wildcard: 'use \'*\' as a wildcard to match word prefixes (e.g., \'reg*\' matches \'regnum\') — only available in Exact Match'
        }
      }
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
      lrecPaper: 'LREC Paper (PDF)',
      copyCitation: 'Copy Citation',
      tryItNow: 'Try it Now',
      searchPlaceholder: 'Search through 3.3B tokens of medieval text...',
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
    sponsors: {
      title: 'Funding & Support',
      fundingText: 'This work received support from the French government managed by the Agence Nationale de la Recherche under France 2030 bearing the reference "ANR-24-RRII-0002" and operated by the Inria Quadran Program.'
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
          description: 'more than 33,000 manuscripts, approximately 3.3 billion words in Latin and Old French.'
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
        },
        {
          title: 'An evaluation of automated text recognition:',
          description: 'each produced text line is processed by a model designed to assess its quality from a linguistic and plausibility perspective. This mechanism serves as a proxy for transcription-quality evaluation when no ground truth is available. The system is inspired by the methods described in <a href="https://enc.hal.science/hal-03828529/" target="_blank" rel="noopener" class="text-primary text-decoration-none font-weight-medium">Ground-truth Free Evaluation of HTR on Old French and Latin Medieval Literary Manuscripts</a>. A good line corresponds to a line whose estimated error rate lies between 0% and 25%.'
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
        description: 'Web interface for browsing and searching the corpus, developed by Hassen Aguili.',
        uiRepo: 'UI Repository',
        backendRepo: 'Backend Repository'
      },
      mydapytains: {
        description: 'Backend API server developed by Thibault Clérice, funded by the PIQ CLLG project (ANR Mention).',
        viewRepo: 'View Repository'
      },
      kraken: {
        description: 'Developed by Benjamin Kiessling, Kraken was used for the automatic recognition of handwritten text in medieval manuscripts.',
        viewRepo: 'View Repository'
      },
      catmus: {
        description: 'A specialized model for transcribing medieval manuscripts in Latin scripts, used with Kraken for high-accuracy text recognition.',
        viewPaper: 'View Paper'
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
  browse: {
    title: 'Library',
    subtitle: 'Search and browse collections and manuscripts',
    searchLabel: 'Search the library',
    searchPlaceholder: 'Title, shelfmark, publisher, year… e.g. Smith 19',
    searchIn: 'Search in {title}',
    searchingIn: 'Searching in {title}',
    searchWholeLibrary: 'Search the whole library instead',
    searchButton: 'Search',
    language: 'Language',
    yearFrom: 'From year',
    yearTo: 'To year',
    reset: 'Reset',
    tabManuscripts: 'Manuscripts',
    tabCollections: 'Collections',
    resultsCount: '{count} result | {count} results',
    noResults: 'No results. Try fewer words or remove a filter.',
    topLevel: 'Collections',
    emptyLibrary: 'The library is empty.',
    emptyCollection: 'This collection is empty.',
    sortDefault: 'Default order',
    sortTitle: 'Title (A–Z)',
    sortSize: 'Largest first',
    collection: 'Collection',
    manuscript: 'Manuscript',
    manuscripts: 'Manuscripts',
    subCollections: 'Sub-collections',
    contents: 'Contents',
    items: '{count} item | {count} items',
    pages: '{count} page | {count} pages',
    tokens: '{count} tokens',
    identifier: 'Identifier',
    read: 'Read',
    backToLibrary: 'Back to library',
    notFound: 'This collection could not be found.'
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
  },
  languages: {
    latin: 'Latin',
    french: 'French',
    oldFrench: 'Old French',
    middleFrench: 'Middle French',
    italian: 'Italian',
    english: 'English',
    german: 'German',
    spanish: 'Spanish',
    occitan: 'Occitan',
    hebrew: 'Hebrew',
    ancientGreek: 'Ancient Greek',
    dutch: 'Dutch',
    oldEnglish: 'Old English',
    irish: 'Irish',
    catalan: 'Catalan',
    arabic: 'Arabic',
    czech: 'Czech',
    turkish: 'Turkish',
    welsh: 'Welsh',
    cornish: 'Cornish',
    undetermined: 'Undetermined',
    hebrewItalian: 'Hebrew/Italian'
  }
}