# Handoff For Claude Code

This document hands off the current `v0.1.0-beta` state of Resume Builder to Claude Code or another implementation agent.

## 1. Repository And Branch

- Repository: `https://github.com/yanyan1115/resume-builder`
- Working branch: `codex/v0.1.0-beta`
- Beta tag: `v0.1.0-beta`
- Current release focus: web application beta, not mobile.

The public beta branch intentionally excludes local mobile experiments and uploaded runtime files:

- `ResumeApp/` is ignored and not part of the beta release.
- `backend/uploads/` is ignored and should remain runtime-only.
- `backend/.env` is ignored. Use `backend/.env.example` for setup.

## 2. What This Refactor Accomplished

The project started as a Vue resume-generator MVP with a basic editor, weak template/theme coupling, screenshot-style PDF export, little documentation, and incomplete open-source packaging.

The current beta now has a full core product loop:

```text
local draft management
  -> canonical resume schema
  -> structured editor
  -> template registry
  -> live preview
  -> browser-native print-to-PDF export
```

Major completed stages:

- Stage 0: product, roadmap, architecture, setup, contribution, and release docs.
- Stage 1: startup/routing/API stability cleanup.
- Stage 2: canonical resume schema and migration from legacy MVP data.
- Stage 3: first structured editor pass.
- Stage 4: real template registry with Classic and Modern Two Column layouts.
- Stage 5: browser-native `Print / Save as PDF` as the main export path.
- Stage 6: local multi-draft management.
- Stage 6.5: open-source polish, screenshots, QA checklist, release checklist, issue templates, bilingual README.

## 3. Current Project Structure

```text
.
├── .github/ISSUE_TEMPLATE/       # Bug, feature, and template request templates
├── backend/                      # Express/MongoDB backend foundation
├── docs/                         # Product, architecture, QA, release, and handoff docs
├── public/themes/                # Compiled theme CSS
├── src/
│   ├── api/                      # Axios API client
│   ├── assets/styles/            # SCSS tokens, globals, components, themes
│   ├── components/               # Shared Vue components and dynamic template host
│   ├── router/                   # Vue Router routes
│   ├── schemas/                  # Canonical resume schema helpers
│   ├── stores/                   # Pinia stores
│   ├── templates/                # Real resume layout templates and registry
│   └── views/                    # Page-level Vue views
├── README.md                     # Bilingual public README
├── CONTRIBUTING.md
└── LICENSE
```

## 4. Key Frontend Files

### Schema And Draft State

- `src/schemas/resumeSchema.js`
  - Canonical resume schema defaults.
  - Legacy migration helpers.
  - Normalization helpers.
  - Compatibility between old flat MVP data and new `basics / intention / sections`.

- `src/stores/resumeStore.js`
  - Pinia store for local drafts.
  - LocalStorage keys:
    - `resume-builder:drafts`
    - `resume-builder:active-draft-id`
  - Draft actions:
    - `loadDrafts`
    - `createDraft`
    - `openDraft`
    - `duplicateDraft`
    - `renameDraft`
    - `deleteDraft`

### Editor, Preview, Drafts

- `src/views/ResumeEditor.vue`
  - Main structured resume editor.
  - Edits canonical resume data directly.
  - Supports basics, intention, section titles, visibility toggles, and repeatable items.
  - Drives live preview and export.

- `src/views/ResumePreview.vue`
  - Reads the active draft from the resume store.
  - Renders through the dynamic template host.

- `src/views/ResumeDrafts.vue`
  - Local draft manager at `/drafts`.
  - `/resumes` redirects to `/drafts`.
  - Supports create, open, duplicate, rename, delete.

### Templates

- `src/templates/registry.js`
  - Source of truth for layout templates.
  - Current templates:
    - `classic`
    - `modern-two-column`

- `src/components/template.vue`
  - Dynamic template host.
  - Chooses the actual layout component by `resume.templateId`.

- `src/templates/ClassicTemplate.vue`
  - Single-column layout.
  - Includes print styles.

