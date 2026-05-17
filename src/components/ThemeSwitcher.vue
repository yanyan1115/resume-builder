<template>
  <el-select v-model="selectedTheme" @change="changeTheme">
    <el-option label="浅色主题" value="theme-light"></el-option>
    <el-option label="深色主题" value="theme-dark"></el-option>
    <el-option label="蓝色主题" value="theme-blue"></el-option>
    <el-option label="紫色主题" value="theme-purple"></el-option>
  </el-select>
</template>


<script>
export default {
  props: {
    initialTheme: {
      type: String,
      default: 'theme-light' //默认主题
    }
  },
  data() {
    return {
      selectedTheme: this.initialTheme || 'theme-light', // 默认主题或从父组件传入的主题
    };
  },
  mounted() {
    // 确保初始主题被设置
    this.changeTheme(this.selectedTheme);
  },
  methods: {
    changeTheme(theme) {
      this.$emit('change-theme', theme);
    },
  },
};
</script>