const Resume = require('../models/resumeModel');

const toLegacyFields = (body) => {
    const canonicalResume = body.resume;
    if (!canonicalResume) return body;

    return {
        ...body,
        title: body.title || canonicalResume.title,
        template: body.template || canonicalResume.templateId,
        personalInfo: body.personalInfo || {
            name: canonicalResume.basics?.name || 'Untitled',
            email: canonicalResume.basics?.email || 'not-provided@example.com',
            phone: canonicalResume.basics?.phone || '',
            address: canonicalResume.basics?.location || '',
        },
        experience: body.experience || [],
        education: body.education || [],
    };
};


// 默认每页10条数据，支持分页
const getUserResumes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const resumes = await Resume.find({ user: req.user.id })
                                    .skip(skip)
                                    .limit(limit);
        res.json(resumes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// 获取简历
const getResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id).populate('user', 'name email');  // 填充user信息
        if (!resume) return res.status(404).json({ message: '简历未找到' });
        res.json(resume);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// 创建简历
const createResume = async (req, res) => {
    const { title, template, personalInfo, experience, education, resume: canonicalResume } = toLegacyFields(req.body);
    
    try {
        const resume = new Resume({
            user: req.user.id, // 使用验证后的用户ID
            title,
            template,
            resume: canonicalResume || null,
            personalInfo,
            experience,
            education,
        });
        
        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// 更新简历
const updateResume = async (req, res) => {
    try {
        const updateFields = {};
        const { title, template, personalInfo, experience, education, resume: canonicalResume } = toLegacyFields(req.body);
        if (title) updateFields.title = title;
        if (template) updateFields.template = template;
        if (canonicalResume) updateFields.resume = canonicalResume;
        if (personalInfo) updateFields.personalInfo = personalInfo;
        if (experience) updateFields.experience = experience;
        if (education) updateFields.education = education;

        const updated = await Resume.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updated) return res.status(404).json({ message: '简历未找到' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// 删除简历
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findByIdAndDelete(req.params.id);
        if (!resume) return res.status(404).json({ message: '简历未找到' });
        res.json({ message: '简历删除成功' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




module.exports = {
    getUserResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume
};