- `src/templates/ModernTwoColumnTemplate.vue`
  - Two-column layout.
  - Includes print styles.

- `src/templates/templateUtils.js`
  - Shared formatting and section helpers for templates.

### Routes And App Shell

- `src/router/index.js`
  - Main routes:
    - `/`
    - `/drafts`
    - `/resumes` -> `/drafts`
    - `/editor`
    - `/preview`
    - `/templates`
    - `/upload-template`
    - `/login`
    - `/register`

- `src/App.vue`
  - App-level navigation and route outlet.

### API Client

- `src/api/client.js`
  - Axios client.
  - Default base URL: `http://localhost:5000/api`.
  - Override with `VUE_APP_API_BASE_URL`.
  - Adds bearer token from localStorage when available.

## 5. Key Backend Files

- `backend/server.js`
  - Express app setup.
  - MongoDB connection.
  - API routes.
  - Static upload serving.

- `backend/.env.example`
  - Documents required environment variables:
    - `PORT`
    - `PUBLIC_BASE_URL`
    - `MONGO_URI`
    - `JWT_SECRET`

- `backend/models/resumeModel.js`
  - Supports legacy resume fields plus a flexible canonical `resume` payload.
  - This is intentionally lightweight for beta.

- `backend/controllers/resumeController.js`
  - Resume CRUD foundation.
  - Compatible with old required fields and newer canonical payload.

- `backend/routes/resumeRoutes.js`
  - Protected resume routes.

- `backend/models/templateModel.js`, `backend/controllers/templateController.js`, `backend/routes/templateRoutes.js`
  - Uploaded template preview metadata.
  - This is not yet a full template contribution system.

## 6. Important Documentation

- `README.md`
  - Bilingual public README.
  - Contains screenshots, setup, known limits, mobile status, and acknowledgements.

- `docs/PRD.md`
  - Product requirements.

- `docs/ROADMAP.md`
  - Stage-by-stage project plan and current implementation status.

- `docs/ARCHITECTURE.md`
  - Current and target architecture.

- `docs/RESUME_SCHEMA.md`
  - Canonical resume schema contract.
  - Read this before changing editor, templates, export, or backend resume payloads.

- `docs/QA_CHECKLIST.md`
  - Manual QA flows.

- `docs/RELEASE_CHECKLIST.md`
  - Beta release checklist.

- `docs/RELEASE_NOTES.md`
  - Current `v0.1.0-beta` release notes.

- `docs/SAMPLE_RESUME.md`
  - Demo resume content reference.

## 7. Current Verification Status

Recent checks passed:

```bash
npm run lint
npm run build
```

Known remaining build warnings:

- Bundle size warning:
  - vendor CSS around `322 KiB`
  - vendor JS around `2.34 MiB`
  - entrypoint around `2.74 MiB`

These warnings are documented and do not block `v0.1.0-beta`.

## 8. Current Known Limitations

- Backend draft synchronization is not implemented.
- AI features are not implemented.
- Uploaded template previews are not a real template contribution workflow yet.
- Bundle size needs a future dependency/performance pass.
- Mobile app work is intentionally out of scope for beta.
- The editor is functional but still visually and structurally rough.
- Templates work, but their visual design and spacing need refinement.

## 9. Recommended Next Tasks

### Priority 1: Template Optimization

Goal: make the existing templates look more professional and more resume-like before adding many new templates.

Suggested tasks:

- Improve `ClassicTemplate.vue` typography, spacing, section hierarchy, and print polish.
- Improve `ModernTwoColumnTemplate.vue` two-column proportions, sidebar density, color usage, and page-break behavior.
- Add a third practical template after the two existing templates are polished:
  - ATS-friendly technical resume, or
  - student/new graduate resume.
- Add template metadata fields if needed:
  - scenario
  - bestFor
  - language support
  - print notes
- Ensure every template:
  - renders empty fields gracefully,
  - respects `section.visible`,
  - sorts by `section.order`,
  - prints cleanly on A4,
  - does not depend on editor internals.

Files to inspect first:

