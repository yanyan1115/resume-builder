const Anthropic = require('@anthropic-ai/sdk')
const { AIProvider, AIProviderError, AIProviderConfigError, SYSTEM_PROMPT, buildAnalyzePrompt, parseAnalyzeResponse } = require('./base')

class ClaudeProvider extends AIProvider {
  constructor(config) {
    super(config)
    if (!config.apiKey) throw new AIProviderConfigError('Anthropic API key is required', { provider: 'claude' })
    this._model = config.model || process.env.ANTHROPIC_MODEL
    if (!this._model) {
      throw new AIProviderConfigError('Claude model is required. Fill the Model field or set ANTHROPIC_MODEL on the backend.', { provider: 'claude' })
    }
    this._client = new Anthropic.Anthropic({ apiKey: config.apiKey })
  }

  get providerName() { return `Claude (${this._model})` }

  async analyze(resumeText, jdText) {
    try {
      const msg = await this._client.messages.create({
        model: this._model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildAnalyzePrompt(resumeText, jdText) }],
      })
      return parseAnalyzeResponse(msg.content[0].text)
    } catch (err) {
      if (err.name === 'AIProviderConfigError') throw err
      if (err.status === 401) throw new AIProviderConfigError('Anthropic API key is invalid or expired', { provider: 'claude', raw: err })
      if (err.status === 429) throw new AIProviderError('Anthropic rate limit exceeded, please try again later', { provider: 'claude', statusCode: 429, raw: err })
      throw new AIProviderError(`Claude API error: ${err.message}`, { provider: 'claude', statusCode: err.status, raw: err })
    }
  }
}

module.exports = ClaudeProvider
