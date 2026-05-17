# Resume Builder

中文 | [English](#english)

Resume Builder 是一个开源、可自托管的简历生成器，基于 Vue、Pinia、Express 和 MongoDB 构建。当前 beta 已经打通核心产品链路：本地多草稿管理、结构化简历编辑、真实布局模板、实时预览，以及浏览器原生 `Print / Save as PDF` 导出。

项目仍处于 beta 早期阶段，但已经可以本地运行、体验核心流程，并作为后续模板、导出、后端同步和 AI 功能的开源基础。

## 核心功能

- 本地多简历草稿管理：新建、打开、复制、重命名、删除。
- canonical resume schema：编辑器、预览、模板渲染、导出和后端持久化基础共享同一份数据结构。
- 结构化编辑器：支持基础信息（含头像上传）、求职意向、技能、工作经历、项目经历、教育经历、证书、奖项和组织经历。
- 头像上传：图片转 base64 存入简历数据，无需服务器，三套模板均支持显示。
- 真实模板注册表，当前包含三种布局：
  - Classic 单栏简历（Georgian 衬线字体）。
  - Modern Two Column 双栏简历（深蓝 sidebar）。
  - Fresh Grad 应届生横幅简历（ATS 友好）。
- 保留 light、dark、blue、purple、pink、red 等主题 CSS。
- 基于当前 active draft 的实时预览。
- 浏览器原生 `Print / Save as PDF`，导出的 PDF 文字更清晰、可选中。
- 保留 legacy screenshot PDF、HTML、Word 导出作为次要路径。
- Express/MongoDB 后端：认证、简历 CRUD API 已完整实现。
- **后端草稿同步**：登录用户的草稿自动同步到后端，local-first 策略，未登录用户零感知。

## 当前状态

项目已经完成 Stage 0–6.5 的全部实现，并在 beta 之后完成了以下增强：

- 文档和启动基础。
- 稳定性清理。
- 共享简历 schema。
- 结构化编辑器（含头像上传）。
- 真实模板系统（3 套模板）。
- 导出质量基线。
- 本地草稿管理。
- 开源展示和 QA polish。
- **Post-beta**：登录/注册页面视觉统一、HomePage 美化、后端草稿同步（local-first）、头像上传功能。

可选 AI 功能（Stage 7）仍是后续工作。

## 截图

### 草稿管理

![Draft management](docs/images/drafts-page.png)

### Classic 编辑器

![Editor with Classic template](docs/images/editor-classic.png)

### Modern Two Column 编辑器

![Editor with Modern Two Column template](docs/images/editor-modern.png)

### 模板页

![Template gallery](docs/images/templates-page.png)

## 快速开始

安装前端依赖：

```bash
npm install
```

启动前端：

```bash
npm run serve
```

打开：

```text
http://localhost:8080
```

常用路由：

- `/drafts`：本地简历草稿管理。
- `/editor`：当前草稿的结构化编辑器。
- `/preview`：当前草稿的预览页。
- `/templates`：模板展示页和上传模板预览区域。

构建和检查：

```bash
npm run lint
npm run build
```

## 后端设置

安装后端依赖：

```bash
cd backend
npm install
```

创建环境变量文件：

```bash
cp backend/.env.example backend/.env
```

Windows PowerShell：

```powershell
Copy-Item backend/.env.example backend/.env
```

填写 `MONGO_URI`、`JWT_SECRET`、`PORT` 和 `PUBLIC_BASE_URL`，然后运行：

```bash
cd backend
npm start
```

Web app 可以在不启动后端的情况下使用本地草稿模式。后端简历同步是后续增强项。

## 文档

- [产品需求](docs/PRD.md)
- [架构说明](docs/ARCHITECTURE.md)
- [路线图](docs/ROADMAP.md)
- [简历 Schema](docs/RESUME_SCHEMA.md)
- [安装运行指南](docs/SETUP.md)
- [QA Checklist](docs/QA_CHECKLIST.md)
- [Release Notes](docs/RELEASE_NOTES.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [示例简历](docs/SAMPLE_RESUME.md)
- [Claude Code 交接文档](docs/HANDOFF_FOR_CLAUDE.md)
- [贡献指南](CONTRIBUTING.md)

## 路线图摘要

- Stage 0–6.5：✅ 全部完成。
- Post-beta polish：✅ UI 视觉统一、后端草稿同步、头像上传。
- Stage 7：可选 AI 功能，例如 JD 匹配、关键词建议和 bullet 优化。

## 已知限制

- bundle size 仍然偏大，因为依赖中包含导出、3D 和实验性功能相关库。
- 头像以 base64 存储，大图片会增加 localStorage / 后端体积，建议上传前压缩。
- 上传模板预览还不是完整的模板贡献系统。
- 推荐使用浏览器原生 print 作为 PDF 导出路径；legacy screenshot PDF 仍可用，但质量较低。
- 本地移动端实验不包含在本次 beta release 中。

## 移动端状态

本次 beta release 专注 Web 应用。早期本地移动端实验被有意排除在公开 beta 分支外，以保持 release 范围清晰、可运行。

如果未来恢复移动端支持，建议基于已经稳定的 Web 产品重新规划，最好作为单独仓库或 package，并复用同一套 canonical resume schema。

## 致谢

这个项目由 Cora 规划和主导。OpenAI Codex 作为 AI coding collaborator 参与了 beta 阶段的文档、重构、QA 和发布准备；Claude Code（Anthropic）参与了 post-beta 的 UI 美化、后端草稿同步和头像功能开发。

## License

本项目基于 [MIT License](LICENSE) 开源。

---

## English

Resume Builder is an open-source, self-hostable resume creation tool built with Vue, Pinia, Express, and MongoDB. The current beta has the core product loop in place: local draft management, structured resume editing, real layout templates, live preview, and browser-native `Print / Save as PDF` export.

The project is still in early beta, but it is ready for contributors to run locally, inspect the architecture, and help turn it into a polished resume builder.

## Core Features

- Local multi-resume draft management with create, open, duplicate, rename, and delete flows.
- Canonical resume schema shared by editor, preview, template rendering, export, and backend persistence.
- Structured editor for basics (including profile photo), job intention, skills, work experience, projects, education, certificates, awards, and organizations.
- Profile photo upload: image converted to base64 and stored in resume data — no server upload needed; all three templates render it.
- Real template registry with three layout components:
  - Classic single-column resume (Georgia serif).
  - Modern Two Column resume (dark navy sidebar).
  - Fresh Grad resume (header-banner style, ATS-friendly).
- Theme support retained for existing light, dark, blue, purple, pink, and red CSS themes.
- Live preview powered by the active canonical draft.
- Browser-native `Print / Save as PDF` export for sharper, selectable text.
- Legacy screenshot PDF, HTML, and Word export paths retained as secondary options.
- Express/MongoDB backend with full resume CRUD API and JWT authentication.
- **Backend draft sync**: logged-in users' drafts sync automatically — local-first, silent on network failure; unauthenticated users see zero behavior change.

## Current Status

The project has completed Stages 0–6.5 and the following post-beta enhancements:

- Documentation and setup baseline.
- Stability cleanup.
- Shared resume schema.
- Structured editor redesign (with profile photo upload).
- Real template system (3 templates).
- Export quality baseline.
- Local draft management.
- Open-source showcase and QA polish.
- **Post-beta**: Login/Register page visual unification, HomePage glassmorphism redesign, backend draft sync (local-first), and profile photo upload across all templates.

Optional AI features (Stage 7) remain future work.

## Screenshots

### Draft Management

![Draft management](docs/images/drafts-page.png)

### Classic Editor

![Editor with Classic template](docs/images/editor-classic.png)

### Modern Two Column Editor

![Editor with Modern Two Column template](docs/images/editor-modern.png)

### Template Gallery

![Template gallery](docs/images/templates-page.png)

## Quick Start

Install frontend dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run serve
```

Open:

```text
http://localhost:8080
```

Useful routes:

- `/drafts`: local resume draft manager.
- `/editor`: structured editor for the active draft.
- `/preview`: preview for the active draft.
- `/templates`: template gallery and uploaded template preview area.

Build and lint:

```bash
npm run lint
npm run build
```

## Backend Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Create an environment file:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Fill in `MONGO_URI`, `JWT_SECRET`, `PORT`, and `PUBLIC_BASE_URL`, then run:

```bash
cd backend
npm start
```

The web app works in local-only draft mode without the backend. Backend resume synchronization is planned as a later enhancement.

## Documentation

- [Product Requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Resume Schema](docs/RESUME_SCHEMA.md)
- [Setup Guide](docs/SETUP.md)
- [QA Checklist](docs/QA_CHECKLIST.md)
- [Release Notes](docs/RELEASE_NOTES.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Sample Resume](docs/SAMPLE_RESUME.md)
- [Claude Code Handoff](docs/HANDOFF_FOR_CLAUDE.md)
- [Contribution Guide](CONTRIBUTING.md)

## Roadmap Summary

- Stages 0–6.5: ✅ Complete.
- Post-beta polish: ✅ UI unification, backend sync, profile photo.
- Stage 7: Optional AI features such as job description matching, keyword suggestions, and bullet improvement.

## Known Limitations

- Bundle size is still high because the dependency list includes export, 3D, and experimental libraries.
- Profile photos are stored as base64; large images increase localStorage and backend payload size — compress before uploading.
- Uploaded template previews are not yet a full template contribution system.
- Browser-native print is the recommended PDF path; legacy screenshot PDF remains available but is lower quality.
- Local mobile experiments are not included in this beta release.

## Mobile App Status

This beta release focuses on the web application. Earlier local mobile experiments are intentionally excluded from the public beta branch to keep the release scope clear and runnable.

If mobile support returns later, it should start as a fresh plan around the stabilized web product, likely as a separate repository or package that consumes the same resume schema.

## Acknowledgements

This project was shaped and directed by Cora. OpenAI Codex assisted as an AI coding collaborator during the beta phase (documentation, refactoring, QA, and release preparation). Claude Code (Anthropic) contributed to post-beta UI polish, backend draft sync, and profile photo upload.

## License

This project is licensed under the [MIT License](LICENSE).
