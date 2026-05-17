<!-- src/views/UploadTemplate.vue -->
<template>
  <div class="upload-template-container max-w-xl mx-auto p-6 bg-white shadow-md rounded">
    <h2 class="text-2xl font-bold mb-4">Upload New Template</h2>

    <el-form :model="form">
      <el-form-item label="Choose Style Theme" required>
        <el-select v-model="form.name" placeholder="Please Select a Style Theme">
          <el-option label="Light" value="theme-light" />
          <el-option label="Dark" value="theme-dark" />
          <el-option label="Blue" value="theme-blue" />
          <el-option label="Purple" value="theme-purple" />
          <el-option label="Pink" value="theme-pink" />
          <el-option label="Red" value="theme-red" />
        </el-select>
    </el-form-item>

      <el-form-item label="Style Category" required>
        <el-select v-model="form.style" placeholder="Choose Style Category">
          <el-option label="Simple Design 💫" value="Simple Design 💫" />
          <el-option label="High-End and Elegant 👑" value="High-End and Elegant 👑" />
          <el-option label="Lively and Fun 🎉" value="Lively and Fun 🎉" />
          <el-option label="Steady and Low-Key 🌙" value="Steady and Low-Key 🌙" />
        </el-select>
    </el-form-item>

    <el-form-item label="Background Color" required>
      <el-select v-model="form.backgroundColor" placeholder="Choose Background Color">
        <el-option label="Light" value="浅色" />
        <el-option label="Dark" value="深色" />
        <el-option label="Blue" value="蓝色" />
        <el-option label="Purple" value="紫色" />
        <el-option label="Pink" value="粉色" />
        <el-option label="Red" value="红色" />
      </el-select>
    </el-form-item>

    <el-form-item label="Preview Image Upload" required>
        <input type="file" @change="handleImageUpload" accept="image/*" />
        <img v-if="form.previewImage" :src="form.previewImage" class="w-40 mt-2 rounded" />
    </el-form-item>

      <el-button type="primary" @click="submitTemplate">Submit Template</el-button>
    </el-form>
  </div>
</template>

<script>
import apiClient from '@/api/client';

export default {
  name: 'UploadTemplate',
  data() {
    return {
      form: {
        name: '',           // 主题名称，和后端模型name对应
        previewImage: '',   // 本地图片预览URL
        style: '',
        backgroundColor: ''
      },
      imageFile: null,       // 上传的图片文件对象
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.form.previewImage = URL.createObjectURL(file);
      }
    },
    async submitTemplate() {
      if (!this.form.name) {
        this.$message.error('Please Select a Style Theme');
        return;
      }
      if (!this.imageFile) {
        this.$message.error('Choose File');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('previewImage', this.imageFile);
        formData.append('name', this.form.name);
        formData.append('style', this.form.style);
        formData.append('backgroundColor', this.form.backgroundColor);


        await apiClient.post('/templates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.$message.success('The template was uploaded successfully.');
        this.$router.push('/templates');  // 跳转到模版选择页面
      } catch (error) {
        console.error(error);
        this.$message.error('The template upload failed. Please try again.');
      }
    }
  }
};
</script>



<style scoped>
.upload-template-container {
  margin-top: 40px;
}

/* 输入框样式 */
input, textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, textarea:focus {
  border-color: #3b82f6; /* 蓝色边框 */
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3); /* 蓝色阴影 */
}

/* 按钮样式 */
button {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #2563eb; /* 按钮悬浮时的颜色 */
  transform: scale(1.05); /* 鼠标悬浮时微微放大 */
}

button:active {
  transform: scale(1); /* 按钮点击时恢复原状 */
}

/* 预览图片样式 */
.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 图片预览容器 */
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.preview-container p {
  font-size: 1rem;
  color: #4b5563; /* 文字颜色 */
  font-weight: 500;
  margin-bottom: 8px;
}

/* 表单标题样式 */
h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1f2937; /* 主标题颜色 */
}

/* 返回按钮样式 */
button.text-blue-600 {
  font-size: 1rem;
  color: #3b82f6;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

button.text-blue-600:hover {
  color: #2563eb;
}

/* 页面整体容器 */
div.max-w-xl {
  background-color: #f9fafb; /* 淡灰背景 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 24px;
}

/* 表单标签 */
label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  color: #4b5563;
}

/* 输入框与 textarea 的间距 */
input, textarea {
  margin-bottom: 16px;
}

/* 调整页面的整体间距 */
form {
  display: flex;
  flex-direction: column;
}

/* 居中内容 */
form .flex {
  display: flex;
  justify-content: center;
}

</style>

