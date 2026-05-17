import apiClient from './client'

const AI_CONFIG_KEY = 'resume-builder:ai-config'

// ── localStorage helpers ──────────────────────────────────────────────────────

export function getAiConfig() {
  try {
    return JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || 'null') || null
  } catch {
    return null
  }
}

export function saveAiConfig(config) {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config))
}

export function clearAiConfig() {
  localStorage.removeItem(AI_CONFIG_KEY)
}

export function hasAiConfig() {
  const cfg = getAiConfig()
  return !!(cfg && cfg.providerType && cfg.apiKey)
}

// ── Resume → plain text serializer ───────────────────────────────────────────

export function resumeToText(resume) {
  const lines = []
  const b = resume.basics || {}

  if (b.name) lines.push(`Name: ${b.name}`)
  if (b.headline) lines.push(`Headline: ${b.headline}`)
  if (b.email) lines.push(`Email: ${b.email}`)
  if (b.phone) lines.push(`Phone: ${b.phone}`)
  if (b.location) lines.push(`Location: ${b.location}`)
  if (b.website) lines.push(`Website: ${b.website}`)

  for (const section of (resume.sections || [])) {
    if (!section.visible) continue
    lines.push(`\n== ${section.title || section.type} ==`)

    switch (section.type) {
      case 'summary':
        if (section.content) lines.push(section.content)
        break
      case 'skills':
        for (const item of (section.items || [])) {
          lines.push(`- ${item.name}: ${(item.keywords || []).join(', ')}`)
        }
        break
      case 'experience':
      case 'education':
        for (const item of (section.items || [])) {
          const parts = [item.organization, item.position || item.degree, item.area].filter(Boolean)
          lines.push(parts.join(' | '))
          if (item.summary) lines.push(item.summary)
          for (const h of (item.highlights || [])) lines.push(`• ${h}`)
        }
        break
      case 'projects':
        for (const item of (section.items || [])) {
          lines.push(item.name || '')
          if (item.summary) lines.push(item.summary)
          for (const h of (item.highlights || [])) lines.push(`• ${h}`)
        }
        break
      default:
        for (const item of (section.items || [])) {
          if (item.summary) lines.push(item.summary)
          for (const h of (item.highlights || [])) lines.push(`• ${h}`)
        }
    }
  }

  return lines.join('\n').trim()
}

// ── API call (key proxied through backend, never stored server-side) ──────────

export async function analyzeMatch(resume, jdText) {
  const cfg = getAiConfig()
  if (!cfg || !cfg.apiKey) throw new Error('AI not configured — please set your API key first')

  const resumeText = resumeToText(resume)
  if (!resumeText) throw new Error('Resume is empty — please fill in some information first')

  const { data } = await apiClient.post('/ai/analyze', {
    providerType: cfg.providerType,
    apiKey: cfg.apiKey,
    model: cfg.model || undefined,
    resumeText,
    jdText,
  })
  return data
}
