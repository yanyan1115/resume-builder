const express = require('express')
const router = express.Router()
const { analyzeMatch } = require('../controllers/aiController')

const RATE_LIMIT_WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60 * 1000)
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS || 10)
const rateLimitBuckets = new Map()

function getClientKey(req) {
  return req.ip || req.headers['x-forwarded-for'] || 'unknown'
}

function aiAnalyzeRateLimit(req, res, next) {
  const now = Date.now()
  const key = getClientKey(req)
  const bucket = rateLimitBuckets.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }

  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS
  }

  bucket.count += 1
  rateLimitBuckets.set(key, bucket)

  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many AI analysis requests. Please try again later.' })
  }

  return next()
}

router.post('/analyze', express.json({ limit: process.env.AI_ANALYZE_BODY_LIMIT || '64kb' }), aiAnalyzeRateLimit, analyzeMatch)

module.exports = router
