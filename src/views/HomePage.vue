<template>
  <div class="home-container">
    <div class="box">
      <div ref="vantaRef" class="vanta-background"></div> <!-- 动态背景 -->
      <div class="card">
        <h1 class="title">
          Welcome to Resume Builder
        </h1>
        <div class="button-group">
          <router-link to="/editor" class="btn">
            Start Editing Resume
          </router-link>
          <router-link to="/templates" class="btn secondary">
            Choose Template
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 确保从 vanta 模块导入
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";  // 只导入 WAVES

export default {
  name: 'HomePage',
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
};
</script>

<style scoped>
/* 引入花体备用字体 */
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');

/* 全局基础字体 */
.home-container, .card, h1, .btn {
  font-family: "Microsoft JhengHei Light", system-ui, PingFang SC, Helvetica, sans-serif;
}

.home-container {
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

/* 卡片 */
.card {
  background: linear-gradient(135deg, #f3f8fe, #007dd0); /* 渐变色背景 */
  padding: 49px 36px;
  border-radius: 25px; 
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* 加强阴影，提升立体感 */
  text-align: center;
  width: 100%;
  max-width: 420px;
  animation: fadeIn 1s ease;
  position: relative;
  z-index: 1; /* 确保卡片在动态背景之上 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 平滑的悬浮动画 */
}

.card:hover {
  transform: translateY(-5px); /* 向上浮动 */
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); /* 更强烈的阴影效果 */
}
/* 标题 */
.title {
  font-size: 35px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-family: "Times New Roman", Times, serif;
}

/* 按钮组 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.btn {
  display: block;
  text-align: center;
  background: linear-gradient(90deg, #69b7a8, #8fd3c9);
  color: #fff;
  padding: 14px 22px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 17px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(105, 183, 168, 0.3);
  transition: all 0.3s ease;
  transform: translateZ(0); /* 优化渲染性能 */
  font-family: "Times New Roman", Times, serif;
}

.btn:hover {
  background: linear-gradient(90deg, #7dbfa8, #9ad3c9); /* 按钮悬浮时的颜色变化 */
  transform: translateY(-4px); /* 更平滑的动画效果 */
  box-shadow: 0 6px 18px rgba(105, 183, 168, 0.4);
}

.btn.secondary {
  background: linear-gradient(90deg, #7c8ff4, #a3b6fd);
  box-shadow: 0 4px 12px rgba(124, 143, 244, 0.3);
}

.btn.secondary:hover {
  background: linear-gradient(90deg, #8a97f5, #c0c7ff); /* 按钮悬浮时的颜色变化 */
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(124, 143, 244, 0.4);
}

@media (min-width: 600px) {
  .button-group {
    flex-direction: row;
    justify-content: center;
  }
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