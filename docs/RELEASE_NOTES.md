# Release Notes

This file summarizes the current pre-beta implementation milestones.

## v0.1.0-beta Draft

This beta draft packages the first usable open-source product loop for Resume Builder.

### Highlights

- Local multi-draft resume management.
- Canonical resume schema and migration from legacy MVP data.
- Structured editor for basics, job intention, and repeatable sections.
- Classic and Modern Two Column templates through a template registry.
- Live preview based on the active draft.
- Browser-native `Print / Save as PDF` export with A4 print styles.
- Legacy screenshot PDF, HTML, and Word export paths retained.
- Open-source documentation, QA checklist, release checklist, issue templates, and beta screenshots.

### Verification

- Beta release checklist core flow passed with browser automation.
- `npm run lint` passes.
- `npm run build` passes.
- Browserslist data was refreshed with `npx update-browserslist-db@latest`.

### Known Beta Gaps

- Backend draft synchronization is not part of this beta.
- AI job-description matching and resume suggestions are not part of this beta.
- Uploaded template previews are not yet a full template contribution workflow.
- Mobile app experiments are not included in this beta release.
- Bundle size warnings remain and should be handled in a later dependency cleanup/performance pass.
- `@achrinza/node-ipc` reports an engine-range warning under Node 24 during npm maintenance commands; the app still builds.

### Acknowledgements

This beta was shaped and directed by Cora, with OpenAI Codex assisting as an AI coding collaborator during documentation, refactoring, QA, and release preparation.

Before tagging this release, run the checks in [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## Unreleased

### Stage 0: Documentation And Setup

- Added project-specific documentation for requirements, architecture, roadmap, setup, and contribution.
- Added backend environment example.
- Replaced default project description with resume-builder context.

### Stage 1: Stability Cleanup

- Stabilized frontend routing and startup configuration.
- Centralized API base URL configuration.
- Documented frontend and backend run commands.

### Stage 2: Shared Resume Schema

- Added canonical resume schema helpers and defaults.
- Added `migrateLegacyResume()` for old localStorage MVP data.
- Added Pinia resume draft store.
- Updated preview and template rendering to consume canonical resume data.
- Added lightweight backend model support for canonical resume payloads.

### Stage 3: Editor Redesign

- Rebuilt the editor around canonical `basics`, `intention`, and `sections`.
- Added repeatable editing for skills, work experience, projects, education, certificates, awards, and organizations.
- Added section title editing and visibility toggles.
- Kept live preview connected to the same canonical data.

### Stage 4: Real Template System

- Added a frontend template registry.
- Promoted the original layout into `ClassicTemplate`.
- Added `ModernTwoColumnTemplate` to prove real layout switching.
- Updated template selection, editor preview, and export to use `resume.templateId`.

### Stage 5: Export Quality

- Added A4 print styles for Classic and Modern templates.
- Added browser-native `Print / Save as PDF`.
- Kept legacy screenshot PDF, HTML, and Word export paths available.

### Stage 6: Save, Manage, And Reuse Resumes

- Added `/drafts` local draft management page.
- Added local create, open, duplicate, rename, and delete draft actions.
- Kept `/editor` and `/preview` tied to the active local draft.

### Stage 6.5: Open-Source Showcase And QA Polish

- Refreshed README for open-source presentation.
- Added manual QA checklist.
- Added sample resume reference.
- Documented current release milestones and known risks.

## Post-Beta (2026-05-17)

### UI Polish

- **HomePage**: Vanta wave color unified to `#1e3a5f`; glassmorphism card (backdrop-filter blur) on `#0d1b2a` background; 3-tier button layout (Start Editing / Choose Template / My Drafts); system-ui font with subtitle copy.
- **Login / Register pages**: same glassmorphism visual language as HomePage; dark frosted-glass input fields; soft red error messages; loading spinner on login submit.
- **FreshGradTemplate**: new third template — header-banner style with navy background, meta-bar row, left-label section layout; ATS-friendly single-column structure.
- **App.vue / ResumeEditor.vue / TemplateSelection.vue**: sticky nav cleanup, neutral editor background, paper card preview shadow, thumbnail color sync.

### Backend Draft Sync

- Added `src/api/resumeApi.js` with list / get / create / update / remove wrappers over the existing Axios client.
- Extended `resumeStore.js` with debounced backend sync, `loadFromBackend`, and `deleteDraftWithSync` actions.
- `persistActiveDraft` now triggers async cloud sync after local save; `backendId` stored in `draft.settings` maps local UUID to MongoDB `_id`.
- Sync is local-first and now exposes `syncStatus` / `lastSyncError` in the store so failures are visible without blocking editing.
- `App.vue` calls `loadFromBackend` on mount; remote wins on `updatedAt` conflict.
- Fixed `resumeController.js` `updateResume` variable name collision (`const resume` redeclaration).
- Unauthenticated users: zero behavior change.

### AI Follow-up

- Added `/api/ai/analyze` proxy flow for optional JD matching.
- Kept API key handling transparent: browser localStorage -> local/self-hosted backend proxy -> provider request.
- Removed hardcoded default-model promises from docs and switched to optional provider model configuration.
- Added lightweight AI proxy safeguards: request body limit and per-client in-memory rate limiting, configurable via backend environment variables.

### Profile Photo Upload

- Added `basics.photo` (base64 string) to canonical schema, `createDefaultResume`, and `normalizeCanonicalResume`.
- Click-to-upload photo UI in Basic Information section of editor: FileReader → base64, Remove button, hidden file input (jpg / png / webp).
- All three templates render the photo: Classic (80×80 rounded, top-right), Modern Two-Column (90×90 circular, sidebar center), Fresh Grad (80×80 rounded, header banner corner).
- No server upload required; photo travels with draft data through localStorage and backend sync automatically.
