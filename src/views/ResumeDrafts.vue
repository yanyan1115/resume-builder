<template>
  <main class="drafts-page">
    <header class="drafts-header">
      <div>
        <h2>Resume Drafts</h2>
        <p>Manage local resumes stored in this browser.</p>
      </div>
      <el-button type="primary" @click="createDraft">New Draft</el-button>
    </header>

    <section class="draft-grid">
      <article
        v-for="draft in resumeStore.sortedDrafts"
        :key="draft.id"
        class="draft-card"
        :class="{ active: draft.id === resumeStore.activeDraftId }"
      >
        <div class="draft-card-header">
          <el-input
            v-model="draft.title"
            class="draft-title-input"
            @change="renameDraft(draft)"
          />
          <span v-if="draft.id === resumeStore.activeDraftId" class="active-badge">Active</span>
        </div>

        <dl class="draft-meta">
          <div>
            <dt>Template</dt>
            <dd>{{ draft.templateId }}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{{ formatDate(draft.settings?.updatedAt) }}</dd>
          </div>
          <div>
            <dt>Name</dt>
            <dd>{{ draft.basics?.name || 'Not Provided' }}</dd>
          </div>
        </dl>

        <div class="draft-actions">
          <el-button @click="openDraft(draft.id)">Open</el-button>
          <el-button @click="duplicateDraft(draft.id)">Duplicate</el-button>
          <el-button type="danger" plain @click="deleteDraft(draft.id)">Delete</el-button>
        </div>
      </article>
    </section>

    <el-empty
      v-if="resumeStore.sortedDrafts.length === 0"
      description="No local drafts yet."
    >
      <el-button type="primary" @click="createDraft">Create First Draft</el-button>
    </el-empty>
  </main>
</template>

<script>
import { defineComponent } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'

export default defineComponent({
  name: 'ResumeDrafts',

  setup() {
    const resumeStore = useResumeStore()
    resumeStore.loadActiveDraft()

    return {
      resumeStore
    }
  },

  methods: {
    createDraft() {
      this.resumeStore.createDraft('Untitled Resume')
      this.$router.push({ name: 'ResumeEditor' })
    },

    openDraft(draftId) {
      this.resumeStore.openDraft(draftId)
      this.$router.push({ name: 'ResumeEditor' })
    },

    duplicateDraft(draftId) {
      const copy = this.resumeStore.duplicateDraft(draftId)
      if (copy) {
        this.$router.push({ name: 'ResumeEditor' })
      }
    },

    renameDraft(draft) {
      this.resumeStore.renameDraft(draft.id, draft.title)
    },

    deleteDraft(draftId) {
      const draft = this.resumeStore.drafts.find((item) => item.id === draftId)
      const confirmed = window.confirm(`Delete "${draft?.title || 'Untitled Resume'}"?`)
      if (!confirmed) return
      this.resumeStore.deleteDraft(draftId)
    },

    formatDate(value) {
      if (!value) return 'Unknown'
      return new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value))
    }
  }
})
</script>

<style scoped>
.drafts-page {
  min-height: 100vh;
  padding: 32px;
  background: #f7fafc;
}

.drafts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.drafts-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 30px;
}

.drafts-header p {
  margin: 6px 0 0;
  color: #667085;
}

.draft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.draft-card {
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid #d8dee4;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.draft-card.active {
  border-color: #2563eb;
}

.draft-card-header,
.draft-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.draft-title-input {
  flex: 1;
}

.active-badge {
  padding: 4px 8px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
}

.draft-meta {
  display: grid;
  gap: 10px;
  margin: 0;
}

.draft-meta div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.draft-meta dt {
  color: #667085;
  font-size: 13px;
}

.draft-meta dd {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

.draft-actions {
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .drafts-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
