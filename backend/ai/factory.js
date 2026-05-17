const ClaudeProvider = require('./claudeProvider')
const OpenAICompatProvider = require('./openaiProvider')
const { AIProviderConfigError } = require('./base')

/**
 * @param {{ providerType: string, apiKey: string, model?: string }} config
 * @returns {import('./base').AIProvider}
 */
function createProvider(config) {
  const { providerType } = config
  switch (providerType) {
    case 'claude':
      return new ClaudeProvider(config)
    case 'openai':
    case 'deepseek':
      return new OpenAICompatProvider(config)
    default:
      throw new AIProviderConfigError(`Unknown provider type: "${providerType}"`, { provider: providerType })
  }
}

module.exports = { createProvider }
