"""Every docx paragraph / table cell (tracked changes accepted) must appear verbatim in content/patient."""
import json, re, sys
from pathlib import Path
import yaml
blocks = json.load(open(sys.argv[1]))
cdir = Path(sys.argv[2])
def norm(s):
    s = re.sub(r'\*\*|\[\[figure:\w+\]\]|^#+ |^- |^\d+\. ', '', s, flags=re.M)
    return re.sub(r'\s+', ' ', s).strip()
content = (cdir / 'overview.md').read_text()
for f in ['lying', 'shower', 'partner']:
    d = yaml.safe_load((cdir / f'{f}.yaml').read_text())
    parts = [d['seoTitle'], d['intro'], d['safety']]
    for s in d['steps']:
        parts += [s['title'], s['summary'], s['body']]
        if 'tips' in s:
            parts += [s['tips']['title']] + s['tips']['items']
    content += '\n' + '\n'.join(parts)
hay = norm(content)
CORRECTIONS = yaml.safe_load((Path(__file__).parent / 'corrections.yaml').read_text())
def corrected(t):
    # Unscoped fixes and field-scoped heading fixes apply to the docx text; label fixes concern the label images.
    for c in CORRECTIONS:
        if c.get('approach') or c.get('step'):
            continue
        t = t.replace(c['find'], c['replace'])
    return t
texts = []
for b in blocks:
    if b['kind'] == 'p':
        texts.append((b['style'], b['text']))
    else:
        for r in b['rows']:
            for c in r:
                for p in c:
                    texts.append(('cell', p['text']))
missing, checked, skipped = [], 0, []
for style, t in texts:
    t = t.strip()
    if not t:
        continue
    if t.startswith('Detailed instructions:'):
        skipped.append(t); continue
    if style == 'Cmsor2':
        t = re.sub(r'[\s.]+$', '', t)
    checked += 1
    if norm(corrected(t)) not in hay:
        missing.append(t)
print(f'checked {checked} paragraphs/cells; missing {len(missing)}; skipped (replaced by UI) {len(skipped)}')
for m in missing: print('MISSING:', m[:150])
for s in skipped: print('SKIPPED:', s)
