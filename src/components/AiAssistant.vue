<template>
  <div class="ai-assistant">
    <div class="ai-header" @click="expanded = !expanded">
      <div class="ai-title">
        <span class="ai-icon">✨</span>
        <span>AI Job Match Analysis</span>
        <el-tag v-if="hasConfig" size="small" type="success" class="provider-tag">{{ configLabel }}</el-tag>
        <el-tag v-else size="small" type="info" class="provider-tag">Not configured</el-tag>
      </div>
      <el-icon class="collapse-icon" :class="{ rotated: expanded }"><ArrowDown /></el-icon>
    </div>

    <transition name="slide">
      <div v-show="expanded" class="ai-body">

        <!-- Settings panel -->
        <div v-if="showSettings" class="settings-panel">
          <h4>AI Provider Settings</h4>
          <el-form label-position="top" size="small">
            <el-form-item label="Provider">
              <el-select v-model="settingsForm.providerType" class="w-full" @change="onProviderChange">
                <el-option label="Claude (Anthropic)" value="claude" />
                <el-option label="OpenAI (GPT)" value="openai" />
                <el-option label="DeepSeek" value="deepseek" />
              </el-select>
            </el-form-item>
            <el-form-item label="API Key">
              <el-input
                v-model="settingsForm.apiKey"
                type="password"
                show-password
                :placeholder="keyPlaceholder"
              />
            </el-form-item>
            <el-form-item label="Model (optional; leave blank to use provider default or fill current model name)">
              <el-input v-model="settingsForm.model" :placeholder="modelPlaceholder" />
              <p class="settings-note">
                Leave this blank if your backend/provider is configured with a default model; otherwise enter the current model name from the provider docs.
              </p>
            </el-form-item>
            <p class="settings-note">
              Your API key stays in browser localStorage until you run analysis, then it is sent to your local or self-hosted backend proxy and forwarded to the selected provider. It is not stored in this project’s database and should not be logged.
            </p>
            <div class="settings-actions">
              <el-button type="primary" size="small" @click="saveSettings">Save</el-button>
              <el-button size="small" @click="showSettings = false">Cancel</el-button>
              <el-button v-if="hasConfig" size="small" type="danger" plain @click="clearSettings">Clear Key</el-button>
            </div>
          </el-form>
        </div>

        <!-- Main analysis panel -->
        <div v-else class="analyze-panel">
          <div class="jd-input-area">
            <label class="jd-label">Paste Job Description (JD)</label>
            <el-input
              v-model="jdText"
              type="textarea"
              :rows="5"
              placeholder="Paste the full job description here..."
              :disabled="loading"
            />
          </div>

          <div class="action-row">
            <el-button
              type="primary"
              :loading="loading"
              :disabled="!hasConfig || !jdText.trim()"
              @click="runAnalysis"
            >
              {{ loading ? 'Analyzing…' : 'Analyze Match' }}
            </el-button>
            <el-button size="small" text @click="showSettings = true">
              <el-icon><Setting /></el-icon> Configure AI
            </el-button>
          </div>

          <div v-if="!hasConfig" class="no-config-hint">
            Click "Configure AI" to set up your API key and enable this feature.
          </div>

          <!-- Results -->
          <transition name="fade">
            <div v-if="result" class="result-area">
              <div class="score-row">
                <div class="score-circle" :class="scoreClass">
                  <span class="score-number">{{ result.score }}</span>
                  <span class="score-label">/ 100</span>
                </div>
                <div class="score-meta">
                  <div class="score-level">{{ scoreLevel }}</div>
                  <div class="score-provider">via {{ result.provider }}</div>
                </div>
              </div>

              <el-progress
                :percentage="result.score"
                :color="progressColor"
                :stroke-width="8"
                :show-text="false"
                class="score-bar"
              />

              <div v-if="result.matched.length" class="keyword-section">
                <div class="kw-title matched-title">✅ Matched Keywords</div>
                <div class="kw-tags">
                  <el-tag
                    v-for="kw in result.matched"
                    :key="kw"
                    type="success"
                    size="small"
                    class="kw-tag"
                  >{{ kw }}</el-tag>
                </div>
              </div>

              <div v-if="result.missing.length" class="keyword-section">
                <div class="kw-title missing-title">⚠️ Missing Keywords</div>
                <div class="kw-tags">
                  <el-tag
                    v-for="kw in result.missing"
                    :key="kw"
                    type="warning"
                    size="small"
                    class="kw-tag"
                  >{{ kw }}</el-tag>
                </div>
              </div>

              <div v-if="result.advice" class="advice-box">
                <span class="advice-icon">💡</span>
                <span>{{ result.advice }}</span>
              </div>
            </div>
          </transition>

          <div v-if="errorMsg" class="error-msg">
            <el-icon><Warning /></el-icon> {{ errorMsg }}
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import { ArrowDown, Setting, Warning } from '@element-plus/icons-vue'
import { getAiConfig, saveAiConfig, clearAiConfig, hasAiConfig, analyzeMatch } from '@/api/aiApi'

const PROVIDER_DEFAULTS = {
  claude: { key: 'sk-ant-…' },
  openai: { key: 'sk-…' },
  deepseek: { key: 'sk-…' },
}

