"""Build content/patient/*.{md,yaml} from blocks.json (output of extract.py).
Text is copied verbatim; only structure is mapped (headings, lists, figures).
Word link markers at the end of step headings (" .", "..", ".") are dropped."""
import json, re, sys
from pathlib import Path
import yaml

blocks = json.load(open(sys.argv[1]))
OUT = Path(sys.argv[2])
CORRECTIONS = yaml.safe_load((Path(__file__).parent / 'corrections.yaml').read_text())
used = [0] * len(CORRECTIONS)

def fix(text, approach=None, step=None, field=None):
    """Apply the approved corrections that are in scope for this text."""
    for i, c in enumerate(CORRECTIONS):
        if c.get('approach') and c['approach'] != approach:
            continue
        if c.get('step') and c['step'] != step:
            continue
        if c.get('field') and c['field'] != field:
            continue
        if c['find'] in text:
            text = text.replace(c['find'], c['replace'])
            used[i] += 1
    return text
OUT.mkdir(parents=True, exist_ok=True)

STEP_IDS = ['prepare', 'position', 'disinfect', 'locate', 'place', 'seal', 'instill', 'feedback']
FIGURES = {'image13.jpeg': 'anatomy', 'image18.jpeg': 'anatomy', 'image19.jpeg': 'anatomy', 'image14.png': 'sealing'}
# Text of the step label images in the one-page summaries (the images contain only this text).
LABEL_IMAGES = {
    'image5.png': 'Prepare equipment and environment',
    'image6.png': 'Choose and set up your position',
    'image7.png': 'Clean and disinfect the area',
    'image8.png': 'Locate the urethral opening',
    'image9.png': 'Place and align the UroDapter',
    'image10.png': 'Create and maintain the seal',
    'image11.png': 'Instill the solution',
    'image12.png': 'Use leakage or resistance as feedback',
    'image15.png': 'Prepare equipment and shower area',
    'image16.png': 'Choose your standing position',
    'image17.png': 'Locate the urethral opening by touch',
}
# cardDescription: the line under the card title on the Self instillation page (not in the docx; given by the content owner).
APPROACHES = [
    {'id': 'lying', 'label': 'Lying or semi-reclined',
     'imageAlt': 'A woman reclining in bed, supported by pillows',
     'cardDescription': 'You perform the instillation yourself while lying down or semi-reclined.'},
    {'id': 'shower', 'label': 'Standing in the shower',
     'imageAlt': 'A woman wrapped in a towel, standing in a shower',
     'cardDescription': 'You perform the instillation yourself while standing with your knees slightly bent.'},
    {'id': 'partner', 'label': 'Partner-assisted',
     'imageAlt': 'A woman lying in bed with her partner sitting beside her',
     'cardDescription': 'You remain lying or slightly semi-reclined while your partner performs the instillation.'},
]
SAFETY_START = 'If you experience significant pain'
TIPS_TITLE = 'Practical tips from experienced users'

def strip_marks(s):
    return re.sub(r'[*_]', '', s).strip()

def heading_text(b):
    return re.sub(r'[\s.]+$', '', strip_marks(b['md']))

def nonempty(b):
    return b['kind'] == 'p' and (b['text'] or b['images'])

# ---- split document -------------------------------------------------------
idx_h1 = [i for i, b in enumerate(blocks) if b['kind'] == 'p' and b['style'] == 'Cmsor1']
assert len(idx_h1) == 3, idx_h1

# ---- overview -------------------------------------------------------------
title = strip_marks(next(b for b in blocks if b['kind'] == 'p' and b['style'] == 'Cm')['md'])
hub = [b for b in blocks[: idx_h1[0]] if nonempty(b) and b['style'] != 'Cm' and not b['images']]
paras = []
for b in hub:
    if b.get('list') == 'bullet':
        paras.append('- ' + b['md'])
    else:
        paras.append(b['md'])
# hub paragraphs in docx order: 3 intro paragraphs + list, practise, not-for-everyone, how-to-use
intro_end = max(i for i, l in enumerate(paras) if l.startswith('- '))
sections = {
    'intro': paras[: intro_end + 1],
    'practise': [paras[intro_end + 1]],
    'not-for-everyone': [paras[intro_end + 2]],
    'how-to-use': [paras[intro_end + 3]],
}
assert len(paras) == intro_end + 4, paras
def join_md(lines):
    out = []
    for l in lines:
        if out and not (l.startswith('- ') and out[-1].startswith('- ')):
            out.append('')
        out.append(l)
    return '\n'.join(out)
