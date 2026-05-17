const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB 连接失败: ${error.message}`);
        process.exit(1); // 退出进程
    }
};

module.exports = connectDB;
