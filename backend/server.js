// server.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // 引入用户路由
const resumeRoutes = require('./routes/resumeRoutes'); // 引入简历路由
const templateRoutes = require('./routes/templateRoutes');

dotenv.config();  // 加载 .env 配置

// 自动创建 uploads/templates 目录
const uploadDir = path.join(__dirname, 'uploads/templates');
fs.mkdirSync(uploadDir, { recursive: true });

// 连接 MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1); // 如果连接失败，退出进程
    }
};

connectDB();

// 中间件
app.use(express.json());  // 解析 JSON 请求
app.use(cors());  // 允许跨域访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 允许 Express 静态访问上传文件夹

// 测试 API
app.get('/', (req, res) => {
    res.send('后端服务器运行正常！🎉');
});

// 用户 API 路由
app.use('/api/users', userRoutes);  // 用户相关 API 路由

// 保护简历路由：只有登录用户能访问
app.use('/api/resumes', resumeRoutes);  // 简历相关 API 路由

// 模版 API 路由
app.use('/api/templates', templateRoutes);// 模版相关 API 路由

// 服务器监听端口
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
