<template>
  <div id="app">
    <nav class="app-nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">Resume Builder</router-link>

        <button class="nav-burger" :aria-expanded="menuOpen" @click="toggleMenu">
          <span class="burger-bar" />
          <span class="burger-bar" />
          <span class="burger-bar" />
        </button>

        <div class="nav-links" :class="{ open: menuOpen }">
          <router-link to="/" exact>Home</router-link>
          <router-link to="/drafts">Drafts</router-link>
          <router-link to="/editor">Editor</router-link>
          <router-link to="/preview">Preview</router-link>
          <router-link to="/templates">Templates</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </div>
      </div>
    </nav>

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { useResumeStore } from '@/stores/resumeStore'

export default {
  name: 'App',
  data() {
    return {
      menuOpen: false
    }
  },
  mounted() {
    const store = useResumeStore()
    store.loadFromBackend()
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f5f7fa;
}

/* ── Nav ── */
.app-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-logo {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  text-decoration: none;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.nav-links a {
  padding: 6px 10px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav-links a:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-links a.router-link-active,
.nav-links a.router-link-exact-active {
  background: #eff6ff;
  color: #1d4ed8;
}

/* ── Burger (mobile) ── */
.nav-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
}

.burger-bar {
  display: block;
  height: 2px;
  background: #374151;
  border-radius: 1px;
  transition: opacity 0.15s;
}

/* ── Page transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .nav-burger {
    display: flex;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    padding: 8px 16px 12px;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    padding: 10px 12px;
  }
}

@media print {
  .app-nav {
    display: none;
  }
}
</style>
