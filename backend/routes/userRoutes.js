// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware'); // 引入 authMiddleware


// 用户注册路由
router.post('/register', registerUser);

// 用户登录路由
router.post('/login', loginUser);

// 获取用户个人资料路由，使用 auth 中间件进行保护
router.get('/profile', auth, (req, res) => {
  try {
    const user = req.user;  // req.user 是由 auth 中间件附加的用户信息
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
