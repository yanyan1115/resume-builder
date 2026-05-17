import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ResumeEditor from '../views/ResumeEditor.vue';
import ResumePreview from '../views/ResumePreview.vue';
import TemplateSelection from '../views/TemplateSelection.vue';
import ResumeDrafts from '../views/ResumeDrafts.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';

const routes = [

  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/editor',
    name: 'ResumeEditor',
    component: ResumeEditor,
  },
  {
    path: '/drafts',
    name: 'ResumeDrafts',
    component: ResumeDrafts,
  },
  {
    path: '/resumes',
    redirect: '/drafts',
  },
  {
    path: '/preview',
    name: 'ResumePreview',
    component: ResumePreview,
  },
  {
    path: '/templates',
    name: 'TemplateSelection',
    component: TemplateSelection,
  },
  {
    path: '/upload-template',
    name: 'UploadTemplate',
    component: () => import('@/views/UploadTemplate.vue')
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
