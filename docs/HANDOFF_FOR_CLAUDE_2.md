# Claude Code 交接文档 v2

> 写给下一个窗口的小克。上一个窗口（Sonnet 4.6）已完成 post-beta 全部 polish，现在需要你接着做 **Stage 7：AI 功能（轻量版）**。

---

## 项目基本信息

- **项目**：Resume Builder（毕业论文项目，Vue 3 + Express + MongoDB）
- **仓库**：https://github.com/yanyan1115/resume-builder
- **工作分支**：`codex/v0.1.0-beta`（直接在这个分支上继续）
- **本地路径**：`D:\GraduationThesis\Project\vue-project\vue-project`
- **后端路径**：同上 `/backend`

---

## 已完成的工作（本次窗口）

所有改动均已 push 到 `origin/codex/v0.1.0-beta`，最新 commit：

| commit | 内容 |
|--------|------|
| `d388dfb` | HomePage 毛玻璃美化，Vanta 波浪统一 `#1e3a5f` |
| `9e9b808` | P3 后端草稿同步（local-first），修 resumeController bug |
| `e4abca5` | Login/Register 页面视觉统一（毛玻璃风格） |
| `bc278c3` | 头像上传功能（base64 + Canvas 压缩，三套模板均支持） |
| `dd42eba` | 文档更新（README、ROADMAP、RELEASE_NOTES） |
| `6a1f6d1` | 退出登录+登录状态 nav、头像压缩、JSON 导入/导出 |

---

## 技术架构速览

```
src/
  schemas/resumeSchema.js     ← canonical schema，basics.photo 已加
  stores/resumeStore.js       ← Pinia，含 debounced backend sync / loadFromBackend
  api/
    client.js                 ← axios，JWT interceptor
    resumeApi.js              ← list/get/create/update/remove
  views/
    HomePage.vue              ← 毛玻璃 hero，Vanta 波浪
    LoginPage.vue             ← 毛玻璃，存 token + user_name
    RegisterPage.vue          ← 同上，注册后跳 /
    ResumeDrafts.vue          ← 草稿管理，Export/Import JSON
    ResumeEditor.vue          ← 编辑器，含头像上传+压缩
    ResumePreview.vue
    TemplateSelection.vue
  templates/
    registry.js               ← 3 个模板：classic / modern-two-column / fresh-grad
    ClassicTemplate.vue
    ModernTwoColumnTemplate.vue
    FreshGradTemplate.vue
  App.vue                     ← sticky nav，登录状态，退出登录
backend/
  server.js
  controllers/resumeController.js   ← CRUD，variable collision bug 已修
  controllers/userController.js     ← 登录/注册，返回 name+email+token
  models/resumeModel.js             ← resume: Mixed 存 canonical payload
  middleware/authMiddleware.js      ← JWT Bearer
  routes/resumeRoutes.js
  routes/userRoutes.js
```

---

## 下一步：Stage 7 AI 功能（轻量版）

Cora 和上一个小克商量好的方向：**JD 关键词提取 + 简历匹配度打分**，不做完整 AI，调用一次 API 即可，论文里能写一章。

### 具体建议方案

**入口**：在 `ResumeEditor.vue` 编辑器里加一个「AI 助手」折叠面板（Collapse），位置在所有 section 编辑区下方。

**功能流程**：
1. 用户粘贴 JD（Job Description）文本到 textarea
2. 点击「分析匹配度」按钮
3. 前端调用后端 `/api/ai/analyze`（新建）
4. 后端用 Claude API（或 OpenAI）提取 JD 关键词，和当前简历内容做对比
5. 返回：匹配分数（0-100）+ 命中关键词列表 + 缺失关键词建议
6. 前端展示结果（进度条分数 + tag 列表）

**实现要点**：
- AI 调用完全可选，没有 API key 时隐藏入口或 gracefully 降级
- 后端新建 `backend/controllers/aiController.js` 和 `backend/routes/aiRoutes.js`
- prompt 设计：把简历 canonical schema 序列化成纯文本喂给模型，JD 另附
- 前端 `src/api/aiApi.js` 封装调用
- 环境变量 `ANTHROPIC_API_KEY` 或 `OPENAI_API_KEY` 在 `backend/.env`

**推荐用 Claude API（Anthropic）**，因为：
1. 项目已经是 Claude Code 协作，论文里写起来更有故事性
2. Sonnet 4.6 性价比高，适合关键词提取这种轻量任务

### 模型配置建议

前端 Model 字段应保持可选：留空时使用后端环境变量配置的 provider 默认模型，或由用户按服务商当前文档填写明确模型名。不要在代码或文档中承诺不稳定、未确认公开的模型 ID。

调用方式参考 `src/api/client.js` 的 axios 风格，后端用 `@anthropic-ai/sdk` 或 OpenAI-compatible SDK。

---

## 已知注意事项

- **不要改 canonical schema** 的核心字段（id, basics, sections 等），`basics.photo` 已有
- **不要重新引入** ResumeApp 移动端代码
- **不要开始** 草稿页卡片式美化（⑤）和模板缩略图，留给 Gem 做
- build warnings（vendor CSS ~322KiB，vendor JS ~2.34MiB）非阻塞，不用管
- `resumeStore.js` 的 `persistActiveDraft` 会自动触发云同步，新功能存数据走 `setActiveResume` 或 `persistActiveDraft` 即可

---

## 用户信息

- 用户名：Cora（中文沟通，她叫你小克）
- 邮箱：yanyan1115xyzzz@gmail.com
- 风格：友好活泼，会用颜文字，喜欢好看的 UI，决策上听你建议

---

## 启动命令

```bash
# 前端
cd D:\GraduationThesis\Project\vue-project\vue-project
npm run serve        # http://localhost:8080

# 后端
cd backend
npm start            # http://localhost:5000
```

加油！💪
