<template>
  <div class="editor-shell">
    <section class="editor-panel">
      <header class="editor-header">
        <div>
          <h2>Resume Editing</h2>
          <p>{{ resume.title }}</p>
        </div>
        <router-link to="/drafts" class="drafts-link">Manage Drafts</router-link>
      </header>

      <el-form label-position="top" class="editor-form">
        <section class="form-section">
          <h3>Resume Setup</h3>
          <el-form-item label="Draft Title">
            <el-input v-model="resume.title" placeholder="Frontend Developer Resume" @change="renameActiveDraft" />
          </el-form-item>

          <el-form-item label="Choose Resume Template">
            <el-select v-model="selectedTemplateId" class="w-full" @change="handleTemplateChange">
              <el-option
                v-for="template in templates"
                :key="template.id"
                :label="template.name"
                :value="template.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Choose Theme">
            <el-select v-model="resume.themeId" class="w-full" @change="handleThemeChange">
              <el-option
                v-for="theme in themeOptions"
                :key="theme.value"
                :label="theme.label"
                :value="theme.value"
              />
            </el-select>
          </el-form-item>
        </section>

        <section class="form-section">
          <h3>Basic Information</h3>
          <el-form-item label="Name">
            <el-input v-model="resume.basics.name" placeholder="Please enter your name..." @change="persistDraft" />
          </el-form-item>

          <el-form-item label="Headline">
            <el-input v-model="resume.basics.headline" placeholder="Frontend Developer" @change="persistDraft" />
          </el-form-item>

          <el-form-item label="Gender">
            <el-select v-model="resume.basics.gender" class="w-full" @change="persistDraft">
              <el-option label="Male" value="Male" />
              <el-option label="Female" value="Female" />
            </el-select>
          </el-form-item>

          <el-form-item label="Age">
            <el-slider v-model="resume.basics.age" :min="16" :max="60" class="w-full" @change="persistDraft" />
            <p class="field-note">Current selection: {{ resume.basics.age || 'Not Provided' }} years old</p>
          </el-form-item>

          <el-form-item label="Date of Birth">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-select v-model="resume.basics.birthDate.year" class="w-full" @change="persistDraft">
                  <el-option
                    v-for="year in 50"
                    :key="year"
                    :label="1975 + year"
                    :value="1975 + year"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="resume.basics.birthDate.month" class="w-full" @change="persistDraft">
                  <el-option
                    v-for="(monthName, index) in monthOptions"
                    :key="index"
                    :label="monthName"
                    :value="index + 1"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="Email">
            <el-input v-model="resume.basics.email" placeholder="Please enter your email..." @change="persistDraft" />
          </el-form-item>

          <el-form-item label="Phone">
            <el-input v-model="resume.basics.phone" placeholder="Please enter your phone number..." @change="persistDraft" />
          </el-form-item>

          <el-form-item label="Location">
            <el-input v-model="resume.basics.location" placeholder="Please enter your city..." @change="persistDraft" />
          </el-form-item>
        </section>

        <section class="form-section">
          <h3>Job Intention</h3>
          <el-form-item label="Choose Desired Province">
            <el-select v-model="resume.intention.location.province" @change="updateCities" class="w-full">
              <el-option
                v-for="province in provinces"
                :key="province"
                :label="province"
                :value="province"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Choose Desired City" v-if="cities.length > 0">
            <el-select v-model="resume.intention.location.city" class="w-full" @change="persistDraft">
              <el-option v-for="c in cities" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>

          <el-form-item label="Choose Desired Industry">
            <el-select v-model="resume.intention.industry" class="w-full" @change="handleIndustryChange">
              <el-option
                v-for="industry in industries"
                :key="industry.value"
                :label="industry.label"
                :value="industry.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Choose Desired Job">
            <el-select v-model="resume.intention.jobTitle" class="w-full" @change="persistDraft">
              <el-option
                v-for="(option, index) in jobOptions"
                :key="index"
                :label="option"
                :value="option"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="Choose Desired Salary">
            <el-slider
              v-model="salaryRange"
              :min="3000"
              :max="30000"
              :step="1000"
              range
              class="w-full"
              @change="persistDraft"
            />
            <div class="salary-row">
              <span>{{ salaryRange[0] }} RMB</span>
              <span>{{ salaryRange[1] }} RMB</span>
            </div>
          </el-form-item>
        </section>

        <section class="form-section">
          <div class="section-heading-row">
            <h3>Resume Sections</h3>
          </div>

          <article v-for="section in editableSections" :key="section.id" class="section-editor">
            <div class="section-toolbar">
              <el-input v-model="section.title" class="section-title-input" @change="persistDraft" />
              <el-switch
                v-model="section.visible"
                active-text="Visible"
                inactive-text="Hidden"
                @change="persistDraft"
              />
            </div>

            <el-input
              v-if="section.type === 'summary'"
              v-model="section.content"
              type="textarea"
              :rows="3"
              placeholder="Please enter your personal strengths..."
              @change="persistDraft"
            />

            <div v-else-if="section.type === 'skills'" class="skills-editor">
              <div v-for="skill in section.items" :key="skill.id" class="inline-row">
                <el-input v-model="skill.name" placeholder="Skill name" @change="persistDraft" />
                <el-button @click="removeItem(section, skill.id)">Delete</el-button>
              </div>
              <el-button @click="addSkill(section)">Add Skill</el-button>
            </div>

            <div v-else class="items-editor">
              <article v-for="item in section.items" :key="item.id" class="item-editor">
                <div class="item-toolbar">
                  <strong>{{ itemLabel(section.type) }}</strong>
                  <el-button @click="removeItem(section, item.id)">Delete</el-button>
                </div>

                <template v-if="section.type === 'experience'">
                  <el-input v-model="item.company" placeholder="Company" @change="persistDraft" />
                  <el-input v-model="item.role" placeholder="Role" @change="persistDraft" />
                  <div class="inline-row">
                    <el-input v-model="item.startDate" placeholder="Start date" @change="persistDraft" />
                    <el-input v-model="item.endDate" placeholder="End date" @change="persistDraft" />
                  </div>
                </template>

                <template v-else-if="section.type === 'projects'">
                  <el-input v-model="item.name" placeholder="Project name" @change="persistDraft" />
                  <el-input v-model="item.role" placeholder="Role" @change="persistDraft" />
                  <el-input v-model="item.url" placeholder="Project URL" @change="persistDraft" />
                </template>

                <template v-else-if="section.type === 'education'">
                  <el-input v-model="item.school" placeholder="School" @change="persistDraft" />
                  <el-input v-model="item.degree" placeholder="Degree" @change="persistDraft" />
                  <el-input v-model="item.major" placeholder="Major" @change="persistDraft" />
                </template>

                <template v-else-if="section.type === 'certificates'">
                  <el-input v-model="item.name" placeholder="Certification" @change="persistDraft" />
                  <el-input v-model="item.issuer" placeholder="Issuer" @change="persistDraft" />
                  <el-input v-model="item.date" placeholder="Date" @change="persistDraft" />
                </template>

                <template v-else-if="section.type === 'awards'">
                  <el-input v-model="item.title" placeholder="Award title" @change="persistDraft" />
                  <el-input v-model="item.issuer" placeholder="Issuer" @change="persistDraft" />
                  <el-input v-model="item.date" placeholder="Date" @change="persistDraft" />
                </template>

                <template v-else-if="section.type === 'organizations'">
                  <el-input v-model="item.name" placeholder="Organization" @change="persistDraft" />
                  <el-input v-model="item.role" placeholder="Role" @change="persistDraft" />
                </template>

                <el-input
                  v-model="item.summary"
                  type="textarea"
                  :rows="3"
                  placeholder="Summary"
                  @change="persistDraft"
                />
              </article>

              <el-button @click="addItem(section)">Add {{ itemLabel(section.type) }}</el-button>
            </div>
          </article>
        </section>

        <section class="form-section">
          <h3>Export</h3>
          <el-form-item label="Export Format">
            <el-select v-model="resume.settings.exportType" class="w-full" @change="persistDraft">
              <el-option value="print" label="Print / Save as PDF" />
              <el-option value="html" label="html" />
              <el-option value="word" label="word" />
              <el-option value="pdf" label="Legacy Screenshot PDF" />
            </el-select>
          </el-form-item>
          <el-button @click="exportResume" type="primary" class="w-full">Save and Export</el-button>
        </section>
      </el-form>
    </section>

    <a href="#" ref="downloadLink" style="display: none;">Download HTML</a>

    <aside class="preview-panel">
      <ResumeTemplate ref="resumeTemplate" :resume="resume" :theme="resume.themeId" />
    </aside>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { asBlob } from 'html-docx-js-typescript'
