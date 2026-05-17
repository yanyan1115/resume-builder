<template>
    <div class="login-container">
      <div class="vanta-background" ref="vantaRef"></div> <!-- 动态背景 -->
      <div class="login-card">
        <h2>Login</h2>
        <form @submit.prevent="loginUser">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" v-model="email" id="email" placeholder="Please enter your email..." required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" placeholder="Please enter your password..." required />
          </div>
          <button type="submit" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span> Login
          </button>
        </form>
        <p class="register-link">Don't have an account? → <router-link to="/register">Register now</router-link></p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
import apiClient from '@/api/client';
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min"; // 只导入 WAVES

export default {
  name: 'LoginPage',
  data() {
    return {
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
  beforeUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  },
  methods: {
    async loginUser() {
      this.loading = true;
      try {
        const response = await apiClient.post('/users/login', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/');
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
  /* 背景渐变和页面居中 */
  .login-container {
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
    z-index: 0;
  }
  
  /* 登录卡片 */
  .login-card {
    background: #ffffff;
    padding: 48px 36px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    text-align: center;
    width: 100%;
    max-width: 420px;
    animation: fadeIn 1s ease;
    position: relative;
    z-index: 1;
  }
  
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
  
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  
