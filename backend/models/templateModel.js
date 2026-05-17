// models/templateModel.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 样式系统名，如 theme-light
  previewImage: { type: String, required: true }, // 预览图 URL
  style: { type: String }, // 用于风格筛选，如 "Simple Design 💫"
  backgroundColor: { type: String }, // 用于颜色筛选，如 "Light"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);
