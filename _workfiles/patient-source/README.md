# Patient journey source

- `UroDapter_self-treatment_FULL_KA.docx` – the full patient content (2026-10-10). It still contains unaccepted tracked changes and 4 comments from Kéri András; the app uses the text **with all tracked changes accepted**.
- `extract.py` – reads the docx XML (tracked changes accepted, character styles resolved) into a block list (JSON).
- `build.py` – turns the block list into `content/patient/overview.md` and `content/patient/{lying,shower,partner}.yaml`. Text is copied verbatim except for the fixes in `corrections.yaml`; only structure is mapped (headings, lists, figure markers, tips, safety paragraph). The Word link markers at the end of step headings (" .", "..", ".") are dropped.
- `check.py` – checks that every docx paragraph and table cell appears in the content files.
- `corrections.yaml` – approved language fixes (2026-10-10). `build.py` applies them after reading the docx, `check.py` takes them into account. A fix that no longer matches the docx stops the build.

When a new version of the docx arrives (for example after the medical review):

```sh
python3 extract.py UroDapter_self-treatment_FULL_KA.docx > /tmp/blocks.json
python3 build.py /tmp/blocks.json ../../content/patient
python3 check.py /tmp/blocks.json ../../content/patient
```

Requires Python 3 with `lxml` and `PyYAML`. Hand edits made in `content/patient/` are overwritten by `build.py`.
