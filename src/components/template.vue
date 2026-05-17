<template>
  <component
    :is="selectedTemplate.component"
    :resume="resume"
    :theme="theme"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { getTemplateById } from '@/templates/registry'

export default defineComponent({
  name: 'ResumeTemplate',

  props: {
    resume: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },

  computed: {
    selectedTemplate() {
      return getTemplateById(this.resume?.templateId)
    }
  }
})
</script>