export default {
  name: 'AiAssistant',
  components: { ArrowDown, Setting, Warning },

  props: {
    resume: { type: Object, required: true },
  },

  data() {
    const cfg = getAiConfig()
    return {
      expanded: false,
      showSettings: false,
      settingsForm: {
        providerType: cfg?.providerType || 'claude',
        apiKey: cfg?.apiKey || '',
        model: cfg?.model || '',
      },
      hasConfig: hasAiConfig(),
      jdText: '',
      loading: false,
      result: null,
      errorMsg: '',
    }
  },

  computed: {
    configLabel() {
      const cfg = getAiConfig()
      if (!cfg) return ''
      const labels = { claude: 'Claude', openai: 'OpenAI', deepseek: 'DeepSeek' }
      return labels[cfg.providerType] || cfg.providerType
    },
    keyPlaceholder() {
      return PROVIDER_DEFAULTS[this.settingsForm.providerType]?.key || 'sk-…'
    },
    modelPlaceholder() {
      return 'Enter current model name or leave blank for backend/provider default'
    },
    scoreClass() {
      const s = this.result?.score || 0
      if (s >= 80) return 'score-excellent'
      if (s >= 60) return 'score-good'
      if (s >= 40) return 'score-fair'
      return 'score-poor'
    },
    scoreLevel() {
      const s = this.result?.score || 0
      if (s >= 80) return 'Excellent Match'
      if (s >= 60) return 'Good Match'
      if (s >= 40) return 'Partial Match'
      return 'Poor Match'
    },
    progressColor() {
      const s = this.result?.score || 0
      if (s >= 80) return '#67c23a'
      if (s >= 60) return '#409eff'
      if (s >= 40) return '#e6a23c'
      return '#f56c6c'
    },
  },

  methods: {
    onProviderChange() {
      this.settingsForm.model = ''
    },
    saveSettings() {
      if (!this.settingsForm.apiKey.trim()) {
        this.$message.warning('API key cannot be empty')
        return
      }
      saveAiConfig({
        providerType: this.settingsForm.providerType,
        apiKey: this.settingsForm.apiKey.trim(),
        model: this.settingsForm.model.trim() || null,
      })
      this.hasConfig = true
      this.showSettings = false
      this.$message.success('AI settings saved')
    },
    clearSettings() {
      clearAiConfig()
      this.hasConfig = false
      this.settingsForm.apiKey = ''
      this.result = null
      this.showSettings = false
      this.$message.info('AI settings cleared')
    },
    async runAnalysis() {
      this.errorMsg = ''
      this.result = null
      this.loading = true
      try {
        this.result = await analyzeMatch(this.resume, this.jdText)
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Analysis failed'
        this.errorMsg = msg
        if (msg.toLowerCase().includes('key') || err.response?.status === 401) {
          this.$message.error('API key invalid — please check your settings')
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.ai-assistant {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;
  background: #fff;
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
  user-select: none;
}
.ai-header:hover { background: linear-gradient(135deg, #e8eeff 0%, #f5eeff 100%); }

.ai-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}
.ai-icon { font-size: 16px; }
.provider-tag { font-size: 11px; }

.collapse-icon {
  transition: transform 0.25s;
  color: #6b7280;
}
.collapse-icon.rotated { transform: rotate(180deg); }

.ai-body { padding: 16px; }

/* Settings */
.settings-panel h4 { margin: 0 0 12px; font-size: 14px; color: #374151; }
.settings-note { font-size: 11px; color: #9ca3af; margin: 8px 0; }
.settings-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* Analyze */
.jd-label { font-size: 13px; font-weight: 500; color: #374151; display: block; margin-bottom: 6px; }
.action-row { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
.no-config-hint { font-size: 12px; color: #9ca3af; margin-top: 8px; }

/* Score */
.result-area { margin-top: 16px; }
.score-row { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
.score-circle {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 3px solid currentColor; flex-shrink: 0;
}
.score-number { font-size: 22px; font-weight: 700; line-height: 1; }
.score-label  { font-size: 10px; opacity: 0.7; }
.score-excellent { color: #67c23a; }
.score-good      { color: #409eff; }
.score-fair      { color: #e6a23c; }
.score-poor      { color: #f56c6c; }
.score-level  { font-weight: 600; font-size: 15px; color: #1e293b; }
.score-provider { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.score-bar { margin-bottom: 14px; }

/* Keywords */
.keyword-section { margin-bottom: 10px; }
.kw-title { font-size: 12px; font-weight: 600; margin-bottom: 6px; }
.matched-title { color: #67c23a; }
.missing-title  { color: #e6a23c; }
.kw-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.kw-tag  { cursor: default; }

/* Advice */
.advice-box {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 10px 12px; border-radius: 6px;
  background: #fffbeb; border: 1px solid #fde68a;
  font-size: 13px; color: #92400e; margin-top: 10px;
}
.advice-icon { flex-shrink: 0; font-size: 15px; }

.error-msg {
  display: flex; align-items: center; gap: 6px;
  color: #f56c6c; font-size: 13px; margin-top: 10px;
}

.w-full { width: 100%; }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; padding: 0 16px; }
.slide-enter-to, .slide-leave-from  { opacity: 1; max-height: 800px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