import ResumeTemplate from '../components/template.vue'
import { createDefaultResume, normalizeCanonicalResume } from '@/schemas/resumeSchema'
import { useResumeStore } from '@/stores/resumeStore'
import { templateRegistry } from '@/templates/registry'

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export default {
  name: 'ResumeEditor',

  components: {
    ResumeTemplate
  },

  setup() {
    const resumeStore = useResumeStore()
    return {
      resumeStore
    }
  },

  data() {
    return {
      monthOptions: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      jobOptions: [],
      cities: [],
      selectedTemplateId: null,
      templates: templateRegistry,
      themeOptions: [
        { label: 'Light', value: 'theme-light' },
        { label: 'Dark', value: 'theme-dark' },
        { label: 'Blue', value: 'theme-blue' },
        { label: 'Purple', value: 'theme-purple' },
        { label: 'Pink', value: 'theme-pink' },
        { label: 'Red', value: 'theme-red' }
      ],
      industries: [
        { label: 'Internet', value: 'internet' },
        { label: 'Human Resources', value: 'hr' },
        { label: 'Supply Chain/Logistics', value: 'supply_chain' },
        { label: 'Agriculture/Forestry/Animal Husbandry/Fishery', value: 'agriculture' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Consulting/Translation', value: 'consulting' },
        { label: 'Marketing/Public Relations/Advertising', value: 'marketing' },
        { label: 'Film/Media', value: 'media' },
        { label: 'Real Estate/Construction', value: 'real_estate' },
        { label: 'Education/Training', value: 'education' },
        { label: 'Services', value: 'services' },
        { label: 'Law', value: 'law' },
        { label: 'Electronics/Telecommunications', value: 'electronics' },
        { label: 'Design', value: 'design' },
        { label: 'Finance/Audit/Taxation', value: 'audit' },
        { label: 'Hospitality/Tourism', value: 'hospitality' },
        { label: 'Procurement/Trade', value: 'trade' },
        { label: 'Finance', value: 'finance' },
        { label: 'Sales', value: 'sales' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Other Industries', value: 'other' }
      ],
      provinces: [
        'Beijing', 'Shanghai', 'Tianjin', 'Chongqing',
        'Hebei', 'Shanxi', 'Liaoning', 'Jilin', 'Heilongjiang',
        'Jiangsu', 'Zhejiang', 'Anhui', 'Fujian', 'Jiangxi', 'Shandong',
        'Henan', 'Hubei', 'Hunan', 'Guangdong', 'Hainan',
        'Sichuan', 'Guizhou', 'Yunnan', 'Shaanxi', 'Gansu', 'Qinghai',
        'Taiwan', 'Inner Mongolia', 'Guangxi', 'Tibet', 'Ningxia', 'Xinjiang',
        'Hong Kong', 'Macau'
      ]
    }
  },

  computed: {
    resume() {
      return this.resumeStore.activeResume || createDefaultResume()
    },

    editableSections() {
      return [...(this.resume.sections || [])].sort((a, b) => a.order - b.order)
    },

    salaryRange: {
      get() {
        const range = this.resume.intention.salaryRange || {}
        return [range.min || 5000, range.max || 15000]
      },
      set(value) {
        this.resume.intention.salaryRange.min = value[0]
        this.resume.intention.salaryRange.max = value[1]
        this.resume.intention.salaryRange.currency = 'CNY'
      }
    }
  },

  mounted() {
    const activeResume = this.resumeStore.loadActiveDraft()
    const templateTheme = this.$route.query.templateTheme
    const routeTemplateId = this.$route.query.templateId
    if (templateTheme) {
      activeResume.themeId = templateTheme
    }
    if (routeTemplateId) {
      activeResume.templateId = routeTemplateId
    }
    if (templateTheme || routeTemplateId) {
      this.resumeStore.setActiveResume(activeResume)
    }
    this.selectedTemplateId = this.resume.templateId
    this.updateJobOptions(this.resume.intention.industry)
    this.updateCities(this.resume.intention.location.province, false)
    this.loadTheme(this.resume.themeId)
  },

  methods: {
    persistDraft() {
      this.resumeStore.setActiveResume(normalizeCanonicalResume(this.resume))
    },

    renameActiveDraft() {
      this.resumeStore.renameDraft(this.resume.id, this.resume.title)
    },

    handleIndustryChange(industry) {
      this.updateJobOptions(industry)
      this.persistDraft()
    },

    updateJobOptions(industry) {
      const jobOptions = {
        internet: ['Backend Developer', 'Frontend Developer', 'Mobile Developer'],
        hr: ['HR Manager', 'Recruitment Specialist'],
        supply_chain: ['Logistics Manager', 'Supply Chain Manager'],
        agriculture: ['Farm Manager', 'Agricultural Consultant'],
        manufacturing: ['Production Manager', 'Equipment Maintenance Engineer'],
        healthcare: ['Doctor', 'Nurse', 'Healthcare Consultant'],
        consulting: ['Management Consultant', 'Market Consultant'],
        marketing: ['Marketing Manager', 'Brand Manager'],
        media: ['Director', 'Screenwriter'],
        real_estate: ['Real Estate Sales', 'Real Estate Project Manager'],
        education: ['Teacher', 'Education Consultant'],
        services: ['Customer Service Representative', 'Service Manager'],
        law: ['Lawyer', 'Legal Specialist'],
        electronics: ['Electronics Engineer', 'Telecommunications Engineer'],
        design: ['UI Designer', 'Graphic Designer'],
        audit: ['Finance Manager', 'Auditor'],
        hospitality: ['Hotel Manager', 'Tourism Consultant'],
        trade: ['Procurement Manager', 'Supply Chain Manager'],
        sales: ['Sales Manager', 'Sales Representative'],
        restaurant: ['Restaurant Manager', 'Chef'],
        finance: ['Asset Appraiser', 'Investment Manager'],
        other: ['Other']
      }

      this.jobOptions = jobOptions[industry] || []
    },

    updateCities(province, resetCity = true) {
      if (!province) return
      const cities = {
        Beijing: ['Beijing'],
        Shanghai: ['Shanghai'],
        Tianjin: ['Tianjin'],
        Chongqing: ['Chongqing'],
        Hebei: ['Shijiazhuang', 'Tangshan', 'Baoding'],
        Shanxi: ['Taiyuan', 'Datong', 'Linfen'],
        Liaoning: ['Shenyang', 'Dalian', 'Anshan'],
        Jilin: ['Changchun', 'Jilin City', 'Siping'],
        Heilongjiang: ['Harbin', 'Qiqihar', 'Daqing'],
        Jiangsu: ['Nanjing', 'Suzhou', 'Wuxi'],
        Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
        Anhui: ['Hefei', 'Wuhu', 'Anqing'],
        Fujian: ['Fuzhou', 'Xiamen', 'Quanzhou'],
        Jiangxi: ['Nanchang', 'Ganzhou', 'Jiujiang'],
        Shandong: ['Jinan', 'Qingdao', 'Yantai'],
        Henan: ['Zhengzhou', 'Luoyang', 'Kaifeng'],
        Hubei: ['Wuhan', 'Yichang', 'Xiangyang'],
        Hunan: ['Changsha', 'Yueyang', 'Zhuzhou'],
        Guangdong: ['Guangzhou', 'Shenzhen', 'Zhuhai'],
        Hainan: ['Haikou', 'Sanya', 'Danzhou'],
        Sichuan: ['Chengdu', 'Mianyang', 'Leshan'],
        Guizhou: ['Guiyang', 'Zunyi', 'Anshun'],
        Yunnan: ['Kunming', 'Dali', 'Qujing'],
        Shaanxi: ['Xi\'an', 'Xianyang', 'Baoji'],
        Gansu: ['Lanzhou', 'Tianshui', 'Jiuquan'],
        Qinghai: ['Xining', 'Haidong', 'Golmud'],
        Taiwan: ['Taipei', 'Kaohsiung', 'Taichung'],
        'Inner Mongolia': ['Hohhot', 'Baotou', 'Chifeng'],
        Guangxi: ['Nanning', 'Guilin', 'Liuzhou'],
        Tibet: ['Lhasa', 'Shigatse', 'Nyingchi'],
        Ningxia: ['Yinchuan', 'Wuzhong', 'Shizuishan'],
        Xinjiang: ['Urumqi', 'Kashgar', 'Yining'],
        'Hong Kong': ['Hong Kong Island', 'Kowloon', 'New Territories'],
        Macau: ['Macau Peninsula', 'Taipa', 'Coloane']
      }
      this.cities = cities[province] || []
      if (resetCity) {
        this.resume.intention.location.city = ''
        this.persistDraft()
      }
    },

    handleTemplateChange(selectedId) {
      const selectedTemplate = this.templates.find((template) => template.id === selectedId)
      if (selectedTemplate) {
        this.resume.templateId = selectedTemplate.id
        if (!selectedTemplate.themeSupport.includes(this.resume.themeId)) {
          this.resume.themeId = selectedTemplate.themeSupport[0]
          this.loadTheme(this.resume.themeId)
        }
        this.persistDraft()
      }
    },

    handleThemeChange(themeId) {
      this.loadTheme(themeId)
      this.persistDraft()
    },

    loadTheme(themeName) {
      const existingLink = document.getElementById('dynamic-theme')
      if (existingLink) {
        existingLink.href = `${process.env.BASE_URL}themes/${themeName}.css`
        return
      }

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = `${process.env.BASE_URL}themes/${themeName}.css`
      link.id = 'dynamic-theme'
      document.head.appendChild(link)
    },

    itemLabel(type) {
      const labels = {
        experience: 'Work Experience',
        projects: 'Project',
        education: 'Education',
        certificates: 'Certification',
        awards: 'Award',
        organizations: 'Organization'
      }
      return labels[type] || 'Item'
    },

    addSkill(section) {
      section.items.push({
        id: createId('skill'),
        name: '',
        level: '',
        category: ''
      })
      this.persistDraft()
    },

    addItem(section) {
      const factories = {
        experience: () => ({
          id: createId('work'),
          company: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          summary: '',
          highlights: []
        }),
        projects: () => ({
          id: createId('project'),
          name: '',
          role: '',
          startDate: '',
          endDate: '',
          url: '',
          summary: '',
          highlights: [],
          technologies: []
        }),
        education: () => ({
          id: createId('education'),
          school: '',
          degree: '',
          major: '',
          startDate: '',
          endDate: '',
          summary: '',
          highlights: []
        }),
        certificates: () => ({
          id: createId('certificate'),
          name: '',
          issuer: '',
          date: '',
          url: '',
          summary: ''
        }),
        awards: () => ({
          id: createId('award'),
          title: '',
          issuer: '',
          date: '',
          summary: ''
        }),
        organizations: () => ({
          id: createId('organization'),
          name: '',
          role: '',
          startDate: '',
          endDate: '',
          summary: '',
          highlights: []
        })
      }

      section.items.push((factories[section.type] || (() => ({ id: createId('item'), summary: '' })))())
      this.persistDraft()
    },

    removeItem(section, itemId) {
      section.items = section.items.filter((item) => item.id !== itemId)
      this.persistDraft()
    },

    exportToWord() {
      const content = document.querySelector('#resumeContent').innerHTML
      asBlob(content).then((data) => {
        saveAs(data, 'resume.docx')
      })
    },

    printResume() {
      this.persistDraft()
      window.print()
    },

    exportResume() {
      this.persistDraft()
      if (this.resume.settings.exportType === 'print') {
        this.printResume()
      } else if (this.resume.settings.exportType === 'pdf') {
        const resumeElement = document.querySelector('#resumeContent')
        html2canvas(resumeElement, {
          useCORS: true,
          scale: 4,
          allowTaint: false,
          taintTest: false,
          logging: false,
          dpi: window.devicePixelRatio * 4
        }).then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4')
          const ctx = canvas.getContext('2d')
          const a4w = 190
          const a4h = 277
          const imgHeight = Math.floor((a4h * canvas.width) / a4w)
          let renderedHeight = 0

          while (renderedHeight < canvas.height) {
            const page = document.createElement('canvas')
            page.width = canvas.width
            page.height = Math.min(imgHeight, canvas.height - renderedHeight)
            page
              .getContext('2d')
              .putImageData(
                ctx.getImageData(
                  0,
                  renderedHeight,
                  canvas.width,
                  Math.min(imgHeight, canvas.height - renderedHeight)
                ),
                0,
                0
              )
            pdf.addImage(
              page.toDataURL('image/jpeg', 1.0),
              'JPEG',
              10,
              10,
              a4w,
              Math.min(a4h, (a4w * page.height) / page.width)
            )

            renderedHeight += imgHeight
            if (renderedHeight < canvas.height) {
              pdf.addPage()
            }
          }

          pdf.save(this.resume.basics.name ? `${this.resume.basics.name}_resume.pdf` : 'resume.pdf')
        })
      } else if (this.resume.settings.exportType === 'word') {
        this.exportToWord()
      } else {
        const content = document.querySelector('#resumeContent').innerHTML
        const styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              return Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join('\n')
            } catch (error) {
              return ''
            }
          })
          .join('\n')

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Exported Document</title>
          <style>${styles}</style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `
        const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent)
        const downloadLink = this.$refs.downloadLink
        downloadLink.href = dataUri
        downloadLink.download = 'resume.html'
        downloadLink.click()
      }
    }
  }
}
</script>

<style scoped>
.editor-shell {
  display: grid;
  grid-template-columns: minmax(360px, 520px) minmax(520px, 1fr);
  gap: 24px;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(90deg, #2196f3, #4caf50);
}

.editor-panel,
.preview-panel {
  min-width: 0;
}

.editor-panel {
  height: calc(100vh - 48px);
  overflow: auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
}

.preview-panel {
  height: calc(100vh - 48px);
  overflow: auto;
  background: #ffffff;
  border-radius: 8px;
}

.editor-header h2 {
  margin: 0 0 24px;
  color: #333333;
  font-family: 'Microsoft JhengHei Light', 'Dancing Script', system-ui;
  font-size: 32px;
  font-weight: 600;
}

.editor-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.editor-header h2 {
  margin-bottom: 6px;
}

.editor-header p {
  margin: 0 0 18px;
  color: #667085;
}

.drafts-link {
  flex: 0 0 auto;
  padding: 8px 12px;
  border: 1px solid #d8dee4;
  border-radius: 6px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.form-section {
  padding: 18px 0;
  border-top: 1px solid #e2e8f0;
}

.form-section:first-child {
  border-top: 0;
  padding-top: 0;
}

.form-section h3 {
  margin: 0 0 16px;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
}

.field-note {
  margin: 4px 0 0;
  color: #666666;
  font-size: 13px;
}

.salary-row,
.section-toolbar,
.item-toolbar,
.inline-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.salary-row,
.section-toolbar,
.item-toolbar {
  justify-content: space-between;
}

.section-editor,
.item-editor {
  display: grid;
  gap: 12px;
  padding: 14px;
  margin-bottom: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.section-title-input {
  flex: 1;
}

.skills-editor,
.items-editor {
  display: grid;
  gap: 12px;
}

.w-full {
  width: 100%;
}

@media (max-width: 1024px) {
  .editor-shell {
    grid-template-columns: 1fr;
  }

  .editor-panel,
  .preview-panel {
    height: auto;
  }
}

@media print {
  html,
  body {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    background: #ffffff !important;
  }

  .editor-shell {
    display: block;
    min-height: auto;
    padding: 0;
    background: #ffffff !important;
  }

  .editor-panel {
    display: none;
  }

  .preview-panel {
    height: auto;
    overflow: visible;
    border-radius: 0;
    background: #ffffff;
  }
}
</style>
