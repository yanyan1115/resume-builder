const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 用户ID
    title: { type: String, required: true }, // 简历标题
    template: { type: String, required: true }, // 模板选择
    resume: { type: mongoose.Schema.Types.Mixed, default: null }, // canonical resume schema payload
    personalInfo: {
        name: { type: String, required: true }, // 姓名
        email: { type: String, required: true }, // 邮箱
        phone: { type: String, required: false }, // 电话
        address: { type: String, required: false }, // 地址
    },
    experience: [
        {
            jobTitle: { type: String, default: '' },
            company: { type: String, default: '' },
            duration: { type: String, default: '' },
            description: { type: String, default: '' },
        },
    ], // 工作经历
    education: [
        {
            degree: { type: String, default: '' },
            institution: { type: String, default: '' },
            graduationYear: { type: String, default: '' },
        },
    ], // 教育经历
    
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
