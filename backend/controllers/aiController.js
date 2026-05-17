const { createProvider } = require('../ai/factory')
const { AIProviderConfigError } = require('../ai/base')

/**
 * POST /api/ai/analyze
 * Body: { providerType, apiKey, model?, resumeText, jdText }
 *
 * Key is sent from the client's localStorage — never stored on the server.
 */
async function analyzeMatch(req, res) {
  const { providerType, apiKey, model, resumeText, jdText } = req.body

  if (!providerType || !apiKey) {
    return res.status(400).json({ error: 'providerType and apiKey are required' })
  }
  if (!resumeText || !jdText) {
    return res.status(400).json({ error: 'resumeText and jdText are required' })
  }
  if (jdText.trim().length < 20) {
    return res.status(400).json({ error: 'Job description is too short (minimum 20 characters)' })
  }

  try {
    const provider = createProvider({ providerType, apiKey, model })
    const result = await provider.analyze(resumeText, jdText)
    return res.json({ provider: provider.providerName, ...result })
  } catch (err) {
    if (err.name === 'AIProviderConfigError') {
      return res.status(401).json({ error: err.message })
    }
    if (err.statusCode === 429) {
      return res.status(429).json({ error: err.message })
    }
    console.error('[AI analyze error]', err.message)
    return res.status(500).json({ error: err.message || 'AI analysis failed' })
  }
}

module.exports = { analyzeMatch }
