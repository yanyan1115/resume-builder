<template>
  <article id="resumeContent" class="modern-resume" :class="themeClass">
    <aside class="modern-sidebar">
      <div class="identity-block">
        <h1>{{ basics.name || 'Your Name' }}</h1>
        <p class="headline">{{ basics.headline || intention.jobTitle || '' }}</p>
      </div>

      <section class="sidebar-section">
        <h2>Contact</h2>
        <ul>
          <li v-if="basics.email"><span class="meta-label">Email</span>{{ basics.email }}</li>
          <li v-if="basics.phone"><span class="meta-label">Phone</span>{{ basics.phone }}</li>
          <li v-if="basics.location"><span class="meta-label">City</span>{{ basics.location }}</li>
        </ul>
      </section>

      <section class="sidebar-section" v-if="basics.gender || basics.age || formattedBirthDate">
        <h2>Profile</h2>
        <ul>
          <li v-if="basics.gender"><span class="meta-label">Gender</span>{{ basics.gender }}</li>
          <li v-if="basics.age"><span class="meta-label">Age</span>{{ basics.age }}</li>
          <li v-if="formattedBirthDate"><span class="meta-label">Birth</span>{{ formattedBirthDate }}</li>
        </ul>
      </section>

      <section class="sidebar-section" v-if="intention.jobTitle || desiredCity || salaryRange">
        <h2>Intention</h2>
        <ul>
          <li v-if="intention.jobTitle"><span class="meta-label">Role</span>{{ intention.jobTitle }}</li>
          <li v-if="desiredCity"><span class="meta-label">City</span>{{ desiredCity }}</li>
          <li v-if="salaryRange"><span class="meta-label">Salary</span>{{ salaryRange }}</li>
        </ul>
      </section>

      <section v-if="skillsSection" class="sidebar-section">
        <h2>{{ skillsSection.title }}</h2>
        <div class="skill-list">
          <span v-for="skill in skillsSection.items" :key="skill.id">{{ skill.name }}</span>
          <span v-if="!skillsSection.items || skillsSection.items.length === 0" class="empty-note">Not provided</span>
        </div>
      </section>
    </aside>

    <main class="modern-main">
      <section
        v-for="section in mainSections"
        :key="section.id"
        class="modern-section"
      >
        <h2>{{ section.title }}</h2>

        <p v-if="section.type === 'summary'" class="body-text">
          {{ section.content || 'Not provided' }}
        </p>

        <div v-else-if="section.type === 'experience'" class="item-list">
          <div v-for="item in section.items" :key="item.id" class="resume-item">
            <div class="item-header">
              <span class="item-primary">{{ item.company }}</span>
              <span class="item-date">{{ item.startDate }}<template v-if="item.startDate || item.endDate"> – </template>{{ item.endDate || 'Present' }}</span>
            </div>
            <div v-if="item.role" class="item-role">{{ item.role }}</div>
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
            <div v-if="item.degree || item.major" class="item-role">
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
            <div v-if="item.role" class="item-role">{{ item.role }}</div>
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
            <div v-if="item.issuer" class="item-role">{{ item.issuer }}</div>
          </div>
          <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
        </div>

        <div v-else-if="section.type === 'awards'" class="item-list">
          <div v-for="item in section.items" :key="item.id" class="resume-item">
            <div class="item-header">
              <span class="item-primary">{{ item.title }}</span>
              <span class="item-date">{{ item.date }}</span>
            </div>
            <div v-if="item.issuer" class="item-role">{{ item.issuer }}</div>
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
            <div v-if="item.role" class="item-role">{{ item.role }}</div>
            <p v-if="item.summary" class="item-summary">{{ item.summary }}</p>
          </div>
          <p v-if="!section.items || section.items.length === 0" class="empty-note">Not provided</p>
        </div>

        <p v-else class="body-text whitespace-pre-line">{{ section.displayText || 'Not provided' }}</p>
      </section>
    </main>
  </article>
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
  name: 'ModernTwoColumnTemplate',

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

    skillsSection() {
      return this.renderedSections.find((s) => s.type === 'skills') || null
    },

    mainSections() {
      return this.renderedSections.filter((s) => s.type !== 'skills')
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
.modern-resume {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  width: 100%;
  min-height: 842px;
  background: #ffffff;
  color: #1f2937;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  line-height: 1.6;
}

/* ── Sidebar ── */
.modern-sidebar {
  padding: 36px 20px 36px 24px;
  background: #1e3a5f;
  color: #e8edf3;
  overflow: hidden;
  min-height: 842px;
}

.identity-block {
  padding-bottom: 20px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.identity-block h1 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
  word-break: break-word;
}

.headline {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.sidebar-section {
  padding-top: 20px;
}

.sidebar-section h2 {
  margin: 0 0 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.sidebar-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.sidebar-section li {
  font-size: 12px;
  color: #d1dae5;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.meta-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-list span {
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  font-size: 11px;
  color: #d1dae5;
}

/* ── Main ── */
.modern-main {
  padding: 36px 36px 36px 32px;
}

.modern-section {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modern-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.modern-section h2 {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1e3a5f;
  padding-bottom: 6px;
  border-bottom: 2px solid #1e3a5f;
}

.body-text {
  margin: 0;
  color: #374151;
  font-size: 13px;
  line-height: 1.7;
}

.whitespace-pre-line {
  white-space: pre-line;
}

/* ── Item lists ── */
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
  font-weight: 600;
  color: #111827;
  font-size: 13px;
}

.item-date {
  font-size: 11.5px;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-url {
  font-size: 11.5px;
  color: #2563eb;
  white-space: nowrap;
  flex-shrink: 0;
}

.item-role {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.item-summary {
  margin: 4px 0 0;
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

/* ── Responsive ── */
@media (max-width: 760px) {
  .modern-resume {
    grid-template-columns: 1fr;
  }

  .modern-sidebar {
    padding: 24px 20px;
  }
}

/* ── Print ── */
@media print {
  @page {
    size: A4;
    margin: 0;
  }

  .modern-resume {
    grid-template-columns: 62mm 148mm;
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    font-size: 10pt;
    background: #ffffff !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .modern-sidebar {
    min-height: 297mm;
    padding: 12mm 7mm 12mm 10mm;
    background: #1e3a5f !important;
    color: #e8edf3 !important;
  }

  .modern-main {
    padding: 12mm 12mm 10mm 10mm;
  }

  .modern-section,
  .resume-item,
  .identity-block,
  .sidebar-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .modern-section {
    padding-bottom: 5mm;
    margin-bottom: 5mm;
  }

  p {
    orphans: 3;
    widows: 3;
  }
}
</style>
