export const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const formatBirthDate = (basics = {}) => {
  const birthDate = basics.birthDate || {}
  if (!birthDate.year || !birthDate.month) return ''
  const monthName = monthOptions[birthDate.month - 1]
  return monthName ? `${monthName} ${birthDate.year}` : `${birthDate.year}`
}

export const formatDesiredCity = (intention = {}) => {
  const location = intention.location || {}
  return [location.province, location.city].filter(Boolean).join(' - ')
}

export const formatSalaryRange = (intention = {}) => {
  const salary = intention.salaryRange || {}
  if (!salary.min && !salary.max) return ''
  const currency = salary.currency || 'CNY'
  if (salary.min && salary.max) return `${salary.min}-${salary.max} ${currency}`
  return `${salary.min || salary.max} ${currency}`
}

export const sectionDisplayText = (section = {}) => {
  if (section.content) return section.content
  if (!Array.isArray(section.items)) return ''

  return section.items
    .map((item) => {
      if (section.type === 'skills') return item.name
      return item.summary || item.name || item.title || item.role || item.company || item.school
    })
    .filter(Boolean)
    .join('\n')
}

export const visibleSections = (resume = {}) => {
  const sections = Array.isArray(resume.sections) ? resume.sections : []
  return sections
    .filter((section) => section.visible !== false)
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      ...section,
      displayText: sectionDisplayText(section)
    }))
}
