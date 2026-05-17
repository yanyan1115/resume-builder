<template>
  <div class="resume-preview-page">
    <ResumeTemplate :resume="resumeStore.activeResume" :theme="resumeStore.themeId" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ResumeTemplate from '@/components/template.vue'
import { useResumeStore } from '@/stores/resumeStore'

export default defineComponent({
  name: 'ResumePreview',

  components: {
    ResumeTemplate
  },

  setup() {
    const resumeStore = useResumeStore()
    resumeStore.loadActiveDraft()

    return {
      resumeStore
    }
  }
})
</script>

<style scoped>
.resume-preview-page {
  min-height: 100vh;
  padding: 32px;
  background: #f7fafc;
}
</style>
