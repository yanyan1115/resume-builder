<template>
  <div class="page-container">
    <div ref="vantaRef" class="vanta-background"></div>
    <div class="glass-card">
      <h2 class="card-title">Welcome back</h2>
      <p class="card-subtitle">Sign in to sync your drafts across devices.</p>
      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" id="email" placeholder="you@example.com" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" placeholder="••••••••" required />
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" :disabled="loading" class="btn-primary">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
      <p class="alt-link">Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/api/client'
import * as THREE from 'three'
import WAVES from 'vanta/dist/vanta.waves.min'

export default {
  name: 'LoginPage',
  data() {
    return { email: '', password: '', loading: false, errorMessage: '' }
  },
  mounted() {
    this.vantaEffect = WAVES({
      el: this.$refs.vantaRef,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x1e3a5f,
      shininess: 60.0,
      waveHeight: 14.0,
      waveSpeed: 0.85,
      zoom: 0.88,
    })
  },
  beforeUnmount() {
    if (this.vantaEffect) this.vantaEffect.destroy()
  },
  methods: {
    async loginUser() {
      this.loading = true
      this.errorMessage = ''
      try {
        const response = await apiClient.post('/users/login', {
          email: this.email,
          password: this.password,
        })
        localStorage.setItem('token', response.data.token)
        this.$router.push('/')
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  background: #0d1b2a;
}

.vanta-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.glass-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 48px 44px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  width: 100%;
  max-width: 420px;
  animation: fadeUp 0.7s ease both;
}

.card-title {
  font-family: system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
}

.card-subtitle {
  font-family: system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 28px;
}

.form-group {
  margin-bottom: 18px;
  text-align: left;
}

label {
  display: block;
  font-family: system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif;
  font-size: 0.83rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 11px 13px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 14px;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  box-sizing: border-box;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.13);
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  margin-top: 8px;
  background: #1e3a5f;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(30, 58, 95, 0.5);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #25487a;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(30, 58, 95, 0.6);
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

.error-message {
  color: #fca5a5;
  font-size: 0.85rem;
  margin: 0 0 12px;
  text-align: left;
}

.alt-link {
  font-family: system-ui, -apple-system, 'Segoe UI', Helvetica, sans-serif;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  margin-top: 20px;
}

.alt-link a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
}

.alt-link a:hover {
  text-decoration: underline;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
