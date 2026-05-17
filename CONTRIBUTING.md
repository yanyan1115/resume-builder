# Contributing

Thanks for considering a contribution to Resume Builder. The project is still in MVP-to-open-source preparation, so clear, focused changes are especially helpful.

## Project Direction

Before making large changes, read:

- [Product Requirements](docs/PRD.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)

## Good First Contributions

- Improve setup documentation.
- Fix route and configuration mismatches listed in the roadmap.
- Add small UI polish without changing product scope.
- Improve template preview assets.
- Add tests around pure utility functions once they are introduced.

## Development Workflow

1. Create a branch for your change.
2. Keep the change focused on one roadmap item or bug.
3. Run lint before opening a pull request.
4. Update documentation when behavior, setup, or architecture changes.
5. Explain the user-facing impact in the pull request description.

## Code Guidelines

- Prefer existing Vue, Element Plus, and SCSS patterns until a refactor stage replaces them.
- Keep resume data shape changes aligned with the shared schema plan.
- Do not add paid-service assumptions to core flows.
- Keep AI features optional and provider-configurable.
- Avoid committing local environment files, generated secrets, or uploaded user files.

## Template Contributions

Template work should eventually use a template registry. Until that is implemented, template contributions should be discussed first so they do not deepen the current color-theme-only design.

Good template goals:

- Real layout differences.
- Clean A4 print behavior.
- ATS-friendly typography.
- Clear preview image.
- Minimal coupling to editor internals.

## Reporting Issues

When reporting a bug, include:

- What you expected.
- What actually happened.
- Steps to reproduce.
- Browser and operating system.
- Console or backend logs if relevant.

When suggesting a feature, include:

- The user problem.
- The proposed behavior.
- Whether it belongs to editor, template, export, backend, or AI scope.