md = f'# {title}\n'
for k, v in sections.items():
    md += f'\n## {k}\n\n{fix(join_md(v), field="body")}\n'
(OUT / 'overview.md').write_text(md)

# ---- approaches -----------------------------------------------------------
class Lit(str):
    pass
def lit_rep(dumper, data):
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
yaml.add_representer(Lit, lit_rep)

bounds = idx_h1 + [len(blocks)]
for a, (start, end) in zip(APPROACHES, zip(bounds, bounds[1:])):
    seg = blocks[start:end]
    seo_title = strip_marks(seg[0]['md'])
    tbl_i = next(i for i, b in enumerate(seg) if b['kind'] == 'table')
    intro = [b['md'] for b in seg[1:tbl_i] if nonempty(b)]
    rows = seg[tbl_i]['rows']
    assert len(rows) == 8
    summary = []
    for r in rows:
        img = [im for p in r[0] for im in p['images']]
        txt = ' '.join(p['md'] for p in r[1] if p['text'])
        assert len(img) == 1 and img[0] in LABEL_IMAGES, img
        summary.append((LABEL_IMAGES[img[0]], txt))
    h2 = [i for i, b in enumerate(seg) if b['kind'] == 'p' and b['style'] == 'Cmsor2']
    assert len(h2) == 8, (a['id'], len(h2))
    steps, safety = [], None
    for n, (hs, he) in enumerate(zip(h2, h2[1:] + [len(seg)])):
        lines, tips, in_tips, num = [], None, False, 0
        for b in seg[hs + 1: he]:
            if b['kind'] != 'p' or not nonempty(b):
                continue
            if b['images']:
                for im in b['images']:
                    lines.append(f'[[figure:{FIGURES[im]}]]')
                continue
            if b['text'].startswith(SAFETY_START):
                safety = b['md']
                continue
            if b['italic'] and strip_marks(b['md']) == TIPS_TITLE:
                tips, in_tips = {'title': TIPS_TITLE, 'items': []}, True
                continue
            if in_tips and b.get('list') == 'bullet':
                tips['items'].append(b['md'])
                continue
            in_tips = False
            if b.get('list') and b['italic'] and b['level'] == 0:
                lines.append('### ' + strip_marks(b['md']))
                num = 0
            elif b.get('list') == 'decimal':
                num += 1
                lines.append(f'{num}. ' + b['md'])
            elif b.get('list'):
                lines.append('- ' + b['md'])
                num = 0
            elif b['italic']:
                lines.append('### ' + strip_marks(b['md']))
                num = 0
            else:
                lines.append(b['md'])
                num = 0
        body = []
        for l in lines:
            is_item = l.startswith('- ') or re.match(r'\d+\. ', l)
            prev_item = body and (body[-1].startswith('- ') or re.match(r'\d+\. ', body[-1]))
            if body and not (is_item and prev_item):
                body.append('')
            body.append(l)
        sid = STEP_IDS[n]
        step = {
            'id': sid,
            'label': fix(summary[n][0], a['id'], sid, 'label'),
            'title': fix(heading_text(seg[hs]), a['id'], sid, 'title'),
            'summary': fix(summary[n][1], a['id'], sid, 'summary'),
            'body': Lit(fix('\n'.join(body), a['id'], sid, 'body') + '\n'),
        }
        if tips:
            tips['items'] = [fix(t, a['id'], sid, 'body') for t in tips['items']]
            step['tips'] = tips
        steps.append(step)
    assert safety, a['id']
    data = {
        'id': a['id'],
        'label': a['label'],
        'seoTitle': seo_title,
        'cardTitle': seo_title,  # card title on the Self instillation page = the approach heading in the docx
        'cardDescription': a['cardDescription'],
        'image': f"/assets/patient/approach-{a['id']}.webp",
        'imageAlt': a['imageAlt'],
        'intro': Lit(fix('\n\n'.join(intro), a['id'], None, 'body') + '\n'),
        'safety': fix(safety, a['id'], None, 'body'),
        'steps': steps,
    }
    header = ('# Generated from the patient docx (tracked changes accepted); text is verbatim except the fixes in _workfiles/patient-source/corrections.yaml.\n'
              '# Edit here, then run `npm run content:build`.\n')
    (OUT / f"{a['id']}.yaml").write_text(header + yaml.dump(data, sort_keys=False, allow_unicode=True, width=100000))
unused = [c['find'] for c, n in zip(CORRECTIONS, used) if n == 0]
if unused:
    sys.exit('corrections that matched nothing: ' + '; '.join(unused))
print('ok; corrections applied:', sum(used))
