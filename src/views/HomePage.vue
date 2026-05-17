<template>
  <div class="home-container">
    <div ref="vantaRef" class="vanta-background"></div>
    <div class="card">
      <h1 class="title">Resume Builder</h1>
      <p class="subtitle">Create a professional resume in minutes — pick a template, fill in your details, export to PDF.</p>
      <div class="button-group">
        <router-link to="/editor" class="btn primary">Start Editing</router-link>
        <router-link to="/templates" class="btn secondary">Choose Template</router-link>
        <router-link to="/drafts" class="btn ghost">My Drafts</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";

export default {
  name: 'HomePage',
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
    });
  },
  beforeUnmount() {
    if (this.vantaEffect) this.vantaEffect.destroy();
  },
};
</script>

<style scoped>
.home-container {
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

.card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 52px 44px 44px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  text-align: center;
  width: 100%;
  max-width: 440px;
  animation: fadeUp 0.7s ease both;
}

.title {
  font-family: system-ui, -apple-system, "Segoe UI", Helvetica, sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px;
  letter-spacing: 0.5px;
}

.subtitle {
  font-family: system-ui, -apple-system, "Segoe UI", Helvetica, sans-serif;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
  margin: 0 0 32px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  display: block;
  text-align: center;
  padding: 13px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-family: system-ui, -apple-system, "Segoe UI", Helvetica, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn.primary {
  background: #1e3a5f;
  color: #fff;
  box-shadow: 0 4px 14px rgba(30, 58, 95, 0.5);
}

.btn.primary:hover {
  background: #25487a;
  box-shadow: 0 6px 18px rgba(30, 58, 95, 0.6);
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.22);
}

.btn.ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.88rem;
  padding: 8px 20px;
}

.btn.ghost:hover {
  color: rgba(255, 255, 255, 0.9);
  transform: none;
}

@media (min-width: 600px) {
  .button-group {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 130px;
  }

  .btn.ghost {
    flex: 0 0 100%;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
