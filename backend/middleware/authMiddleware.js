const jwt = require('jsonwebtoken');  // 引入jsonwebtoken库
const User = require('../models/userModel');  // 引入用户模型

// 认证中间件
const auth = async (req, res, next) => {
  // 从请求头中获取 Authorization 字段的 token
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  // 如果没有提供 token
  if (!token) {
    return res.status(401).json({ message: '没有提供认证令牌' });
  }

  try {
    // 使用 jwt.verify() 方法验证 token 是否有效
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // 解密并验证 token

    // 通过解密后的用户ID查找用户信息
    const user = await User.findById(decoded.id).select('-password');  // 不返回密码字段

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 将用户信息附加到请求对象上，供后续使用
    req.user = user;

    // 调用 next() 继续请求处理
    next();
  } catch (error) {
    // 如果验证失败，返回 401 错误
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};

module.exports = { auth };

