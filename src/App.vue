<template>
  <div id="app">
    <!-- Loading 动画 -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">Loading🧾…</p>
    </div>

    <!-- 小装饰泡泡背景 -->
    <div class="floating-bubbles"></div>

    <!-- 主导航栏 -->
    <nav>
      <div class="nav-header">
        <span class="logo">
          <span class="logo-icon">📄</span> Resume Builder
        </span>
        <button class="burger" @click="toggleMenu">
          ☰
        </button>
      </div>
      <div class="nav-links" :class="{ open: menuOpen }">
        <router-link to="/"><span>🏠</span> Home</router-link>
        <router-link to="/login"><span>🔑</span> Login</router-link>
        <router-link to="/register"><span>📝</span> Register</router-link>
        <router-link to="/drafts"><span>📚</span> Drafts</router-link>
        <router-link to="/editor"><span>📝</span> Resume Editing</router-link>
        <router-link to="/preview"><span>👀</span> Resume Preview</router-link>
        <router-link to="/templates"><span>🎨</span> Choose Template</router-link>
      </div>
    </nav>

    <!-- 页面切换动画 -->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menuOpen: false,
      loading: true, // 初始加载状态
    };
  },
  mounted() {
    // 模拟加载 1.5 秒后消失
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
};
</script>



<style scoped>
/* 通用字体设置 */
* {
  box-sizing: border-box;
  font-family: 'Microsoft JhengHei Light', sans-serif;
}

/* 导航栏整体样式 */
nav {
  background-color: #fffafc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px 20px;
  border-radius: 16px;
  margin: 12px auto;
  max-width: 100%;
}

/* 顶部logo和汉堡按钮 */
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


/* logo样式，图标+文字+动画 */
.logo {
  font-size: 20px;
  font-weight: bold;
  color: #5c7dd6;
  display: flex;
  align-items: center;
  gap: 6px;
  animation: logoPop 0.6s ease-out;
  user-select: none;
}

.logo-icon {
  font-size: 24px;
  transform: translateY(-1px);
}

/* logo进入时的动画 */
@keyframes logoPop {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  60% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 汉堡按钮 */
.burger {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #466edc;
  display: none;
}

/* 链接列表（默认横向） */
.nav-links {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  flex-wrap: wrap;
}

router-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  color: #5e5e5e;
  transition: all 0.3s ease;
  background-color: #fdf0f5;
  font-weight: 500;
}

router-link:hover {
  background-color: #f7dbe6;
  color: #d65c8a;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(214, 92, 138, 0.15);
}

.router-link-exact-active {
  background-color: #ffeaf1;
  color: #c74279;
  font-weight: bold;
}



/* 响应式样式 - 手机端适配 */
@media (max-width: 768px) {
  .burger {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
  }

  .nav-links.open {
    display: flex;
  }

  router-link {
    font-size: 17px;
    padding: 10px 14px;
  }


  /* 背景装饰：小泡泡效果 */
.floating-bubbles::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(255, 192, 203, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: -1;
  animation: float 15s linear infinite;
  opacity: 0.5;
}

@keyframes float {
  0% { background-position: 0 0; }
  100% { background-position: 100px 100px; }
}


/* 页面切换动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


/* Loading 动画 */
.loading-container {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fffafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #f7dbe6;
  border-top: 5px solid #d65c8a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #d65c8a;
  font-weight: 500;
  font-family: 'Microsoft JhengHei Light', sans-serif;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

}
</style>
