import ClassicTemplate from './ClassicTemplate.vue'
import ModernTwoColumnTemplate from './ModernTwoColumnTemplate.vue'
import FreshGradTemplate from './FreshGradTemplate.vue'

export const templateRegistry = [
  {
    id: 'classic',
    name: 'Classic',
    scenario: 'ATS-friendly single-column resume',
    preview: '',
    component: ClassicTemplate,
    themeSupport: ['theme-light', 'theme-dark', 'theme-blue', 'theme-purple', 'theme-pink', 'theme-red']
  },
  {
    id: 'modern-two-column',
    name: 'Modern Two Column',
    scenario: 'Compact professional resume with sidebar',
    preview: '',
    component: ModernTwoColumnTemplate,
    themeSupport: ['theme-light', 'theme-dark', 'theme-blue', 'theme-purple', 'theme-pink', 'theme-red']
  },
  {
    id: 'fresh-grad',
    name: 'Fresh Graduate',
    scenario: 'Clean header-banner layout for students and new grads',
    preview: '',
    component: FreshGradTemplate,
    themeSupport: ['theme-light', 'theme-dark', 'theme-blue', 'theme-purple', 'theme-pink', 'theme-red']
  }
]

export const defaultTemplateId = 'classic'

export const getTemplateById = (templateId) => (
  templateRegistry.find((template) => template.id === templateId)
  || templateRegistry.find((template) => template.id === defaultTemplateId)
  || templateRegistry[0]
)
