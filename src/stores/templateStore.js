//弃用
import { defineStore } from 'pinia';
import apiClient from '@/api/client';

export const useTemplateStore = defineStore('template', {
  state: () => ({
    templates: [],       // 存储模板
    resumeData: {        // 存储简历数据
      name: '',
      gender: '',
      age: 22,
      birthYear: 2002,
      birthMonth: 1,
      jobStatus: '',
      emailPrefix: '',
      emailSuffix: '@qq.com',
      advantage: '',
      projects: '',
      certificates: '',
      honors: '',
      organizations: '',
      industry: '',
      job: '',
      skills: '',
      province: '',
      city: '',
      salary: [5000, 15000],
      experience: '',
      education: '',
      template: '' // 用来绑定模板样式
    },
    selectedTemplate: null, // 选中的模板
  }),
  getters: {
    // 获取简历数据
    getResumeData(state) {
      return state.resumeData;
    },
    // 获取选中的模板
    getSelectedTemplate(state) {
      return state.selectedTemplate;
    }
  },
  actions: {
    // 设置简历数据
    setResumeData(data) {
      this.resumeData = { ...this.resumeData, ...data };
    },
    // 设置选中的模板
    setSelectedTemplate(template) {
      this.selectedTemplate = template;
    },
    // 异步获取模板列表
    async fetchTemplates() {
      try {
        const res = await apiClient.get('/templates');
        this.templates = res.data;
      } catch (err) {
        console.error('获取模板列表失败：', err);
      }
    },
    // 添加模板
    addTemplate(template) {
      this.templates.push(template);
    }
  }
});
