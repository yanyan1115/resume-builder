// routes/templateRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const templateController = require('../controllers/templateController');

// 路由与控制器绑定
// 获取所有模板
router.get('/', templateController.getAllTemplates);

// 获取单个模板
router.get('/:id', templateController.getTemplateById);

// 创建新模板（仅上传主题名称 + 预览图）
router.post('/', upload.single('previewImage'), templateController.createTemplate);

// 删除模板
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
