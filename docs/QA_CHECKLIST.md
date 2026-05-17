# QA Checklist

Use this checklist before tagging a release or sharing a demo build.

## Local Drafts

- Open `/drafts`.
- Create a new draft.
- Rename the draft.
- Duplicate the draft.
- Open the duplicate and confirm `/editor` loads it as the active draft.
- Delete a non-active draft.
- Refresh `/drafts` and confirm drafts restore from localStorage.

## Structured Editor

- Edit resume title.
- Edit basics: name, headline, email, phone, location, age, and birth date.
- Edit job intention: province, city, industry, job title, and salary range.
- Add and remove skills.
- Add and remove work experience, project, education, certificate, award, and organization entries.
- Toggle a section hidden and confirm it disappears from preview.
- Rename a section title and confirm the preview updates.

## Templates

- Open `/templates`.
- Choose Classic and confirm `/editor` uses the Classic layout.
- Choose Modern Two Column and confirm the layout changes visibly.
- Change theme from the editor and confirm the selected layout remains active.
- Open `/preview` and confirm it renders the active draft and selected template.

## Export

- Select `Print / Save as PDF` and confirm the browser print flow opens.
- In print preview, confirm only the resume is shown, not the editor controls.
- Confirm Classic and Modern print views are non-empty and use A4 sizing.
- Select `Legacy Screenshot PDF` and confirm it does not throw a runtime error.
- Select `html` and confirm an HTML download is triggered.
- Select `word` and confirm a Word download is triggered.

## Backend-Adjacent Flows

- Start the backend with a valid `backend/.env`.
- Register or log in if auth is being tested.
- Open `/templates` and confirm uploaded template previews fail gracefully when the backend is unavailable.

## Known Non-Blocking Warnings

- Bundle size warnings are expected until dependency cleanup and route-level splitting are prioritized.
- Browser print output can vary slightly by browser print settings.
