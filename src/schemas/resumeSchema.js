export const RESUME_SCHEMA_VERSION = 1

export const RESUME_STORAGE_KEYS = {
  drafts: 'resume-builder:drafts',
  activeDraftId: 'resume-builder:active-draft-id',
  legacyResume: 'resume'
}

const DEFAULT_CURRENCY = 'CNY'
const DEFAULT_TEMPLATE_ID = 'classic'

const normalizeTemplateId = (templateId) => {
  if (!templateId || templateId === 'template1') return DEFAULT_TEMPLATE_ID
  return templateId
}

const clone = (value) => JSON.parse(JSON.stringify(value))

const nowIso = () => new Date().toISOString()

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const asString = (value) => (value === null || value === undefined ? '' : String(value))

const asNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const splitTextItems = (value) => {
  if (Array.isArray(value)) return value.map(asString).map((item) => item.trim()).filter(Boolean)
  return asString(value)
    .split(/[,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const createTextItem = (prefix, summary) => ({
  id: createId(prefix),
  summary: asString(summary),
  highlights: []
})

const createDefaultSections = () => [
  {
    id: 'summary',
    type: 'summary',
    title: 'Personal Strengths',
    visible: true,
    order: 10,
    content: ''
  },
  {
    id: 'skills',
    type: 'skills',
    title: 'Skills',
    visible: true,
    order: 20,
    items: []
  },
  {
    id: 'work',
    type: 'experience',
    title: 'Work Experience',
    visible: true,
    order: 30,
    items: []
  },
  {
    id: 'projects',
    type: 'projects',
    title: 'Project Experience',
    visible: true,
    order: 40,
    items: []
  },
  {
    id: 'education',
    type: 'education',
    title: 'Education',
    visible: true,
    order: 50,
    items: []
  },
  {
    id: 'certificates',
    type: 'certificates',
    title: 'Certifications',
    visible: true,
    order: 60,
    items: []
  },
  {
    id: 'awards',
    type: 'awards',
    title: 'Awards and Honors',
    visible: true,
    order: 70,
    items: []
  },
  {
    id: 'organizations',
    type: 'organizations',
    title: 'Club/Organization Experience',
    visible: true,
    order: 80,
    items: []
  }
]

export const createDefaultResume = (overrides = {}) => {
  const timestamp = nowIso()
  const base = {
    schemaVersion: RESUME_SCHEMA_VERSION,
    id: createId('local-resume'),
    ownerId: null,
    title: 'Untitled Resume',
    language: 'en',
    templateId: DEFAULT_TEMPLATE_ID,
    themeId: 'theme-light',
    basics: {
      name: '',
      headline: '',
      photo: '',
      gender: '',
      age: null,
      birthDate: {
        year: null,
        month: null
      },
      email: '',
      phone: '',
      location: '',
      links: []
    },
    intention: {
      jobTitle: '',
      industry: '',
      location: {
        province: '',
        city: ''
      },
      salaryRange: {
        min: null,
        max: null,
        currency: DEFAULT_CURRENCY
      },
      jobStatus: ''
    },
    sections: createDefaultSections(),
    settings: {
      exportFileName: '',
      exportType: 'print',
      pageSize: 'A4',
      updatedAt: timestamp,
      createdAt: timestamp
    }
  }

  return normalizeCanonicalResume({ ...base, ...overrides })
}

export const isCanonicalResume = (resume) => (
  Boolean(resume)
  && resume.schemaVersion === RESUME_SCHEMA_VERSION
  && Boolean(resume.basics)
  && Array.isArray(resume.sections)
)

export const getSectionByType = (resume, type) => {
  if (!resume || !Array.isArray(resume.sections)) return null
  return resume.sections.find((section) => section.type === type) || null
}

const normalizeSection = (section, fallback, index) => {
  const merged = {
    ...fallback,
    ...section,
    id: asString(section.id || fallback.id || createId(section.type || fallback.type || 'section')),
    type: asString(section.type || fallback.type || 'customText'),
    title: asString(section.title || fallback.title || 'Custom Section'),
    visible: section.visible !== false,
    order: Number.isFinite(Number(section.order)) ? Number(section.order) : (index + 1) * 10
  }

  if (Array.isArray(section.items) || Array.isArray(fallback.items)) {
    merged.items = Array.isArray(section.items) ? section.items : []
  }

  if ('content' in section || 'content' in fallback) {
    merged.content = asString(section.content || '')
  }

  return merged
}

export const normalizeCanonicalResume = (resume = {}) => {
  const defaults = {
    schemaVersion: RESUME_SCHEMA_VERSION,
    id: createId('local-resume'),
    ownerId: null,
    title: 'Untitled Resume',
    language: 'en',
    templateId: DEFAULT_TEMPLATE_ID,
    themeId: 'theme-light',
    basics: {
      name: '',
      headline: '',
      photo: '',
      gender: '',
      age: null,
      birthDate: {
        year: null,
        month: null
      },
      email: '',
      phone: '',
      location: '',
      links: []
    },
    intention: {
      jobTitle: '',
      industry: '',
      location: {
        province: '',
        city: ''
      },
      salaryRange: {
        min: null,
        max: null,
        currency: DEFAULT_CURRENCY
      },
      jobStatus: ''
    },
    sections: createDefaultSections(),
    settings: {
      exportFileName: '',
      exportType: 'print',
      pageSize: 'A4',
      updatedAt: nowIso(),
      createdAt: nowIso()
    }
  }

  const defaultSectionsByType = defaults.sections.reduce((map, section) => {
    map[section.type] = section
    return map
  }, {})

  const incomingSections = Array.isArray(resume.sections) ? resume.sections : []
  const normalizedIncomingSections = incomingSections.map((section, index) => (
    normalizeSection(section || {}, defaultSectionsByType[section?.type] || {}, index)
  ))
  const incomingSectionTypes = new Set(normalizedIncomingSections.map((section) => section.type))
  const missingDefaultSections = defaults.sections
    .filter((section) => !incomingSectionTypes.has(section.type))
    .map((section, index) => normalizeSection(section, section, normalizedIncomingSections.length + index))

  return {
    ...defaults,
    ...resume,
    schemaVersion: RESUME_SCHEMA_VERSION,
    templateId: normalizeTemplateId(resume.templateId || defaults.templateId),
    basics: {
      ...defaults.basics,
      ...(resume.basics || {}),
      photo: asString(resume.basics?.photo),
      age: asNullableNumber(resume.basics?.age),
      birthDate: {
        ...defaults.basics.birthDate,
        ...(resume.basics?.birthDate || {}),
        year: asNullableNumber(resume.basics?.birthDate?.year),
        month: asNullableNumber(resume.basics?.birthDate?.month)
      },
      links: Array.isArray(resume.basics?.links) ? resume.basics.links : []
    },
    intention: {
      ...defaults.intention,
      ...(resume.intention || {}),
      location: {
        ...defaults.intention.location,
        ...(resume.intention?.location || {})
      },
      salaryRange: {
        ...defaults.intention.salaryRange,
        ...(resume.intention?.salaryRange || {}),
        min: asNullableNumber(resume.intention?.salaryRange?.min),
        max: asNullableNumber(resume.intention?.salaryRange?.max),
        currency: asString(resume.intention?.salaryRange?.currency || DEFAULT_CURRENCY)
      }
    },
    sections: [...normalizedIncomingSections, ...missingDefaultSections]
      .sort((a, b) => a.order - b.order),
    settings: {
      ...defaults.settings,
      ...(resume.settings || {})
    }
  }
}

export const migrateLegacyResume = (legacyResume = {}) => {
  if (isCanonicalResume(legacyResume)) return normalizeCanonicalResume(clone(legacyResume))

  const legacy = legacyResume || {}
  const name = asString(legacy.name || legacy.personalInfo?.name)
  const email = asString(
    legacy.email
    || legacy.personalInfo?.email
    || (legacy.emailPrefix ? `${legacy.emailPrefix}${legacy.emailSuffix || ''}` : '')
  )
  const phone = asString(legacy.mobile || legacy.phone || legacy.personalInfo?.phone)
  const location = asString(legacy.address || legacy.personalInfo?.address)
  const salary = Array.isArray(legacy.salary) ? legacy.salary : []
  const templateId = normalizeTemplateId(asString(legacy.template || legacy.templateId || DEFAULT_TEMPLATE_ID))
  const themeId = asString(legacy.currentTheme || legacy.themeId || 'theme-light')

  const sections = createDefaultSections()

  const summary = sections.find((section) => section.type === 'summary')
  summary.content = asString(legacy.advantage)

  const skills = sections.find((section) => section.type === 'skills')
  skills.items = splitTextItems(legacy.skills).map((skill, index) => ({
    id: `skill-${index + 1}`,
    name: skill,
    level: '',
    category: ''
  }))

  const work = sections.find((section) => section.type === 'experience')
  work.items = legacy.experience ? [createTextItem('work', legacy.experience)] : []

  const projects = sections.find((section) => section.type === 'projects')
  projects.items = legacy.projects ? [createTextItem('project', legacy.projects)] : []

  const education = sections.find((section) => section.type === 'education')
  education.items = legacy.education ? [createTextItem('education', legacy.education)] : []

  const certificates = sections.find((section) => section.type === 'certificates')
  certificates.items = legacy.certificates
    ? [{
      id: createId('certificate'),
      name: asString(legacy.certificates),
      issuer: '',
      date: '',
      url: '',
      summary: asString(legacy.certificates)
    }]
    : []

  const awards = sections.find((section) => section.type === 'awards')
  awards.items = legacy.honors
    ? [{
      id: createId('award'),
      title: '',
      issuer: '',
      date: '',
      summary: asString(legacy.honors)
    }]
    : []

  const organizations = sections.find((section) => section.type === 'organizations')
  organizations.items = legacy.organizations ? [createTextItem('organization', legacy.organizations)] : []

  return normalizeCanonicalResume({
    id: asString(legacy.id) || createId('local-resume'),
    ownerId: legacy.ownerId || null,
    title: asString(legacy.title || (name ? `${name} Resume` : 'Untitled Resume')),
    language: asString(legacy.language || 'en'),
    templateId,
    themeId,
    basics: {
      name,
      headline: asString(legacy.headline),
      gender: asString(legacy.gender),
      age: asNullableNumber(legacy.age),
      birthDate: {
        year: asNullableNumber(legacy.birthYear),
        month: asNullableNumber(legacy.birthMonth)
      },
      email,
      phone,
      location,
      links: Array.isArray(legacy.links) ? legacy.links : []
    },
    intention: {
      jobTitle: asString(legacy.job),
      industry: asString(legacy.industry),
      location: {
        province: asString(legacy.province),
        city: asString(legacy.city)
      },
      salaryRange: {
        min: asNullableNumber(salary[0]),
        max: asNullableNumber(salary[1]),
        currency: DEFAULT_CURRENCY
      },
      jobStatus: asString(legacy.jobStatus)
    },
    sections,
    settings: {
      exportFileName: asString(legacy.exportFileName),
      exportType: asString(legacy.exportType || 'pdf'),
      pageSize: 'A4',
      updatedAt: nowIso(),
      createdAt: nowIso()
    }
  })
}

const sectionText = (resume, type) => {
  const section = getSectionByType(resume, type)
  if (!section) return ''
  if (section.content) return section.content
  if (!Array.isArray(section.items)) return ''
  return section.items
    .map((item) => item.summary || item.name || item.title || '')
    .filter(Boolean)
    .join('\n')
}

export const canonicalToLegacyResume = (resume = {}) => {
  const canonical = normalizeCanonicalResume(resume)
  const basics = canonical.basics
  const intention = canonical.intention
  const salaryRange = intention.salaryRange
  const skills = getSectionByType(canonical, 'skills')

  return {
    name: basics.name,
    gender: basics.gender,
    age: basics.age || 22,
    birthYear: basics.birthDate.year || 2002,
    birthMonth: basics.birthDate.month || 1,
    jobStatus: intention.jobStatus,
    email: basics.email,
    mobile: basics.phone,
    address: basics.location,
    exportType: canonical.settings.exportType || 'pdf',
    advantage: sectionText(canonical, 'summary'),
    projects: sectionText(canonical, 'projects'),
    certificates: sectionText(canonical, 'certificates'),
    honors: sectionText(canonical, 'awards'),
    organizations: sectionText(canonical, 'organizations'),
    industry: intention.industry,
    job: intention.jobTitle,
    skills: Array.isArray(skills?.items)
      ? skills.items.map((item) => item.name).filter(Boolean).join(', ')
      : '',
    province: intention.location.province,
    city: intention.location.city,
    salary: [
      salaryRange.min || 5000,
      salaryRange.max || 15000
    ],
    experience: sectionText(canonical, 'experience'),
    education: sectionText(canonical, 'education'),
    template: canonical.templateId,
    currentTheme: canonical.themeId
  }
}
