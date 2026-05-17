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
  const intention = resume.intention || {}

  const clean = (value) => {
    if (value === null || value === undefined) return ''
    return String(value).trim()
  }

  const compact = (values) => values.map(clean).filter(Boolean)
  const push = (target, value) => {
    const text = clean(value)
    if (text) target.push(text)
  }

  const formatDateRange = (item = {}) => {
    const endDate = item.current ? 'Present' : item.endDate
    return compact([item.startDate, endDate]).join(' - ')
  }

  const pushHighlights = (target, highlights) => {
    if (!Array.isArray(highlights)) return
    highlights.map(clean).filter(Boolean).forEach((highlight) => {
      target.push(`- ${highlight}`)
    })
  }

  const pushSection = (title, sectionLines) => {
    const content = sectionLines.map(clean).filter(Boolean)
    if (content.length === 0) return
    lines.push(`\n== ${title} ==`, ...content)
  }

  const pushItem = (target, headingParts, detailLines = []) => {
    const heading = compact(headingParts).join(' | ')
    push(target, heading)
    detailLines.forEach((line) => push(target, line))
  }

  if (b.name) lines.push(`Name: ${b.name}`)
  if (b.headline) lines.push(`Headline: ${b.headline}`)
  if (b.email) lines.push(`Email: ${b.email}`)
  if (b.phone) lines.push(`Phone: ${b.phone}`)
  if (b.location) lines.push(`Location: ${b.location}`)
  if (Array.isArray(b.links)) {
    const links = b.links
      .map((link) => compact([link.label, link.url]).join(': '))
      .filter(Boolean)
    if (links.length) lines.push(`Links: ${links.join(', ')}`)
  }

  const intentionLines = []
  push(intentionLines, intention.jobTitle && `Target role: ${intention.jobTitle}`)
  push(intentionLines, intention.industry && `Target industry: ${intention.industry}`)
  const targetLocation = compact([intention.location?.province, intention.location?.city]).join(', ')
  push(intentionLines, targetLocation && `Target location: ${targetLocation}`)
  const salary = intention.salaryRange || {}
  const salaryRange = compact([salary.min, salary.max]).join(' - ')
  push(intentionLines, salaryRange && `Expected salary: ${salaryRange} ${clean(salary.currency) || 'CNY'}`)
  push(intentionLines, intention.jobStatus && `Job status: ${intention.jobStatus}`)
  pushSection('Job Intention', intentionLines)

  for (const section of (resume.sections || [])) {
    if (!section.visible) continue
    const sectionLines = []

    switch (section.type) {
      case 'summary':
        push(sectionLines, section.content)
        break
      case 'skills':
        for (const item of (section.items || [])) {
          const details = compact([item.level, item.category]).join(' | ')
          const skill = details ? `${item.name} (${details})` : item.name
          push(sectionLines, `- ${skill}`)
        }
        break
      case 'experience':
        for (const item of (section.items || [])) {
          pushItem(sectionLines, [
            item.company,
            item.role,
            item.location,
            formatDateRange(item)
          ], [item.summary])
          pushHighlights(sectionLines, item.highlights)
        }
        break
      case 'projects':
        for (const item of (section.items || [])) {
          pushItem(sectionLines, [
            item.name,
            item.role,
            formatDateRange(item),
            item.url
          ], [
            item.technologies?.length ? `Technologies: ${item.technologies.join(', ')}` : '',
            item.summary
          ])
          pushHighlights(sectionLines, item.highlights)
        }
        break
      case 'education':
        for (const item of (section.items || [])) {
          pushItem(sectionLines, [
            item.school,
            item.degree,
            item.major,
            formatDateRange(item)
          ], [item.summary])
          pushHighlights(sectionLines, item.highlights)
        }
        break
      case 'certificates':
        for (const item of (section.items || [])) {
          pushItem(sectionLines, [
            item.name,
            item.issuer,
            item.date,
            item.url
          ], [item.summary])
        }
        break
      case 'awards':
        for (const item of (section.items || [])) {
          pushItem(sectionLines, [
            item.title,
            item.issuer,
            item.date
          ], [item.summary])
        }
        break
      case 'organizations':
        for (const item of (section.items || [])) {
          pushItem(sectionLines, [
            item.name,
            item.role,
            formatDateRange(item)
          ], [item.summary])
          pushHighlights(sectionLines, item.highlights)
        }
        break
      default:
        for (const item of (section.items || [])) {
          push(sectionLines, item.name || item.title || item.summary)
          pushHighlights(sectionLines, item.highlights)
        }
    }

    pushSection(section.title || section.type, sectionLines)
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
