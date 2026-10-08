# PGRAISE — UiTM Faculty of Pharmacy GOT Finder

Student-number lookup for research planning milestones based on the faculty workbook dated 29 September 2026. The English interface uses a purple UiTM-inspired theme.

## Deployment

The GitHub Pages frontend is built by `python scripts/build-pages.py` and deployed by `.github/workflows/pages.yml`. In repository Settings → Pages, set Source to GitHub Actions. A private repository requires a GitHub plan that supports private-repository Pages; keep the repository private because its existing history contains the faculty lookup dataset.

The Pages frontend calls the existing backend at https://got-farmasi-sapri.saprimad.chatgpt.site/api/lookup. The backend explicitly allows the origin https://saprimad.github.io. Student records are excluded from the Pages artifact. The Sites backend remains necessary for real searches.

To build the backend: `python scripts/bundle_worker.py`, then `bash scripts/build.sh` and `node scripts/validate-artifact.mjs`.

## Import faculty workbook

`python scripts/import_workbook.py /path/to/workbook.xlsm private/records.json`

Importer reads zipped XML only and does not execute VBA. It extracts faculty code PH, program, study level/mode, registration date and GOT parameters. It excludes names, supervisor/staff information and raw student numbers. Lookup keys use SHA-256. Hashing is data minimisation, **not access control**: student numbers can be guessed. Real datasets must remain on private hosting or move to a restricted server endpoint before public rollout.

Dataset is dated and may contain historical students; it does not establish current enrolment status. Unknown DRP level/mode combinations return an error instead of inventing a deadline.

## Formula fidelity

GOT = registration + (program GOT months / 12 × 365) − 2 days. Thesis submission = GOT − 185 days. DRP = registration + ROUNDUP(DRP months / 12 × 365). Ethics = DRP + 60 days. Viva = submission + 70 days. Methodology targets follow the existing dashboard cell references, including its separate Methodology 3 target at submission − 90 days. Dates follow Excel integer date display; no calendar-month substitution.

These are calculated targets, not actual completion dates. Changes to institutional policy and actual milestones require faculty validation.

