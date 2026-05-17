<template>
    <div class="register-page-container">
      <div class="vanta-background" ref="vantaRef"></div> <!-- 动态背景 -->
      <div class="register-card">
        <h2>Register</h2>
        <form @submit.prevent="registerUser">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" v-model="name" id="name" placeholder="Please enter your name..." required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" v-model="email" id="email" placeholder="Please enter your email..." required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" placeholder="Please enter your password..." required />
          </div>
          <button type="submit" :disabled="loading">Register</button>
        </form>
        <p>Already have an account? → <router-link to="/login">Login</router-link></p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/api/client';
  import * as THREE from "three";
  import WAVES from "vanta/dist/vanta.waves.min";  // 只导入 WAVES
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        name: '',
        email: '',
        password: '',
        loading: false,
        errorMessage: ''
      };
    },
    mounted() {
      this.vantaEffect = WAVES({
        el: this.$refs.vantaRef,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x5f88,
        shininess: 76.0,
        waveHeight: 12.0,
        waveSpeed: 0.95,
        zoom: 0.89,
      });
    },
    beforeUnmount() {  // 使用 beforeUnmount 替代 beforeDestroy
      if (this.vantaEffect) {
        this.vantaEffect.destroy();
      }
    },
    methods: {
      async registerUser() {
        this.loading = true;
        try {
          const response = await apiClient.post('/users/register', {
            name: this.name,
            email: this.email,
            password: this.password
          });
          // 注册成功后存储 token 并跳转到登录页面
          localStorage.setItem('token', response.data.token);
          this.$router.push('/login');  // 跳转到登录页面
        } catch (error) {
          this.errorMessage = error.response.data.message;
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* 全局基础字体 */
  .register-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #fdfcfb, #e2ebf0);
    padding: 20px;
    overflow: hidden;
    position: relative;
  }
  
  /* 动态背景 */
  .vanta-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; /* 让背景在最下层 */
  }
  
  /* 注册卡片 */
  .register-card {
    background: #ffffff;
    padding: 48px 36px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    text-align: center;
    width: 100%;
    max-width: 420px;
    animation: fadeIn 1s ease;
    position: relative;
    z-index: 1; /* 确保卡片在动态背景之上 */
  }
  
  /* 标题 */
  h2 {
    font-size: 34px;
    color: #444;
    font-weight: 600;
    margin-bottom: 10px;
    letter-spacing: 1px;
    font-family: "Microsoft JhengHei Light", sans-serif;
  }
  
  /* 输入框样式 */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  input {
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  input:focus {
    border-color: #4CAF50;
    outline: none;
    background-color: #f1f8e9;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: red;
    margin-top: 1rem;
    font-size: 14px;
  }
  
  .register-link {
    text-align: center;
    margin-top: 1rem;
  }
  
  .register-link a {
    color: #4CAF50;
    text-decoration: none;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  
  /* 入场动画 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
