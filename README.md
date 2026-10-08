# PGRAISE — GOT Finder

Live: https://got-farmasi-sapri.saprimad.chatgpt.site

Public student-number lookup for Faculty of Pharmacy planning timelines. The website returns one matching record through POST /api/lookup. Names, staff details and supervisor information are excluded. Dates are calculated planning targets, not actual completion dates.

## Architecture

Public HTML, CSS and JS are in web/. Faculty lookup inputs are in private/records.json in this private repository. scripts/bundle_worker.py embeds assets and records into a server-only ES module. Only named public assets and /api/lookup are routed; dataset and Worker source paths return 404. The Worker returns no-store responses, validates input/origin and applies an in-memory 20-requests-per-minute-per-IP limit. The limit is per isolate and is not a global anti-enumeration guarantee. Student number is a lookup key, not proof of identity.

## Build

python scripts/bundle_worker.py
bash scripts/build.sh
node scripts/validate-artifact.mjs

Deploy dist/server/index.js on compatible Worker hosting. GitHub Pages alone cannot run this server lookup. Keep this repository private because its source and history contain dataset inputs.

## Refresh

python scripts/import_workbook.py /path/to/faculty-workbook.xlsm private/records.json

No VBA execution. Current source is 29 September 2026: 594 usable PH records; 12 excluded for unavailable registration dates or program parameters. Historical records may be present. Update source date when importing a newer workbook.

## Formula

GOT = registration + (program months / 12 × 365) − 2 days. Submission = GOT − 185 days. DRP uses rounded-up day equivalents of 6/12 months for full-/part-time Masters, 12/18 months for full-/part-time PhD. Ethics = DRP + 60 days. Viva = submission + 70 days. Methodology dates follow the original dashboard cell references. Display uses Excel integer dates. Faculty should verify targets before official use.
