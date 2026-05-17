const express = require('express'); 
const router = express.Router(); // 正确创建 router 对象

const resumeController = require('../controllers/resumeController');
const pdfController = require('../controllers/pdfController');
const { auth } = require('../middleware/authMiddleware');


// 获取用户的所有简历，使用 auth 中间件进行保护，并支持分页
router.get('/', auth, resumeController.getUserResumes);

// 创建简历，使用 auth 中间件进行保护，并进行简单的输入验证
router.post('/', auth, async (req, res) => {
    const { title, template, resume } = req.body;
    const resolvedTitle = title || resume?.title;
    const resolvedTemplate = template || resume?.templateId;
    // 验证必填字段
    if (!resolvedTitle || !resolvedTemplate) {
        return res.status(400).json({ message: '标题和模板是必需的' });
    }
    try {
        await resumeController.createResume(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// 获取单个简历，使用 auth 中间件进行保护
router.get('/:id', auth, resumeController.getResume);


// 更新简历，使用 auth 中间件进行保护，并进行数据验证
router.put('/:id', auth, async (req, res) => {

    // 验证必填字段
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "请求体不能为空" });
      }

    // 调用控制器更新简历
    try {
        await resumeController.updateResume(req, res);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 删除简历，使用 auth 中间件进行保护
router.delete('/:id', auth, resumeController.deleteResume);

// POST 请求生成简历PDF
router.post('/generate-pdf', pdfController.createResumePDF);

module.exports = router;
