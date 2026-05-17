# Roadmap

Related documents:

- [Product Requirements](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Resume Schema](RESUME_SCHEMA.md)
- [Setup Guide](SETUP.md)

This roadmap turns the current MVP into an open-source resume builder in small, reviewable stages. Each stage should leave the project more usable than before.

## Stage 0: Documentation And Setup

Goal: Make the project understandable before large code changes.

- Add product requirements, roadmap, and architecture docs.
- Replace the default README with a project-specific README.
- Add `.env.example` for backend configuration.
- Document frontend and backend startup commands.
- Document known limitations.
- Decide whether mobile experiments belong in a separate repository.

Exit criteria:

- A contributor understands what the project is, how to run it, and where it is going.

## Stage 1: Stability Cleanup

Goal: Make the current MVP reliably runnable.

- Keep route targets aligned with configured router paths.
- Keep `vue.config.js` in a single exported configuration.
- Keep API base URLs centralized in the frontend API client.
- Keep a backend start script available.
- Add basic backend `.env.example`.
- Remove or isolate unused dependencies where safe.
- Remove noisy debug logs from production paths.

Exit criteria:

- Frontend starts consistently.
- Backend starts with documented environment variables.
- Main flows do not navigate to missing routes.

## Stage 2: Shared Resume Schema

Status: First implementation complete.

Implemented in the first pass:

- Added frontend canonical schema defaults and migration helpers in `src/schemas/resumeSchema.js`.
- Added a Pinia draft store in `src/stores/resumeStore.js`.
- Moved preview rendering to consume canonical `basics`, `intention`, and `sections`.
- Kept the existing editor form working through a temporary legacy-to-canonical adapter.
- Added lightweight backend support for storing a canonical `resume` payload.
- Verified legacy localStorage data can migrate into the new namespaced draft storage.

Goal: Create one resume data model used everywhere.

- Define the canonical resume schema in [RESUME_SCHEMA.md](RESUME_SCHEMA.md).
- Refactor editor data to match the schema.
- Refactor backend `resumeModel` to match the schema.
- Add migration or fallback handling for existing local MVP data.
- Add local autosave using the shared schema.
- Add basic resume import/export as JSON for debugging and portability.

Exit criteria:

- Editor, preview, export, and backend all consume the same resume shape.

Remaining follow-up:

- Replace the temporary legacy editor adapter during Stage 3.
- Add JSON import/export after the editor stores canonical data directly.

## Stage 3: Editor Redesign

Status: First structured editor pass in progress.

Implemented in the first pass:

- `ResumeEditor.vue` now edits the canonical resume schema directly.
- Basic information and job intention fields are mapped to `basics` and `intention`.
- Resume sections support title editing and visibility toggles.
- Skills, work experience, projects, education, certificates, awards, and organizations support repeatable item add/delete flows.
- The live preview continues to consume canonical schema data.

Goal: Make resume editing flexible enough for real users.

- Split the editor into focused components:
  - Basic information
  - Job intention
  - Work experience
  - Project experience
  - Education
  - Skills
  - Certificates and awards
  - Custom sections
- Support add, delete, duplicate, and reorder for repeatable sections.
- Support section visibility toggles.
- Support section title editing.
- Keep an A4 preview visible on desktop.
- Improve mobile editing layout.

Exit criteria:

- A user can build a realistic resume without stuffing whole sections into plain textareas.

## Stage 4: Real Template System

Status: First implementation complete.

Implemented in the first pass:

- Added a frontend template registry in `src/templates/registry.js`.
- Moved the original single-column preview into `ClassicTemplate.vue`.
- Added `ModernTwoColumnTemplate.vue` to prove layout templates can differ structurally.
- Kept `src/components/template.vue` as a dynamic template host for preview and export.
- Updated editor and template selection flows to write canonical `resume.templateId`.
- Kept existing theme CSS and uploaded template preview flow as compatibility layers.

Goal: Replace color-only templates with layout templates.

