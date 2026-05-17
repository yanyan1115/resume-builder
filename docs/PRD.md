# Product Requirements Document

## Related Docs

- [Roadmap](ROADMAP.md)
- [Architecture](ARCHITECTURE.md)
- [Resume Schema](RESUME_SCHEMA.md)
- [Setup Guide](SETUP.md)

## 1. Product Summary

Resume Builder is a free and open-source resume generation tool. It helps job seekers create, edit, preview, export, and optionally optimize resumes without paying for locked templates or basic export features.

The current implementation proves the core idea. The next version should become a usable open-source product that can compete with common resume features in recruiting platforms by being free, self-hostable, customizable, and transparent.

## 2. Product Positioning

### Target Users

- Students and new graduates preparing Chinese or English resumes.
- Job seekers who need fast, polished, editable resumes.
- Developers and open-source users who want a self-hosted resume builder.
- Contributors who want to add templates, export formats, or AI-assisted writing features.

### Core Value

- Free resume editing and export.
- Open-source, self-hostable, and extensible.
- Flexible structured editing instead of one large text box.
- High-quality templates that are suitable for real job applications.
- Optional AI assistance for resume improvement and job description matching.

### Differentiation

Many recruiting products place template selection, PDF export, resume polishing, or AI optimization behind paid membership. This project should make the useful baseline free and keep advanced features transparent and configurable.

## 3. Problem Statement

The current MVP has several limitations:

- Templates are limited and visually weak.
- Template selection mostly changes color themes rather than layout.
- Resume editing is not flexible enough for real use.
- Export quality is unstable, especially PDF pagination and text clarity.
- Resume data is not consistently modeled across frontend and backend.
- Documentation is minimal, which makes open-source adoption difficult.

## 4. Goals

### Product Goals

- Let users create a complete resume from scratch within 10 minutes.
- Let users edit repeatable sections such as work experience, projects, and education.
- Provide several high-quality templates for different job-search scenarios.
- Export resumes as clean PDF files suitable for real applications.
- Allow users to save, reopen, duplicate, and modify resume drafts.

### Open-Source Goals

- Make the project easy to run locally.
- Document architecture and contribution paths.
- Make templates easy to add without touching unrelated editor logic.
- Separate product roadmap from implementation details.

## 5. Non-Goals For The Next Major Iteration

- Building a full recruiting platform.
- Hosting a public SaaS service before the local open-source product is stable.
- Adding complex payment, membership, or advertisement systems.
- Building a custom AI provider before the resume editing and export experience is reliable.

## 6. User Stories

### Resume Creation

- As a user, I want to enter basic personal information so that my resume has a complete header.
- As a user, I want to add multiple work experiences so that each role has company, title, dates, and bullet points.
- As a user, I want to add multiple project experiences so that I can describe impact and responsibilities clearly.
- As a user, I want to add education, skills, certificates, awards, and custom sections.

### Editing Flexibility

- As a user, I want to reorder sections so that my resume fits my background.
- As a user, I want to hide optional sections so that empty content does not appear.
- As a user, I want to rename section headings so that the resume can be Chinese, English, or customized.
- As a user, I want autosave so that I do not lose work.

### Templates

- As a user, I want to choose different resume layouts, not just colors.
- As a user, I want templates for different scenarios such as student resumes, technical resumes, and classic ATS-friendly resumes.
- As a contributor, I want a clear template API so that I can add a new template safely.

### Export

- As a user, I want a clear PDF export that keeps typography sharp.
- As a user, I want reasonable page breaks so that sections do not split awkwardly.
- As a user, I want exported files to use a meaningful filename.

### Account And Storage

- As a user, I want to save multiple resume drafts.
- As a user, I want to duplicate an existing resume and modify it for another job.
- As a user, I want local usage to work even before account features are fully polished.

### AI Assistance

- As a user, I want to paste a job description and see missing keywords.
- As a user, I want suggestions for improving bullet points.
- As a user, I want AI features to be optional and configurable with my own API key.

## 7. Functional Requirements

### Resume Data

- Define a single resume schema used by frontend, backend, templates, and export.
- Support repeatable sections:
  - Work experience
  - Project experience
  - Education
  - Certificates
  - Awards
  - Custom sections
- Support section visibility and ordering.
- Support language and display labels.

### Editor

- Provide a left-side editor and right-side A4 preview on desktop.
- Provide a mobile-friendly editing flow.
- Support add, edit, delete, duplicate, and reorder for repeatable entries.
- Support autosave to local storage.
- Support authenticated backend save later in the roadmap.

### Templates

- Introduce a template registry with metadata:
  - `id`
  - `name`
  - `description`
  - `scenario`
  - `preview`
  - `supportedSections`
  - `renderComponent`
- Start with at least 3 production-quality templates.
- Separate layout templates from color themes.

### Export

- Add print-specific CSS for A4 output.
- Support browser print-to-PDF as the first quality baseline.
- Evaluate server-side PDF export with Puppeteer after print styles are stable.
- Keep HTML and Word export as secondary formats.

### Backend

- Provide user registration and login.
- Provide resume CRUD APIs using the shared resume schema.
- Provide template list APIs if templates are stored server-side.
- Avoid hardcoded local URLs in client code.
- Document environment variables.

## 8. Non-Functional Requirements

- The app should run locally with documented setup steps.
- The frontend should remain usable without the backend for local-only resume editing.
- PDF output should be readable, sharp, and correctly paginated.
- Template code should be isolated from editor business logic.
- The project should avoid unnecessary large dependencies where possible.
- Sensitive configuration must use environment variables.

## 9. Success Metrics

- A new developer can run the project from the README without private knowledge.
- A user can create and export a complete resume without using paid services.
- At least 3 real templates are usable for actual job applications.
- PDF export produces selectable or high-resolution text without obvious layout breaks.
- Contributors can add a new template by following documented conventions.

## 10. Open Questions

- Should the first polished release be frontend-only, or should backend save be required?
- Should templates be pure Vue components, JSON-driven layouts, or a hybrid?
- Should AI features be implemented as local configurable provider adapters?
- Should mobile experiments live in a separate repository later?
