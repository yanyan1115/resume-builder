<template>
  <div id="resumeContent" class="classic-resume" :class="themeClass">
    <header class="resume-header">
      <h1>{{ basics.name || 'Your Name' }}</h1>
      <p v-if="basics.headline || intention.jobTitle" class="resume-headline">
        {{ basics.headline || intention.jobTitle }}
      </p>
      <div class="contact-line">
        <span v-if="basics.email">{{ basics.email }}</span>
        <span v-if="basics.phone">{{ basics.phone }}</span>
        <span v-if="basics.location">{{ basics.location }}</span>
        <span v-if="desiredCity">{{ desiredCity }}</span>
      </div>
    </header>

    <div class="basics-grid" v-if="hasBasicsRow">
      <div v-if="basics.gender" class="basics-item">
        <span class="basics-label">Gender</span>
        <span>{{ basics.gender }}</span>
      </div>
      <div v-if="basics.age" class="basics-item">
        <span class="basics-label">Age</span>
        <span>{{ basics.age }}</span>
      </div>
      <div v-if="formattedBirthDate" class="basics-item">
        <span class="basics-label">Date of Birth</span>
        <span>{{ formattedBirthDate }}</span>
      </div>
      <div v-if="salaryRange" class="basics-item">
        <span class="basics-label">Expected Salary</span>
        <span>{{ salaryRange }}</span>
      </div>
      <div v-if="intention.jobTitle" class="basics-item">
        <span class="basics-label">Target Role</span>
        <span>{{ intention.jobTitle }}</span>
      </div>
    </div>

    <section
      v-for="section in renderedSections"
      :key="section.id"
      class="resume-section"
    >
      <h2 class="section-title">{{ section.title }}</h2>

      <p
        v-if="section.type === 'summary'"
        class="summary-text"
      >{{ section.content || 'Not provided' }}</p>

      <ul v-else-if="section.type === 'skills'" class="skills-list">
        <li v-for="skill in section.items" :key="skill.id" class="skill-tag">
          {{ skill.name }}
        </li>
        <li v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</li>
      </ul>

      <div v-else-if="section.type === 'experience'" class="item-list">
        <div v-for="item in section.items" :key="item.id" class="resume-item">
          <div class="item-header">
            <span class="item-primary">{{ item.company }}</span>
            <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate || 'Present' }}</span>
          </div>
          <div v-if="item.role" class="item-secondary">{{ item.role }}</div>
          <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
        </div>
        <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
      </div>

      <div v-else-if="section.type === 'education'" class="item-list">
        <div v-for="item in section.items" :key="item.id" class="resume-item">
          <div class="item-header">
            <span class="item-primary">{{ item.school }}</span>
            <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate }}</span>
          </div>
          <div v-if="item.degree || item.major" class="item-secondary">
            {{ [item.degree, item.major].filter(Boolean).join(' · ') }}
          </div>
          <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
        </div>
        <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
      </div>

      <div v-else-if="section.type === 'projects'" class="item-list">
        <div v-for="item in section.items" :key="item.id" class="resume-item">
          <div class="item-header">
            <span class="item-primary">{{ item.name }}</span>
            <span v-if="item.url" class="item-url">{{ item.url }}</span>
          </div>
          <div v-if="item.role" class="item-secondary">{{ item.role }}</div>
          <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
        </div>
        <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
      </div>

      <div v-else-if="section.type === 'certificates'" class="item-list">
        <div v-for="item in section.items" :key="item.id" class="resume-item">
          <div class="item-header">
            <span class="item-primary">{{ item.name }}</span>
            <span class="item-date">{{ item.date }}</span>
          </div>
          <div v-if="item.issuer" class="item-secondary">{{ item.issuer }}</div>
        </div>
        <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
      </div>

      <div v-else-if="section.type === 'awards'" class="item-list">
        <div v-for="item in section.items" :key="item.id" class="resume-item">
          <div class="item-header">
            <span class="item-primary">{{ item.title }}</span>
            <span class="item-date">{{ item.date }}</span>
          </div>
          <div v-if="item.issuer" class="item-secondary">{{ item.issuer }}</div>
          <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
        </div>
        <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
      </div>

      <div v-else-if="section.type === 'organizations'" class="item-list">
        <div v-for="item in section.items" :key="item.id" class="resume-item">
          <div class="item-header">
            <span class="item-primary">{{ item.name }}</span>
            <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate }}</span>
          </div>
          <div v-if="item.role" class="item-secondary">{{ item.role }}</div>
          <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
        </div>
        <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
      </div>

      <p v-else class="summary-text whitespace-pre-line">{{ section.displayText || 'Not provided' }}</p>
    </section>
  </div>
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
    },

    hasBasicsRow() {
      return (
        this.basics.gender
        || this.basics.age
        || this.formattedBirthDate
        || this.salaryRange
        || this.intention.jobTitle
      )
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
.classic-resume {
  width: 100%;
  min-height: 100%;
  padding: 40px 48px;
  background: #ffffff;
  color: #1a1a1a;
  font-family: Georgia, 'Times New Roman', 'Songti SC', serif;
  font-size: 13px;
  line-height: 1.6;
  box-sizing: border-box;
}

/* ── Header ── */
.resume-header {
  text-align: center;
  padding-bottom: 18px;
  margin-bottom: 14px;
  border-bottom: 2px solid #1a1a1a;
}

.resume-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #111111;
}

.resume-headline {
  margin: 0 0 8px;
  font-size: 14px;
  color: #444;
  font-style: italic;
}

.contact-line {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 16px;
  font-size: 12px;
  color: #555;
}

/* ── Basics grid (gender / age / birth / salary) ── */
.basics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 32px;
  padding: 10px 0 14px;
  margin-bottom: 4px;
  border-bottom: 1px solid #d0d0d0;
  font-size: 12px;
}

.basics-item {
  display: flex;
  gap: 6px;
}

.basics-label {
  color: #777;
}

/* ── Sections ── */
.resume-section {
  margin-top: 18px;
}

.section-title {
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #1a1a1a;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #111;
}

.summary-text {
  margin: 0;
  color: #333;
  line-height: 1.7;
}

.whitespace-pre-line {
  white-space: pre-line;
}

/* ── Skills ── */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.skill-tag {
  padding: 3px 10px;
  border: 1px solid #bbb;
  border-radius: 2px;
  font-size: 12px;
  color: #333;
}

/* ── Item lists (experience / education / projects …) ── */
.item-list {
  display: grid;
  gap: 14px;
}

.resume-item {
  display: grid;
  gap: 3px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.item-primary {
  font-weight: 700;
  color: #111;
  font-size: 13px;
}

.item-date {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-url {
  font-size: 12px;
  color: #2563eb;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-secondary {
  font-size: 12.5px;
  color: #555;
  font-style: italic;
}

.item-summary {
  margin: 4px 0 0;
  color: #333;
  line-height: 1.65;
}

.empty-note {
  margin: 0;
  color: #aaa;
  font-size: 12px;
  font-style: italic;
}

/* ── Print ── */
@media print {
  @page {
    size: A4;
    margin: 14mm 14mm 16mm;
  }

  .classic-resume {
    width: 182mm;
    min-height: 267mm;
    padding: 0;
    background: #ffffff !important;
    color: #111827 !important;
    font-size: 11pt;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .resume-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .resume-item {
    break-inside: avoid;
  }

  p {
    orphans: 3;
    widows: 3;
  }
}
</style>
