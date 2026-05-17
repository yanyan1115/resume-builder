// controllers/templateController.js
const Template = require('../models/templateModel');

const getPublicBaseUrl = (req) => {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
};

// 获取所有模板
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();

    const fullTemplates = templates.map(template => {
      const templateObj = template.toObject(); // 转成普通对象以便修改属性
      if (templateObj.previewImage) {
        templateObj.previewImage = `${getPublicBaseUrl(req)}${templateObj.previewImage}`;
      }
      return templateObj;
    });

    res.json(fullTemplates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 获取单个模板
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建新模板
exports.createTemplate = async (req, res) => {
  try {
    const { name, style, backgroundColor } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ message: '主题名称和预览图不能为空' });
    }
    
    const previewImage = `/uploads/templates/${req.file.filename}`;
    const newTemplate = new Template({ name, previewImage, style, backgroundColor });

    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: '服务器出错' });
  }
};

// 删除模板
exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Template not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
