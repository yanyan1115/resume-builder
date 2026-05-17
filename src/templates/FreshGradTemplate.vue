<template>
  <div id="resumeContent" class="fresh-resume" :class="themeClass">
    <header class="fresh-header">
      <div class="header-main">
        <h1>{{ basics.name || 'Your Name' }}</h1>
        <p v-if="basics.headline || intention.jobTitle" class="header-title">
          {{ basics.headline || intention.jobTitle }}
        </p>
      </div>
      <div class="header-contact">
        <span v-if="basics.email">{{ basics.email }}</span>
        <span v-if="basics.phone">{{ basics.phone }}</span>
        <span v-if="basics.location">{{ basics.location }}</span>
        <span v-if="desiredCity">{{ desiredCity }}</span>
      </div>
    </header>

    <div class="meta-bar" v-if="hasMetaRow">
      <span v-if="basics.gender">{{ basics.gender }}</span>
      <span v-if="basics.age">{{ basics.age }} yrs</span>
      <span v-if="formattedBirthDate">{{ formattedBirthDate }}</span>
      <span v-if="intention.jobTitle">{{ intention.jobTitle }}</span>
      <span v-if="salaryRange">{{ salaryRange }}</span>
    </div>

    <main class="fresh-body">
      <section
        v-for="section in renderedSections"
        :key="section.id"
        class="fresh-section"
      >
        <div class="section-label">
          <span class="section-dot"></span>
          <h2>{{ section.title }}</h2>
        </div>

        <div class="section-content">
          <p v-if="section.type === 'summary'" class="body-text">
            {{ section.content || 'Not provided' }}
          </p>

          <div v-else-if="section.type === 'skills'" class="skill-wrap">
            <span v-for="skill in section.items" :key="skill.id" class="skill-chip">
              {{ skill.name }}
            </span>
            <span v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</span>
          </div>

          <div v-else-if="section.type === 'education'" class="item-list">
            <div v-for="item in section.items" :key="item.id" class="fresh-item">
              <div class="item-row">
                <span class="item-primary">{{ item.school }}</span>
                <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate }}</span>
              </div>
              <div v-if="item.degree || item.major" class="item-sub">
                {{ [item.degree, item.major].filter(Boolean).join(' · ') }}
              </div>
              <p v-if="item.summary" class="item-desc">{{ item.summary }}</p>
            </div>
            <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
          </div>

          <div v-else-if="section.type === 'experience'" class="item-list">
            <div v-for="item in section.items" :key="item.id" class="fresh-item">
              <div class="item-row">
                <span class="item-primary">{{ item.company }}</span>
                <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate || 'Present' }}</span>
              </div>
              <div v-if="item.role" class="item-sub">{{ item.role }}</div>
              <p v-if="item.summary" class="item-desc">{{ item.summary }}</p>
            </div>
            <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
          </div>

          <div v-else-if="section.type === 'projects'" class="item-list">
            <div v-for="item in section.items" :key="item.id" class="fresh-item">
              <div class="item-row">
                <span class="item-primary">{{ item.name }}</span>
                <span v-if="item.url" class="item-url">{{ item.url }}</span>
              </div>
              <div v-if="item.role" class="item-sub">{{ item.role }}</div>
              <p v-if="item.summary" class="item-desc">{{ item.summary }}</p>
            </div>
            <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
          </div>

          <div v-else-if="section.type === 'certificates'" class="item-list">
            <div v-for="item in section.items" :key="item.id" class="fresh-item">
              <div class="item-row">
                <span class="item-primary">{{ item.name }}</span>
                <span class="item-date">{{ item.date }}</span>
              </div>
              <div v-if="item.issuer" class="item-sub">{{ item.issuer }}</div>
            </div>
            <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
          </div>

          <div v-else-if="section.type === 'awards'" class="item-list">
            <div v-for="item in section.items" :key="item.id" class="fresh-item">
              <div class="item-row">
                <span class="item-primary">{{ item.title }}</span>
                <span class="item-date">{{ item.date }}</span>
              </div>
              <div v-if="item.issuer" class="item-sub">{{ item.issuer }}</div>
              <p v-if="item.summary" class="item-desc">{{ item.summary }}</p>
            </div>
            <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
          </div>

          <div v-else-if="section.type === 'organizations'" class="item-list">
            <div v-for="item in section.items" :key="item.id" class="fresh-item">
              <div class="item-row">
                <span class="item-primary">{{ item.name }}</span>
                <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate }}</span>
              </div>
              <div v-if="item.role" class="item-sub">{{ item.role }}</div>
              <p v-if="item.summary" class="item-desc">{{ item.summary }}</p>
            </div>
            <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
          </div>

          <p v-else class="body-text whitespace-pre-line">{{ section.displayText || 'Not provided' }}</p>
        </div>
      </section>
    </main>
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
  name: 'FreshGradTemplate',

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

    hasMetaRow() {
      return (
        this.basics.gender
        || this.basics.age
        || this.formattedBirthDate
        || this.intention.jobTitle
        || this.salaryRange
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
.fresh-resume {
  width: 100%;
  min-height: 842px;
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  box-sizing: border-box;
}

/* ── Header ── */
.fresh-header {
  background: #1e3a5f;
  color: #ffffff;
  padding: 28px 40px 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.header-main h1 {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #ffffff;
}

.header-title {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.header-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
  flex-shrink: 0;
}

/* ── Meta bar ── */
.meta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  background: #eef2f7;
  padding: 8px 40px;
  font-size: 12px;
  color: #4b5563;
}

.meta-bar span {
  padding-right: 16px;
  margin-right: 16px;
  border-right: 1px solid #cbd5e1;
}

.meta-bar span:last-child {
  padding-right: 0;
  margin-right: 0;
  border-right: none;
}

/* ── Body ── */
.fresh-body {
  padding: 24px 40px 32px;
}

/* ── Section ── */
.fresh-section {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 0 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.fresh-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 2px;
}

.section-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: #1e3a5f;
}

.section-label h2 {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1e3a5f;
  line-height: 1.4;
}

.section-content {
  min-width: 0;
}

/* ── Text ── */
.body-text {
  margin: 0;
  color: #374151;
  line-height: 1.7;
}

.whitespace-pre-line {
  white-space: pre-line;
}

/* ── Skills ── */
.skill-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-chip {
  padding: 3px 10px;
  background: #eef2f7;
  border-radius: 3px;
  font-size: 12px;
  color: #1e3a5f;
  font-weight: 500;
}

/* ── Items ── */
.item-list {
  display: grid;
  gap: 12px;
}

.fresh-item {
  display: grid;
  gap: 2px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.item-primary {
  font-weight: 600;
  color: #111827;
}

.item-date {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-url {
  font-size: 12px;
  color: #2563eb;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-sub {
  font-size: 12px;
  color: #6b7280;
}

.item-desc {
  margin: 3px 0 0;
  color: #374151;
  font-size: 12.5px;
  line-height: 1.65;
}

.empty-note {
  margin: 0;
  color: #9ca3af;
  font-size: 12px;
  font-style: italic;
}

/* ── Print ── */
@media print {
  @page {
    size: A4;
    margin: 0;
  }

  .fresh-resume {
    width: 210mm;
    min-height: 297mm;
    font-size: 10pt;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .fresh-header {
    padding: 20mm 16mm 14mm;
    background: #1e3a5f !important;
    color: #ffffff !important;
  }

  .meta-bar {
    padding: 5mm 16mm;
    background: #eef2f7 !important;
  }

  .fresh-body {
    padding: 10mm 16mm 14mm;
  }

  .fresh-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .fresh-item {
    break-inside: avoid;
  }

  p {
    orphans: 3;
    widows: 3;
  }
}
</style>
