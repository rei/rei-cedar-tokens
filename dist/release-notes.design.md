# Design changes – v14.0.0

This release reorganizes token outputs into per-category modules. No token values changed — colors, spacing, typography, and all other visual properties remain identical to v13.3.0. The change is structural: design tooling that reads Cedar tokens can now consume per-category files directly.

## Color
- No visual changes. All color token values are identical to v13.3.0

## Spacing
- No visual changes. All spacing token values are identical to v13.3.0

## Typography
- Token values unchanged. Format updated to W3C Design Token Community Group composite structure — Tokens Studio and Figma Variables can now consume Cedar typography tokens without a translation layer

## Motion
- No visual changes. Motion token values are identical to v13.3.0

## Radius
- No visual changes. Radius token values are identical to v13.3.0

## Figma variables
- No variable renames or value changes required
- Typography token format now aligns with DTCG spec. If your Figma Variables sync reads Cedar JSON directly, it picks up the new composite structure automatically
- Per-category JSON files are now available for selective sync (e.g., sync only color tokens)
