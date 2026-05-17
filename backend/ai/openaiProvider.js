const OpenAI = require('openai')
const { AIProvider, AIProviderError, AIProviderConfigError, SYSTEM_PROMPT, buildAnalyzePrompt, parseAnalyzeResponse } = require('./base')

// Preset configs for known OpenAI-compatible providers
const PROVIDER_PRESETS = {
  openai: { baseURL: undefined, defaultModelEnv: 'OPENAI_MODEL' },
  deepseek: { baseURL: 'https://api.deepseek.com/v1', defaultModelEnv: 'DEEPSEEK_MODEL' },
}

class OpenAICompatProvider extends AIProvider {
  constructor(config) {
    super(config)
    if (!config.apiKey) throw new AIProviderConfigError(`${config.providerType} API key is required`, { provider: config.providerType })
    const preset = PROVIDER_PRESETS[config.providerType] || PROVIDER_PRESETS.openai
    this._model = config.model || process.env[preset.defaultModelEnv]
    if (!this._model) {
      throw new AIProviderConfigError(`${config.providerType} model is required. Fill the Model field or set ${preset.defaultModelEnv} on the backend.`, { provider: config.providerType })
    }
    this._providerType = config.providerType || 'openai'
    this._client = new OpenAI({ apiKey: config.apiKey, baseURL: preset.baseURL })
  }

  get providerName() { return `${this._providerType} (${this._model})` }

  async analyze(resumeText, jdText) {
    try {
      const completion = await this._client.chat.completions.create({
        model: this._model,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildAnalyzePrompt(resumeText, jdText) },
        ],
      })
      return parseAnalyzeResponse(completion.choices[0].message.content)
    } catch (err) {
      if (err.name === 'AIProviderConfigError') throw err
      if (err.status === 401) throw new AIProviderConfigError(`${this._providerType} API key is invalid`, { provider: this._providerType, raw: err })
      if (err.status === 429) throw new AIProviderError(`${this._providerType} rate limit exceeded`, { provider: this._providerType, statusCode: 429, raw: err })
      throw new AIProviderError(`${this._providerType} API error: ${err.message}`, { provider: this._providerType, statusCode: err.status, raw: err })
    }
  }
}

module.exports = OpenAICompatProvider
