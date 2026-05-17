<template>
  <article id="resumeContent" class="modern-template" :class="themeClass">
    <aside class="modern-sidebar">
      <div class="identity-block">
        <h1>{{ basics.name || 'Your Name' }}</h1>
        <p>{{ basics.headline || intention.jobTitle || 'Professional Resume' }}</p>
      </div>

      <section class="sidebar-section">
        <h2>Contact</h2>
        <p>{{ basics.email || 'Not Provided' }}</p>
        <p>{{ basics.phone || 'Not Provided' }}</p>
        <p>{{ basics.location || 'Not Provided' }}</p>
      </section>

      <section class="sidebar-section">
        <h2>Profile</h2>
        <p><strong>Gender</strong> {{ basics.gender || 'Not Provided' }}</p>
        <p><strong>Age</strong> {{ basics.age || 'Not Provided' }}</p>
        <p><strong>Birth</strong> {{ formattedBirthDate || 'Not Provided' }}</p>
      </section>

      <section class="sidebar-section">
        <h2>Intention</h2>
        <p>{{ intention.jobTitle || 'Not Provided' }}</p>
        <p>{{ desiredCity || 'Not Provided' }}</p>
        <p>{{ salaryRange || 'Not Provided' }}</p>
      </section>

      <section v-if="skillsSection" class="sidebar-section">
        <h2>{{ skillsSection.title }}</h2>
        <div class="skill-list">
          <span v-for="skill in skillsSection.items" :key="skill.id">
            {{ skill.name }}
          </span>
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
        <p class="whitespace-pre-line">{{ section.displayText || 'Not Provided' }}</p>
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
      return this.renderedSections.find((section) => section.type === 'skills')
    },

    mainSections() {
      return this.renderedSections.filter((section) => section.type !== 'skills')
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
.modern-template {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  width: 100%;
  min-height: 100%;
  background: #ffffff;
  color: #1f2937;
  font-family: Arial, Helvetica, sans-serif;
}

.modern-sidebar {
  padding: 32px 24px;
  background: #263238;
  color: #ffffff;
}

.identity-block {
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
}

.identity-block h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.1;
}

.identity-block p {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.78);
}

.sidebar-section {
  padding-top: 22px;
}

.sidebar-section h2,
.modern-section h2 {
  margin: 0 0 12px;
  font-size: 15px;
  letter-spacing: 0;
  text-transform: uppercase;
}

.sidebar-section p {
  margin: 6px 0;
  font-size: 13px;
  line-height: 1.5;
}

.sidebar-section strong {
  display: inline-block;
  min-width: 48px;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-list span {
  padding: 5px 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
}

.modern-main {
  padding: 36px 40px;
}

.modern-section {
  padding-bottom: 22px;
  margin-bottom: 22px;
  border-bottom: 1px solid #d8dee4;
}

.modern-section h2 {
  color: #263238;
}

.modern-section p {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
}

.whitespace-pre-line {
  white-space: pre-line;
}

@media (max-width: 760px) {
  .modern-template {
    grid-template-columns: 1fr;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }

  .modern-template {
    grid-template-columns: 64mm 146mm;
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    background: #ffffff !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .modern-sidebar {
    min-height: 297mm;
    padding: 12mm 8mm;
    background: #263238 !important;
    color: #ffffff !important;
  }

  .modern-main {
    padding: 14mm 14mm 12mm;
  }

  .modern-section,
  .sidebar-section,
  .identity-block {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .modern-section {
    padding-bottom: 7mm;
    margin-bottom: 7mm;
  }

  .skill-list span {
    break-inside: avoid;
  }

  p {
    orphans: 3;
    widows: 3;
  }
}
</style>
