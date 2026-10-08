# PGRAISE

PGRAISE's first module is **GOT Finder for Faculty of Pharmacy postgraduate research students**. Enter a student number to view calculated GOT, thesis submission and milestone dates, with a print/PDF option.

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000/dist/. A localhost or HTTPS origin is required for Web Crypto lookup. No build step or external JavaScript dependency is required.

## Dataset and privacy

This private repository contains 594 usable PH faculty records from the workbook dated 29 September 2026. Twelve other PH records were not imported because a registration date or matching program parameter was unavailable. Historical records may be present; this dataset does not establish current enrolment status.

Only program, study level/mode, registration date and GOT parameter are included. Names, staff details, supervisor details and raw student numbers are excluded. Lookup keys are SHA-256 hashes of a fixed prefix and student number.

**Hashing is not access control.** This is a private prototype. Do not make this repository or its dataset public. A student-number-only public rollout needs a protected server lookup that returns only the intended timeline; frontend JSON exposes the whole dataset to every authorised site visitor.

## Refresh data

```bash
python scripts/import_workbook.py /path/to/faculty-workbook.xlsm dist/data.json
```

The importer reads Excel XML without executing VBA. The original workbook is never committed. Confirm the source date in the importer when adapting it to a later workbook.

## Formula mapping

| Target | Formula from the faculty dashboard |
| --- | --- |
| GOT | Registration + program GOT months / 12 × 365 − 2 days |
| Thesis submission | GOT − 185 days |
| DRP | Registration + ROUNDUP(DRP months / 12 × 365) |
| Ethics | DRP + 60 days |
| Viva | Thesis submission + 70 days |

DRP uses 6/12 months for full-/part-time Masters and 12/18 months for full-/part-time PhD. Methodology targets follow the dashboard's separate cell references. Date formatting follows Excel integer-date display rather than substituting calendar months.

These are **planning targets**, not evidence that milestones are complete. Dates must be verified with faculty before official use. For example, the PH990 source parameter is 48.08 months; a personal three-year target is a separate goal.

## Checks

```bash
node tests/timeline.mjs
node --check dist/app.mjs
```

## Deployment

Serve the static root or `dist/` on private HTTPS hosting. The root redirects to `dist/`. This commit does not enable GitHub Pages or change repository visibility. Before any public deployment, replace the real frontend dataset with a protected lookup service, or use synthetic demo data only.
