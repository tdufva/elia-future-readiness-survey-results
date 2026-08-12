# ELIA Future Readiness Survey Results

An accessible, privacy-preserving overview of 34 substantive responses to the ELIA Future Readiness Survey, collected in July and August 2026.

The public report combines descriptive counts with reflexive thematic analysis. It keeps counts beside percentages, documents exclusions and limitations, preserves overlapping categories, and withholds sensitive cross-tabulations. Its Respondent voices page publishes 99 written answers without respondent metadata; five are lightly redacted and three are withheld because de-identification would remove too much meaning.

## Local development

```bash
pnpm install
pnpm run dev
```

## Checks

```bash
pnpm run build
pnpm run build:pages
```

GitHub Pages is deployed from the static `out/` directory by the workflow in `.github/workflows/deploy-pages.yml`.
