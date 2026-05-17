# Release Checklist

Use this checklist before publishing `v0.1.0-beta`.

## Product Flow

- Create a new local draft.
- Rename, duplicate, open, and delete drafts.
- Edit basics, job intention, and repeatable sections.
- Switch between Classic and Modern Two Column templates.
- Confirm `/preview` renders the active draft.
- Confirm browser `Print / Save as PDF` opens print preview.
- Confirm legacy screenshot PDF, HTML, and Word export paths do not throw runtime errors.

## Documentation

- README reflects current features and limitations.
- `docs/QA_CHECKLIST.md` matches the latest UI.
- `docs/RELEASE_NOTES.md` includes the beta draft.
- `docs/SAMPLE_RESUME.md` is suitable for demos.
- Screenshots in `docs/images/` are current.

## Engineering Verification

- `npm run lint` passes.
- `npm run build` passes.
- Remaining build warnings are understood and documented.
- No new dependencies were added unintentionally.
- Browser console has no obvious runtime errors on `/drafts`, `/editor`, `/preview`, and `/templates`.

## Repository Hygiene

- Issue templates are present in `.github/ISSUE_TEMPLATE/`.
- License and contribution guide are linked from README.
- Temporary debug logs are removed from touched files.
- Generated screenshots are reasonably sized.

## Known Beta Gaps

- Backend draft synchronization is not included in this beta.
- AI features are not included in this beta.
- Uploaded template previews are not yet a full template contribution workflow.
- Bundle size optimization remains future work.
