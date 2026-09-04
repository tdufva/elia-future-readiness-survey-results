# ELIA Future Readiness Survey Results

An accessible overview of 38 substantive responses to the ELIA Future Readiness Survey, collected in July and August 2026.

The protected report combines descriptive counts with reflexive thematic analysis. It keeps counts beside percentages, documents exclusions and limitations, and preserves overlapping categories. Presentation condenses the three leading themes for each open-ended question into a concise visual narrative with source-linked excerpts. Respondent voices links each thematic quote to an anonymous profile. The encrypted All answers reader groups all 114 original written answers by respondent and includes country, age group and standardised institutional position; direct source identifiers are excluded. The Framework Method route adds a local, human-reviewable workspace for meaning-unit coding, qualitative matrices, futures lenses and audit exports without sending protected text to an external service.

## Local development

```bash
pnpm install
pnpm run dev
```

## Checks

```bash
ELIA_SURVEY_PASSWORD="..." pnpm test
ELIA_SURVEY_PASSWORD="..." pnpm run encrypt:pages
pnpm run test:protected
```

GitHub Pages is deployed from the encrypted static `out/` directory. The password is supplied through the repository secret `ELIA_SURVEY_PASSWORD` and is never committed to source or generated files.
