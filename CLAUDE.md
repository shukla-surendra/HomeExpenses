@AGENTS.md

## Spec-driven development (mandatory)

Specs in `specs/` are the source of truth for features. Start with `specs/README.md`.

- Before changing behavior, read the relevant spec in `specs/` (index in `specs/README.md`).
- Update the spec (requirements + acceptance criteria) **first**, add a line to `specs/CHANGELOG.md`, then implement.
- New feature → new numbered spec file and an index entry.
- Tick acceptance criteria only after verifying; keep each spec's "Code map" accurate.
- If code and spec disagree, resolve it explicitly: fix the spec or fix the code, never leave them drifting.
