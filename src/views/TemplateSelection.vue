<template>
  <div class="template-page">
    <header class="template-header">
      <h2>Choose Template</h2>
      <router-link to="/upload-template">
        <button class="upload-button">Upload Template</button>
      </router-link>
    </header>

    <section class="registry-section">
      <article
        v-for="template in registryTemplates"
        :key="template.id"
        class="registry-card"
      >
        <div class="registry-preview" :class="`preview-${template.id}`">
          <div class="preview-paper">
            <div class="preview-heading"></div>
            <div class="preview-line wide"></div>
            <div class="preview-line"></div>
            <div class="preview-line short"></div>
          </div>
        </div>
        <div class="template-description">
          <h3>{{ template.name }}</h3>
          <p>{{ template.scenario }}</p>
          <button @click="selectRegistryTemplate(template)" class="select-button">Choose Template</button>
        </div>
      </article>
    </section>

    <section class="uploaded-section">
      <div class="section-title-row">
        <h3>Uploaded Template Previews</h3>
        <span>Legacy upload flow is kept for preview assets.</span>
      </div>

      <div class="filters">
        <label for="background-color">Background Color Filter:</label>
        <select v-model="selectedBackgroundColor" id="background-color">
          <option value="">All</option>
          <option value="浅色">Light</option>
          <option value="深色">Dark</option>
          <option value="蓝色">Blue</option>
          <option value="紫色">Purple</option>
          <option value="粉色">Pink</option>
          <option value="红色">Red</option>
        </select>
      </div>

      <div class="template-selection">
        <div v-for="template in filteredUploadedTemplates" :key="template._id || template.id" class="template-card">
          <img :src="template.previewImage" alt="Template Preview" class="template-preview" />
          <div class="template-description">
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <div class="actions-row">
              <button @click="selectUploadedTemplate(template)" class="select-button">Choose Theme</button>
              <button @click="deleteTemplate(template._id)" class="delete-button">Delete Template</button>
            </div>
          </div>
        </div>
      </div>

      <el-empty
        v-if="filteredUploadedTemplates.length === 0"
        description="No uploaded template previews yet."
      />
    </section>
  </div>
</template>

<script>
import apiClient from '@/api/client'
import { templateRegistry } from '@/templates/registry'

export default {
  name: 'TemplateSelection',

  data() {
    return {
      selectedBackgroundColor: '',
      uploadedTemplates: [],
      registryTemplates: templateRegistry
    }
  },

  mounted() {
    apiClient.get('/templates')
      .then((res) => {
        this.uploadedTemplates = res.data
      })
      .catch((err) => {
        console.error('Failed to load the template:', err)
      })
  },

  computed: {
    filteredUploadedTemplates() {
      return this.uploadedTemplates.filter((template) => {
        return this.selectedBackgroundColor
          ? template.backgroundColor === this.selectedBackgroundColor
          : true
      })
    }
  },

  methods: {
    selectRegistryTemplate(template) {
      this.$router.push({
        name: 'ResumeEditor',
        query: {
          templateId: template.id,
          templateName: template.name
        }
      })
    },

    selectUploadedTemplate(template) {
      this.$router.push({
        name: 'ResumeEditor',
        query: {
          templateName: template.name,
          templateStyle: template.style,
          templateTheme: template.theme
        }
      })
    },

    async deleteTemplate(templateId) {
      const confirmDelete = window.confirm('确定要删除这个模板吗？该操作无法撤销。')
      if (!confirmDelete) return

      try {
        await apiClient.delete(`/templates/${templateId}`)
        this.uploadedTemplates = this.uploadedTemplates.filter((template) => template._id !== templateId)
        this.$message?.success?.('The template has been deleted.') || alert('The template has been deleted.')
      } catch (error) {
        console.error('Failed to delete the template:', error)
        this.$message?.error?.('Deletion failed') || alert('Deletion failed')
      }
    }
  }
}
</script>

<style scoped>
.template-page {
  min-height: 100vh;
  padding: 32px;
  background: #f7fafc;
}

.template-header,
.section-title-row,
.actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.template-header {
  margin-bottom: 24px;
}

.template-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 30px;
}

.registry-section,
.template-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.registry-card,
.template-card {
  overflow: hidden;
  border: 1px solid #d8dee4;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.registry-preview {
  display: grid;
  min-height: 180px;
  place-items: center;
  background: #e8f1f8;
}

.preview-paper {
  width: 120px;
  height: 150px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(31, 41, 55, 0.18);
}

.preview-modern-two-column .preview-paper {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 10px;
}

.preview-modern-two-column .preview-paper::before {
  content: '';
  display: block;
  grid-row: 1 / span 4;
  background: #1e3a5f;
}

.preview-fresh-grad .preview-paper {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-fresh-grad .preview-paper::before {
  content: '';
  display: block;
  height: 36px;
  background: #1e3a5f;
  flex-shrink: 0;
}

.preview-fresh-grad .preview-heading,
.preview-fresh-grad .preview-line {
  margin: 10px 12px 0;
}

.preview-fresh-grad .preview-line {
  margin: 6px 12px 0;
}

.preview-heading,
.preview-line {
  height: 10px;
  margin-bottom: 10px;
  background: #1e3a5f;
}

.preview-line {
  height: 6px;
  background: #9ca3af;
}

.preview-line.wide {
  width: 100%;
}

.preview-line.short {
  width: 60%;
}

.template-description {
  padding: 16px;
}

.template-description h3 {
  margin: 0 0 6px;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.template-description p {
  margin: 0 0 14px;
  color: #667085;
  font-size: 13px;
}

.section-title-row span {
  margin: 0;
  color: #667085;
  font-size: 14px;
}

.uploaded-section {
  margin-top: 36px;
}

.section-title-row {
  margin-bottom: 16px;
}

.section-title-row h3 {
  margin: 0;
  color: #1f2937;
}

.filters {
  margin-bottom: 20px;
}

.filters select {
  padding: 8px 12px;
  margin-left: 10px;
  border: 1px solid #d8dee4;
  border-radius: 6px;
}

.template-preview {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.select-button,
.upload-button,
.delete-button {
  padding: 9px 14px;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.select-button,
.upload-button {
  background: #2563eb;
  color: #ffffff;
}

.delete-button {
  border: 1px solid #e53e3e;
  background: transparent;
  color: #e53e3e;
}

@media (max-width: 768px) {
  .template-header,
  .section-title-row,
  .actions-row {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
