const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 生成 JWT 令牌
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 用户注册
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 检查用户是否已存在
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: '用户已存在' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        // 返回成功的注册信息和JWT
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: '注册失败' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};

// 用户登录
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 检查用户是否存在
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: '邮箱或密码错误' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};

module.exports = { registerUser, loginUser };
