import apiClient from './client'

export const resumeApi = {
  // 拉取当前用户所有草稿（分页可选）
  list(page = 1, limit = 50) {
    return apiClient.get('/resumes', { params: { page, limit } })
  },

  // 获取单条草稿
  get(id) {
    return apiClient.get(`/resumes/${id}`)
  },

  // 创建新草稿（传完整 canonical resume 对象）
  create(resumeData) {
    return apiClient.post('/resumes', {
      resume: resumeData,
      title: resumeData.title,
      template: resumeData.templateId,
    })
  },

  // 更新草稿（传完整 canonical resume 对象）
  update(backendId, resumeData) {
    return apiClient.put(`/resumes/${backendId}`, {
      resume: resumeData,
      title: resumeData.title,
      template: resumeData.templateId,
    })
  },

  // 删除草稿
  remove(backendId) {
    return apiClient.delete(`/resumes/${backendId}`)
  },
}
