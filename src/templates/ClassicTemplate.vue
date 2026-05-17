<template>
  <el-container id="resumeContent" class="classic-template" :class="themeClass">
    <el-header>
      <h3
        class="mb-6 text-4xl font-semibold text-primary-text"
        style="font-family: 'Microsoft JhengHei Light', 'Dancing Script', system-ui;"
      >Personal Resume</h3>
    </el-header>
    <el-main>
      <el-card class="box-card">
        <template #header>
          <div class="clearfix">
            <span>Basic Information</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Name: </strong>
              {{ basics.name || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Gender: </strong>
              {{ basics.gender || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Age: </strong>
              {{ basics.age || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Date of Birth: </strong>
              {{ formattedBirthDate || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Email: </strong>
              {{ basics.email || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Phone: </strong>
              {{ basics.phone || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Desired City: </strong>
              <span v-if="desiredCity">{{ desiredCity }}</span>
              <span v-else>Not Provided</span>
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Address: </strong>
              {{ basics.location || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Desired Salary: </strong>
              {{ salaryRange || 'Not Provided' }}
            </p>
          </el-col>

          <el-col :span="8">
            <p class="text-sm text-primary-text">
              <strong>Desired Job: </strong>
              {{ intention.jobTitle || 'Not Provided' }}
            </p>
          </el-col>
        </el-row>
      </el-card>

      <el-card
        v-for="section in renderedSections"
        :key="section.id"
        class="box-card"
      >
        <template #header>
          <div class="clearfix">
            <span>{{ section.title }}</span>
          </div>
        </template>
        <p class="text-sm text-primary-text whitespace-pre-line">
          {{ section.displayText || 'Not Provided' }}
        </p>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent } from 'vue'
import { createDefaultResume } from '@/schemas/resumeSchema'
import {
  formatBirthDate,
  formatDesiredCity,
  formatSalaryRange,
  visibleSections
} from './templateUtils'

export default defineComponent({
  name: 'ClassicTemplate',

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

  data() {
    return {
      themeClass: this.theme || 'theme-light'
    }
  },

  computed: {
    safeResume() {
      return this.resume || createDefaultResume()
    },

    basics() {
      return this.safeResume.basics || {}
    },

    intention() {
      return this.safeResume.intention || {}
    },

    formattedBirthDate() {
      return formatBirthDate(this.basics)
    },

    desiredCity() {
      return formatDesiredCity(this.intention)
    },

    salaryRange() {
      return formatSalaryRange(this.intention)
    },

    renderedSections() {
      return visibleSections(this.safeResume)
    }
  },

  watch: {
    theme(newTheme) {
      this.themeClass = newTheme
      this.loadThemeStyle(newTheme)
    }
  },

  mounted() {
    this.loadThemeStyle(this.themeClass)
  },

  methods: {
    loadThemeStyle(theme) {
      const id = 'theme-style'
      const existing = document.getElementById(id)
      if (existing) existing.remove()

      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = `/themes/${theme}.css`
      document.head.appendChild(link)
    }
  }
})
</script>

<style scoped>
.classic-template {
  width: 100%;
  height: 100%;
}

.text-primary-text {
  color: #303133;
}

.box-card {
  margin-bottom: 20px;
}

.whitespace-pre-line {
  white-space: pre-line;
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  .classic-template {
    width: 190mm;
    min-height: 277mm;
    height: auto;
    margin: 0 auto;
    background: #ffffff !important;
    color: #111827 !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .classic-template :deep(.el-header) {
    height: auto;
    padding: 0 0 8mm;
  }

  .classic-template :deep(.el-main) {
    padding: 0;
  }

  .classic-template :deep(.el-card) {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #d8dee4;
    box-shadow: none;
  }

  .classic-template :deep(.el-card__header),
  .classic-template :deep(.el-card__body) {
    padding: 10px 14px;
  }

  .box-card {
    margin-bottom: 8mm;
  }

  p {
    orphans: 3;
    widows: 3;
  }
}
</style>
