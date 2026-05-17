/**
 * ai/base.js — AI Provider 抽象基类
 *
 * 所有 Provider 继承 AIProvider，实现 analyze() 方法。
 * analyze() 接收简历文本 + JD 文本，返回 { score, matched, missing, advice }
 */

class AIProviderError extends Error {
  constructor(message, { provider = '', statusCode = 0, raw } = {}) {
    super(message)
    this.name = 'AIProviderError'
    this.provider = provider
    this.statusCode = statusCode
    this.raw = raw
  }
}

class AIProviderConfigError extends AIProviderError {
  constructor(message, opts) {
    super(message, opts)
    this.name = 'AIProviderConfigError'
  }
}

class AIProvider {
  constructor({ apiKey, model, timeout = 60 }) {
    if (new.target === AIProvider) throw new Error('AIProvider is abstract')
    this.apiKey = apiKey
    this.model = model
    this.timeout = timeout * 1000
  }

  get providerName() { return 'unknown' }

  /**
   * @param {string} resumeText  序列化后的简历纯文本
   * @param {string} jdText      用户粘贴的 JD 文本
   * @returns {Promise<{score:number, matched:string[], missing:string[], advice:string}>}
   */
  async analyze(_resumeText, _jdText) {
    throw new Error('analyze() must be implemented')
  }
}

const SYSTEM_PROMPT = `You are a professional resume consultant and HR expert.
Analyze how well a resume matches a job description (JD).
Always respond in valid JSON format only, with no extra text.`

function buildAnalyzePrompt(resumeText, jdText) {
  return `Here is the candidate's resume:
<resume>
${resumeText}
</resume>

Here is the job description:
<jd>
${jdText}
</jd>

Analyze the match and respond with JSON in this exact format:
{
  "score": <integer 0-100>,
  "matched": [<list of keywords/skills found in both resume and JD, max 10 items>],
  "missing": [<list of important JD keywords/skills NOT found in resume, max 10 items>],
  "advice": "<one concise sentence of the most impactful improvement suggestion>"
}

Scoring guide: 0-40 = poor match, 41-60 = partial match, 61-80 = good match, 81-100 = excellent match.`
}

function parseAnalyzeResponse(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Model did not return valid JSON')
  const result = JSON.parse(jsonMatch[0])
  return {
    score: Math.min(100, Math.max(0, Number(result.score) || 0)),
    matched: Array.isArray(result.matched) ? result.matched.slice(0, 10) : [],
    missing: Array.isArray(result.missing) ? result.missing.slice(0, 10) : [],
    advice: String(result.advice || ''),
  }
}

module.exports = { AIProvider, AIProviderError, AIProviderConfigError, SYSTEM_PROMPT, buildAnalyzePrompt, parseAnalyzeResponse }
