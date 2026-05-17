import { defineStore } from 'pinia'
import {
  RESUME_STORAGE_KEYS,
  createDefaultResume,
  migrateLegacyResume,
  normalizeCanonicalResume
} from '@/schemas/resumeSchema'
import { resumeApi } from '@/api/resumeApi'

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
    drafts: [],
    syncStatus: 'idle',
    lastSyncError: '',
    syncTimerId: null,
    syncInFlight: false,
    queuedSyncDraft: null
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
      this.scheduleBackendSync(copy)
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
      this.scheduleBackendSync(draft)
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
      // 异步云同步，不阻塞本地操作
      this.scheduleBackendSync(resume)
    },

    // ── 云同步（local-first，仅登录用户，失败静默） ──────────────────

    isLoggedIn() {
      return !!localStorage.getItem('token')
    },

    scheduleBackendSync(draft) {
      if (!this.isLoggedIn()) {
        this.syncStatus = 'idle'
        this.lastSyncError = ''
        return
      }

      this.queuedSyncDraft = draft
      this.lastSyncError = ''
      this.syncStatus = 'syncing'

      if (this.syncTimerId) {
        clearTimeout(this.syncTimerId)
      }

      this.syncTimerId = setTimeout(() => {
        this.syncTimerId = null
        this.flushBackendSync()
      }, 900)
    },

    async flushBackendSync() {
      if (!this.isLoggedIn() || this.syncInFlight || !this.queuedSyncDraft) return

      const draft = this.queuedSyncDraft
      this.queuedSyncDraft = null
      this.syncInFlight = true
      this.syncStatus = 'syncing'
      this.lastSyncError = ''

      try {
        const backendId = draft.settings?.backendId
        if (backendId) {
          await resumeApi.update(backendId, draft)
        } else {
          const res = await resumeApi.create(draft)
          const newBackendId = res.data._id
          // 把 backendId 写回本地草稿
          const target = this.drafts.find((d) => d.id === draft.id)
          if (target) {
            target.settings = { ...target.settings, backendId: newBackendId }
            if (this.activeDraftId === draft.id) {
              this.activeResume = normalizeCanonicalResume(target)
            }
            this.persistDrafts()
          }
        }
        this.syncStatus = 'synced'
      } catch (error) {
        this.syncStatus = 'error'
        this.lastSyncError = error?.response?.data?.error || error?.message || 'Failed to sync draft'
        // 网络失败静默，本地数据已保存
      } finally {
        this.syncInFlight = false
        if (this.queuedSyncDraft && !this.syncTimerId) {
          this.syncTimerId = setTimeout(() => {
            this.syncTimerId = null
            this.flushBackendSync()
          }, 300)
        }
      }
    },

    // 从后端拉取所有草稿，合并到本地（后端优先，本地新增保留）
    async loadFromBackend() {
      if (!this.isLoggedIn()) return
      try {
        const res = await resumeApi.list()
        const remoteDrafts = res.data
        if (!Array.isArray(remoteDrafts) || remoteDrafts.length === 0) return

        // 以 backendId 为 key 建索引
        const localByBackendId = {}
        this.drafts.forEach((d) => {
          if (d.settings?.backendId) localByBackendId[d.settings.backendId] = d
        })

        remoteDrafts.forEach((remote) => {
          const canonical = remote.resume
            ? normalizeCanonicalResume({
                ...remote.resume,
                settings: { ...remote.resume.settings, backendId: remote._id }
              })
            : null
          if (!canonical) return

          const existing = localByBackendId[remote._id]
          if (existing) {
            // 比较 updatedAt，后端更新则覆盖本地
            const localTime = Date.parse(existing.settings?.updatedAt || '') || 0
            const remoteTime = Date.parse(remote.updatedAt || '') || 0
            if (remoteTime > localTime) {
              const idx = this.drafts.findIndex((d) => d.id === existing.id)
              if (idx >= 0) this.drafts.splice(idx, 1, canonical)
            }
          } else {
            this.drafts.push(canonical)
          }
        })

        this.persistDrafts()
      } catch {
        // 拉取失败静默
      }
    },

    // 删除时同步后端
    async deleteDraftWithSync(draftId) {
      const draft = this.drafts.find((d) => d.id === draftId)
      const backendId = draft?.settings?.backendId
      this.deleteDraft(draftId)
      if (backendId && this.isLoggedIn()) {
        try { await resumeApi.remove(backendId) } catch { /* 静默 */ }
      }
    }
  }
})
