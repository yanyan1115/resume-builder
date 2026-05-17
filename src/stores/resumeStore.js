import { defineStore } from 'pinia'
import {
  RESUME_STORAGE_KEYS,
  createDefaultResume,
  migrateLegacyResume,
  normalizeCanonicalResume
} from '@/schemas/resumeSchema'

const readJson = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage`, error)
    return null
  }
}

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage`, error)
  }
}

export const useResumeStore = defineStore('resume', {
  state: () => ({
    activeDraftId: null,
    activeResume: createDefaultResume(),
    drafts: []
  }),

  getters: {
    themeId: (state) => state.activeResume.themeId || 'theme-light',
    exportType: (state) => state.activeResume.settings?.exportType || 'print',
    sortedDrafts: (state) => [...state.drafts].sort((a, b) => {
      const aTime = Date.parse(a.settings?.updatedAt || '') || 0
      const bTime = Date.parse(b.settings?.updatedAt || '') || 0
      return bTime - aTime
    })
  },

  actions: {
    loadDrafts() {
      const drafts = readJson(RESUME_STORAGE_KEYS.drafts)
      this.drafts = Array.isArray(drafts)
        ? drafts.map((draft) => normalizeCanonicalResume(draft))
        : []
      return this.drafts
    },

    persistDrafts() {
      writeJson(RESUME_STORAGE_KEYS.drafts, this.drafts)
      if (this.activeDraftId) {
        localStorage.setItem(RESUME_STORAGE_KEYS.activeDraftId, this.activeDraftId)
      }
    },

    loadActiveDraft() {
      const drafts = this.loadDrafts()
      const activeDraftId = localStorage.getItem(RESUME_STORAGE_KEYS.activeDraftId)

      if (Array.isArray(drafts) && drafts.length > 0) {
        const selectedDraft = drafts.find((draft) => draft.id === activeDraftId) || drafts[0]
        this.activeResume = normalizeCanonicalResume(selectedDraft)
        this.activeDraftId = this.activeResume.id
        return this.activeResume
      }

      const legacyResume = readJson(RESUME_STORAGE_KEYS.legacyResume)
      this.activeResume = legacyResume
        ? migrateLegacyResume(legacyResume)
        : createDefaultResume()
      this.activeDraftId = this.activeResume.id
      this.persistActiveDraft()
      return this.activeResume
    },

    openDraft(draftId) {
      if (this.drafts.length === 0) this.loadDrafts()
      const selectedDraft = this.drafts.find((draft) => draft.id === draftId)
      if (!selectedDraft) return null

      this.activeResume = normalizeCanonicalResume(selectedDraft)
      this.activeDraftId = this.activeResume.id
      localStorage.setItem(RESUME_STORAGE_KEYS.activeDraftId, this.activeDraftId)
      return this.activeResume
    },

    createDraft(title = 'Untitled Resume') {
      const draft = createDefaultResume({ title })
      this.activeResume = draft
      this.activeDraftId = draft.id
      this.persistActiveDraft()
      return draft
    },

    duplicateDraft(draftId) {
      if (this.drafts.length === 0) this.loadDrafts()
      const sourceDraft = this.drafts.find((draft) => draft.id === draftId)
      if (!sourceDraft) return null

      const timestamp = new Date().toISOString()
      const copy = normalizeCanonicalResume({
        ...JSON.parse(JSON.stringify(sourceDraft)),
        id: `local-resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: `${sourceDraft.title || 'Untitled Resume'} Copy`,
        settings: {
          ...sourceDraft.settings,
          createdAt: timestamp,
          updatedAt: timestamp
        }
      })

      this.drafts.push(copy)
      this.activeResume = copy
      this.activeDraftId = copy.id
      this.persistDrafts()
      return copy
    },

    renameDraft(draftId, title) {
      if (this.drafts.length === 0) this.loadDrafts()
      const draft = this.drafts.find((item) => item.id === draftId)
      if (!draft) return null

      draft.title = title?.trim() || 'Untitled Resume'
      draft.settings = {
        ...draft.settings,
        updatedAt: new Date().toISOString()
      }

      if (draftId === this.activeDraftId) {
        this.activeResume = normalizeCanonicalResume(draft)
      }

      this.persistDrafts()
      return draft
    },

    deleteDraft(draftId) {
      if (this.drafts.length === 0) this.loadDrafts()
      const remainingDrafts = this.drafts.filter((draft) => draft.id !== draftId)
      this.drafts = remainingDrafts

      if (this.activeDraftId === draftId) {
        if (remainingDrafts.length > 0) {
          this.activeResume = normalizeCanonicalResume(remainingDrafts[0])
          this.activeDraftId = this.activeResume.id
        } else {
          this.activeResume = createDefaultResume()
          this.activeDraftId = this.activeResume.id
          this.drafts = [this.activeResume]
        }
      }

      this.persistDrafts()
      return this.activeResume
    },

    setActiveResume(resume) {
      this.activeResume = normalizeCanonicalResume(resume)
      this.activeDraftId = this.activeResume.id
      this.persistActiveDraft()
    },

    updateFromLegacy(legacyResume) {
      this.activeResume = migrateLegacyResume({
        id: legacyResume?.id || this.activeDraftId || this.activeResume.id,
        ...legacyResume
      })
      this.activeDraftId = this.activeResume.id
      this.persistActiveDraft()
      return this.activeResume
    },

    persistActiveDraft() {
      const resume = normalizeCanonicalResume({
        ...this.activeResume,
        settings: {
          ...this.activeResume.settings,
          updatedAt: new Date().toISOString()
        }
      })

      this.activeResume = resume
      this.activeDraftId = resume.id

      if (this.drafts.length === 0) this.loadDrafts()
      const draftIndex = this.drafts.findIndex((draft) => draft.id === resume.id)

      if (draftIndex >= 0) {
        this.drafts.splice(draftIndex, 1, resume)
      } else {
        this.drafts.push(resume)
      }

      this.persistDrafts()
    }
  }
})
