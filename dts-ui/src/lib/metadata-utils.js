export function parseCreatedDate(created) {
  if (!created) return null
  
  const dateStr = Array.isArray(created) ? created[0] : created
  if (!dateStr || typeof dateStr !== 'string') return null
  
  if (dateStr.includes('/')) {
    const [start, end] = dateStr.split('/')
    return {
      startYear: parseInt(start, 10),
      endYear: parseInt(end, 10),
      display: `${start}-${end}`
    }
  } else {
    const year = parseInt(dateStr, 10)
    return {
      startYear: year,
      endYear: year,
      display: dateStr
    }
  }
}

export function getOCRPercentage(ocrQuality) {
  if (!ocrQuality || typeof ocrQuality !== 'string') return null
  const match = ocrQuality.match(/\((\d+\.?\d*)%\)/)
  return match ? parseFloat(match[1]) : null
}

export function formatTokens(tokens) {
  return tokens ? tokens.toLocaleString() : 'N/A'
}

export function formatTokenCountCompact(count) {
  if (!count) return ''
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k`
  return `${(count / 1000000).toFixed(1)}M`
}

export function getFirstValue(field) {
  return Array.isArray(field) && field.length > 0 ? field[0] : field
}

export function stripHtmlTags(html) {
  if (!html || typeof html !== 'string') return html
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}

export function buildManuscriptSubtitle(manuscript) {
  const parts = []
  
  if (manuscript.identifier) {
    const id = getFirstValue(manuscript.identifier)
    if (id) {
      const idParts = id.split('/')
      parts.push(idParts[idParts.length - 1])
    }
  }
  
  if (manuscript.publisher) {
    const pub = getFirstValue(manuscript.publisher)
    if (pub) parts.push(pub)
  }
  
  if (manuscript.page_count) {
    parts.push(`${manuscript.page_count} pages`)
  }
  
  return parts.length > 0 ? parts.join(' • ') : manuscript.collection || manuscript.id || ''
}

export function formatLanguageArray(language) {
  if (!language) return ''
  
  const langs = Array.isArray(language) ? language : [language]
  return langs.join(', ')
}
