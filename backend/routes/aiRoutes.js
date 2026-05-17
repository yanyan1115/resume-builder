const express = require('express')
const router = express.Router()
const { analyzeMatch } = require('../controllers/aiController')

router.post('/analyze', analyzeMatch)

module.exports = router
