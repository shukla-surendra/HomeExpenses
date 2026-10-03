# 05 — Categories

Status: implemented (ACs pending on-device verification)

## Requirements
- R1: Settings lists categories with icon, name, color.
- R2: Add a category: name (required, unique case-insensitive), emoji icon, color from preset palette.
- R3: Edit name/icon/color.
- R4: Delete only if no expenses use it; otherwise show an explanatory alert.

## Acceptance criteria
- [ ] AC1: Duplicate names rejected.
- [ ] AC2: Deleting an in-use category is blocked with a message.
- [ ] AC3: Edits reflect immediately on the list and dashboard.

## Code map
`src/app/categories.tsx`
