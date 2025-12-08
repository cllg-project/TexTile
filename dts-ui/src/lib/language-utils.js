export const LANGUAGE_CODE_MAP = {
  // Short codes
  'lat': 'languages.latin',
  'fro': 'languages.oldFrench',
  'frm': 'languages.middleFrench',
  'fre': 'languages.french',
  'fra': 'languages.french',
  'ita': 'languages.italian',
  'eng': 'languages.english',
  'deu': 'languages.german',
  'ger': 'languages.german',
  'spa': 'languages.spanish',
  'oci': 'languages.occitan',
  'heb': 'languages.hebrew',
  'grc': 'languages.ancientGreek',
  'nld': 'languages.dutch',
  'ang': 'languages.oldEnglish',
  'gle': 'languages.irish',
  'cat': 'languages.catalan',
  'ara': 'languages.arabic',
  'ces': 'languages.czech',
  'tur': 'languages.turkish',
  'cym': 'languages.welsh',
  'cor': 'languages.cornish',
  'und': 'languages.undetermined',
  'heb/ita': 'languages.hebrewItalian',
  // Full names (case insensitive)
  'latin': 'languages.latin',
  'old french': 'languages.oldFrench',
  'middle french': 'languages.middleFrench',
  'french': 'languages.french',
  'italian': 'languages.italian',
  'english': 'languages.english',
  'german': 'languages.german',
  'spanish': 'languages.spanish',
  'occitan': 'languages.occitan',
  'hebrew': 'languages.hebrew',
  'ancient greek': 'languages.ancientGreek',
  'greek': 'languages.ancientGreek',
  'dutch': 'languages.dutch',
  'old english': 'languages.oldEnglish',
  'irish': 'languages.irish',
  'catalan': 'languages.catalan',
  'arabic': 'languages.arabic',
  'czech': 'languages.czech',
  'turkish': 'languages.turkish',
  'welsh': 'languages.welsh',
  'cornish': 'languages.cornish',
  'undetermined': 'languages.undetermined',
  'hebrew/italian': 'languages.hebrewItalian'
}

export function getLanguageTranslationKey(langCode) {
  if (!langCode) return null
  const normalized = langCode.toLowerCase().trim()
  return LANGUAGE_CODE_MAP[normalized] || null
}

export function formatLanguage(lang, t) {
  if (!lang) return ''
  
  // Process multiple languages separated by commas
  const languages = lang.split(',').map(l => l.trim())
  
  // Remove duplicates by converting to Set
  const uniqueLanguages = [...new Set(languages)]
  
  const formattedLanguages = uniqueLanguages.map(singleLang => {
    const translationKey = getLanguageTranslationKey(singleLang)
    
    if (translationKey && t) {
      return t(translationKey)
    }
    
    // Otherwise return as-is, capitalized
    return singleLang.charAt(0).toUpperCase() + singleLang.slice(1)
  })
  
  // Remove duplicates again after formatting (in case different codes map to same language)
  const uniqueFormattedLanguages = [...new Set(formattedLanguages)]
  
  // If multiple languages, show first one with count indicator
  if (uniqueFormattedLanguages.length > 1) {
    return `${uniqueFormattedLanguages[0]} +${uniqueFormattedLanguages.length - 1}`
  }
  
  return uniqueFormattedLanguages[0]
}

export function getUniqueLanguagesForTooltip(lang, t) {
  if (!lang) return ''
  
  const languages = lang.split(',').map(l => l.trim())
  const uniqueLanguages = [...new Set(languages)]
  
  return uniqueLanguages.map(l => {
    const translationKey = getLanguageTranslationKey(l)
    return translationKey && t ? t(translationKey) : l
  }).join(', ')
}

export function getLanguageColor(lang) {
  const normalized = lang?.toLowerCase() || ''
  
  if (normalized.includes('latin')) return 'indigo-darken-1'
  if (normalized.includes('french') || normalized.includes('français')) return 'blue-darken-1'
  if (normalized.includes('english') || normalized.includes('anglais')) return 'blue-grey-darken-1'
  if (normalized.includes('italian') || normalized.includes('italien')) return 'cyan-darken-1'
  if (normalized.includes('spanish') || normalized.includes('espagnol')) return 'light-blue-darken-1'
  if (normalized.includes('german') || normalized.includes('allemand')) return 'blue-grey-darken-2'
  if (normalized.includes('greek') || normalized.includes('grec')) return 'teal-darken-1'
  if (normalized.includes('hebrew') || normalized.includes('hébreu')) return 'deep-purple-darken-1'
  if (normalized.includes('arabic') || normalized.includes('arabe')) return 'purple-darken-1'
  if (normalized.includes('occitan')) return 'indigo-darken-2'
  if (normalized.includes('dutch') || normalized.includes('néerlandais')) return 'cyan-darken-2'
  if (normalized.includes('irish') || normalized.includes('irlandais')) return 'teal-darken-2'
  if (normalized.includes('catalan')) return 'blue-darken-2'
  if (normalized.includes('czech') || normalized.includes('tchèque')) return 'indigo-lighten-1'
  if (normalized.includes('turkish') || normalized.includes('turc')) return 'purple-darken-2'
  if (normalized.includes('welsh') || normalized.includes('gallois')) return 'blue-grey-lighten-1'
  if (normalized.includes('cornish') || normalized.includes('cornique')) return 'teal-lighten-1'
  if (normalized.includes('undetermined') || normalized.includes('indéterminé')) return 'grey-darken-1'
  
  return 'indigo-darken-1'
}

export function getLanguageOptions(t) {
  return [
    { code: 'all', name: t('search.allLanguages') },
    { code: 'lat', name: t('languages.latin') },
    { code: 'fre', name: t('languages.french') },
    { code: 'ita', name: t('languages.italian') },
    { code: 'und', name: t('languages.undetermined') },
    { code: 'oci', name: t('languages.occitan') },
    { code: 'ger', name: t('languages.german') },
    { code: 'heb', name: t('languages.hebrew') },
    { code: 'grc', name: t('languages.ancientGreek') },
    { code: 'nld', name: t('languages.dutch') },
    { code: 'ang', name: t('languages.oldEnglish') },
    { code: 'gle', name: t('languages.irish') },
    { code: 'cat', name: t('languages.catalan') },
    { code: 'ara', name: t('languages.arabic') },
    { code: 'eng', name: t('languages.english') },
    { code: 'ces', name: t('languages.czech') },
    { code: 'tur', name: t('languages.turkish') },
    { code: 'spa', name: t('languages.spanish') },
    { code: 'heb/ita', name: t('languages.hebrewItalian') },
    { code: 'cym', name: t('languages.welsh') },
    { code: 'cor', name: t('languages.cornish') }
  ]
}

export function normalizeLanguageQuery(query) {
  if (!query) return query
  const normalized = query.trim().toLowerCase()
  const translationKey = LANGUAGE_CODE_MAP[normalized]
  
  if (translationKey) {
    if (normalized.length <= 3 || normalized.includes('/')) {
      return normalized
    }
  }
  
  return query
}