- Create a template registry.
- Separate template metadata, preview assets, layout components, and theme tokens.
- Build initial templates:
  - Classic single-column resume
  - Modern two-column resume
  - ATS-friendly technical resume
  - Student/new graduate resume
- Add template preview gallery.
- Add contribution guide for new templates.

Exit criteria:

- Choosing a template changes the actual resume layout, not only the color theme.

## Stage 5: Export Quality

Status: First implementation complete.

Implemented in the first pass:

- Added A4 print styles for Classic and Modern Two Column templates.
- Added a browser-native `Print / Save as PDF` export option.
- Kept the existing `html2canvas` + `jsPDF` screenshot PDF path as `Legacy Screenshot PDF`.
- Kept HTML and Word export paths intact.
- Added print rules that hide editor controls and print the selected template layout only.

Goal: Make exported resumes suitable for real applications.

- Add A4 print layout styles.
- Add page-break rules for sections and entries.
- Provide browser print-to-PDF as a reliable baseline.
- Improve filename handling.
- Evaluate server-side Puppeteer export.
- Keep Word and HTML export documented as secondary features.

Exit criteria:

- A user can export a clean PDF that looks like the preview and can be sent to recruiters.

## Stage 6: Save, Manage, And Reuse Resumes

Status: First local draft management implementation complete.

Implemented in the first pass:

- Added a local draft management page at `/drafts`, with `/resumes` redirecting there.
- Reused canonical localStorage keys: `resume-builder:drafts` and `resume-builder:active-draft-id`.
- Added local create, open, duplicate, rename, and delete actions to the Pinia resume store.
- Added a Drafts navigation entry and editor link back to draft management.
- Kept `/editor` and `/preview` reading the active draft.
- Backend synchronization remains a later enhancement.

Goal: Support multiple resume drafts.

- Add resume list page.
- Add create, duplicate, rename, delete, and update flows.
- Connect frontend save/load to backend resume APIs.
- Keep local-only mode available when not logged in.
- Add token handling and route guards where needed.

Exit criteria:

- A user can manage more than one resume and reuse drafts for different jobs.

## Stage 6.5: Open-Source Showcase And QA Polish

Status: First polish pass complete.

Implemented in the first pass:

- Refreshed README with current product status, features, setup, docs index, roadmap summary, and known limitations.
- Added [QA Checklist](QA_CHECKLIST.md) for core manual validation.
- Added [Release Notes](RELEASE_NOTES.md) summarizing Stage 0-6 first implementations.
- Added [Release Checklist](RELEASE_CHECKLIST.md) for `v0.1.0-beta` preparation.
- Added [Sample Resume](SAMPLE_RESUME.md) for demos and manual testing.
- Replaced deprecated Sass `lighten()` usage with `color.adjust()`.
- Added small empty states for local drafts and uploaded template previews.

Goal: Make the repository easier to understand, run, evaluate, and share before adding optional AI features.

Exit criteria:

- A new visitor can understand the project status and run the core flow.
- Core manual QA flows are documented.
- Known warnings and remaining risks are visible rather than surprising.

## Stage 7: Optional AI Features

Goal: Add useful differentiation without making AI mandatory.

- Add job description paste area.
- Add keyword match analysis.
- Add bullet point improvement suggestions.
- Add optional provider configuration.
- Keep AI calls transparent and user-controlled.

Exit criteria:

- Users can improve resumes against a job description without losing manual control.

## Future: Mobile App

Mobile support is intentionally out of scope for `v0.1.0-beta`.

If mobile work resumes, it should be planned after the web product stabilizes further. The preferred direction is a separate repository or package that reuses the canonical resume schema and treats the web app as the product baseline, rather than carrying forward an old experiment by default.

## Suggested Issue Labels

- `docs`
- `setup`
- `frontend`
- `backend`
- `schema`
- `templates`
- `export`
- `ai`
- `good first issue`
- `help wanted`