- `src/templates/registry.js`
- `src/templates/ClassicTemplate.vue`
- `src/templates/ModernTwoColumnTemplate.vue`
- `src/templates/templateUtils.js`
- `src/components/template.vue`

Validation:

- `npm run lint`
- `npm run build`
- Browser/Puppeteer smoke test:
  - Classic preview non-empty.
  - Modern preview non-empty.
  - Print media still hides editor controls.
  - Main sections remain visible after template switch.

### Priority 2: UI Beautification

Goal: make the app feel less like an MVP and more like a polished resume product.

Suggested tasks:

- Improve the app shell in `src/App.vue`:
  - cleaner navigation,
  - better active route state,
  - mobile layout polish.
- Improve `/drafts` empty state and draft cards in `src/views/ResumeDrafts.vue`.
- Improve `ResumeEditor.vue` layout:
  - clearer left editor / right preview split,
  - denser but calmer section controls,
  - better button hierarchy,
  - less visual clutter.
- Improve `TemplateSelection.vue`:
  - registry templates should feel like first-class templates,
  - uploaded preview area should be visually secondary and clearly labeled.
- Audit colors in SCSS:
  - avoid overusing one color family,
  - keep UI professional and resume-tool appropriate.

Files to inspect first:

- `src/App.vue`
- `src/views/ResumeDrafts.vue`
- `src/views/ResumeEditor.vue`
- `src/views/TemplateSelection.vue`
- `src/assets/styles/index.scss`
- `src/assets/styles/base/_variables.scss`
- `src/assets/styles/base/_global.scss`
- `src/assets/styles/components/_button.scss`
- `src/assets/styles/components/_card.scss`

Validation:

- `npm run lint`
- `npm run build`
- Screenshot checks at desktop and mobile widths.
- Confirm text does not overflow buttons/cards.
- Confirm editor and preview do not overlap.

### Priority 3: Backend Draft Sync

Goal: let logged-in users save drafts to backend while keeping local-only mode.

Suggested tasks:

- Define frontend API wrappers for resume CRUD.
- Add login-aware save/load behavior.
- Keep local draft mode as the default fallback.
- Decide how local drafts merge with backend drafts after login.

Files to inspect first:

- `src/api/client.js`
- `src/stores/resumeStore.js`
- `backend/models/resumeModel.js`
- `backend/controllers/resumeController.js`
- `backend/routes/resumeRoutes.js`

### Priority 4: Optional AI Features

Goal: add differentiation without making AI mandatory.

Suggested tasks:

- Add job description paste area.
- Add keyword matching against the canonical resume schema.
- Add bullet point improvement suggestions.
- Keep provider configuration optional and user-controlled.
- Do not hardcode a paid platform requirement into the main product path.

Relevant docs:

- `docs/PRD.md`
- `docs/ROADMAP.md`
- `docs/RESUME_SCHEMA.md`

## 10. Mobile App Recommendation

Do not continue the old local mobile experiment as part of the current beta.

Recommended approach:

- Treat the web app as the product baseline.
- Stabilize templates, UI, export, and backend sync first.
- If mobile returns, create a separate repository or package.
- Reuse the canonical resume schema rather than duplicating resume logic.
- Avoid carrying forward old React Native/WebView code without a fresh product plan.

## 11. Suggested Claude Code Starting Prompt

```text
You are taking over the Resume Builder project from the v0.1.0-beta handoff.

Read these files first:
- README.md
- docs/HANDOFF_FOR_CLAUDE.md
- docs/ROADMAP.md
- docs/ARCHITECTURE.md
- docs/RESUME_SCHEMA.md

Then work on Priority 1 and Priority 2:
1. Template optimization.
2. UI beautification.

Do not start AI features yet.
Do not reintroduce ResumeApp or backend/uploads into the beta branch.
Do not change the canonical schema unless absolutely necessary.
Keep local draft management, template switching, preview, and print export working.

Before finishing, run:
- npm run lint
- npm run build

Summarize changed files, visual changes, validation results, and any remaining risks.
```

