"""Extract the patient docx (tracked changes accepted) into a structured JSON block list."""
import json, re, sys, zipfile
from lxml import etree

SRC = sys.argv[1]
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
ns = {'w': W, 'r': R, 'a': A}
z = zipfile.ZipFile(SRC)
doc = etree.fromstring(z.read('word/document.xml'))
rels = {r.get('Id'): r.get('Target') for r in etree.fromstring(z.read('word/_rels/document.xml.rels'))}

BOLD_STYLES = {'Ershivatkozs', 'Kiemels2', 'MegjegyzstrgyaChar'}
ITALIC_STYLES = {'Cmsor4Char', 'Cmsor6Char', 'Cmsor8Char', 'IdzetChar', 'Erskiemels', 'KiemeltidzetChar'}

numfmt = {}
num = etree.fromstring(z.read('word/numbering.xml'))
absfmt = {}
for a in num.findall('w:abstractNum', ns):
    absfmt[a.get(f'{{{W}}}abstractNumId')] = {
        l.get(f'{{{W}}}ilvl'): l.find('w:numFmt', ns).get(f'{{{W}}}val') for l in a.findall('w:lvl', ns)
    }
for n in num.findall('w:num', ns):
    numfmt[n.get(f'{{{W}}}numId')] = absfmt[n.find('w:abstractNumId', ns).get(f'{{{W}}}val')]

def on(el):
    return el is not None and el.get(f'{{{W}}}val') not in ('0', 'false')

def run_fmt(r):
    rpr = r.find('w:rPr', ns)
    b = i = False
    if rpr is not None:
        rs = rpr.find('w:rStyle', ns)
        sid = rs.get(f'{{{W}}}val') if rs is not None else None
        # Direct formatting wins over the character style (e.g. Strong style with b=0).
        be, ie = rpr.find('w:b', ns), rpr.find('w:i', ns)
        b = on(be) if be is not None else sid in BOLD_STYLES
        i = on(ie) if ie is not None else sid in ITALIC_STYLES
    return b, i

def para_runs(p):
    """(text, bold, italic) segments; deleted text excluded, inserted text included."""
    segs = []
    for r in p.iter(f'{{{W}}}r'):
        anc = r.getparent()
        skip = False
        while anc is not None and anc is not p:
            if etree.QName(anc).localname in ('del', 'moveFrom'):
                skip = True
            anc = anc.getparent()
        if skip:
            continue
        t = ''
        for ch in r:
            ln = etree.QName(ch).localname
            if ln == 't':
                t += ch.text or ''
            elif ln == 'tab':
                t += ' '
            elif ln == 'br':
                t += ' '
        if t:
            b, i = run_fmt(r)
            segs.append([t, b, i])
    merged = []
    for s in segs:
        if merged and merged[-1][1] == s[1] and merged[-1][2] == s[2]:
            merged[-1][0] += s[0]
        else:
            merged.append(s)
    return merged

def to_md(segs, ignore_italic=False):
    out = ''
    for t, b, i in segs:
        if not t.strip():
            out += t
            continue
        lead = t[: len(t) - len(t.lstrip())]
        trail = t[len(t.rstrip()):]
        core = t.strip()
        if b:
            core = f'**{core}**'
        if i and not ignore_italic:
            core = f'_{core}_'
        out += lead + core + trail
    out = re.sub(r'\*\*\s*\*\*', ' ', out)  # adjacent bold pieces split by a plain space run
    out = re.sub(r'[  ]+', ' ', out).strip()
    return out

def plain(segs):
    return re.sub(r'\s+', ' ', ''.join(s[0] for s in segs)).strip()

def all_italic(segs):
    txt = [s for s in segs if s[0].strip()]
    return bool(txt) and all(s[2] for s in txt)

def pinfo(p):
    ppr = p.find('w:pPr', ns)
    style, numid, lvl = '', None, None
    if ppr is not None:
        st = ppr.find('w:pStyle', ns)
        style = st.get(f'{{{W}}}val') if st is not None else ''
        npr = ppr.find('w:numPr', ns)
        if npr is not None:
            ni = npr.find('w:numId', ns)
            il = npr.find('w:ilvl', ns)
            numid = ni.get(f'{{{W}}}val') if ni is not None else None
            lvl = il.get(f'{{{W}}}val') if il is not None else '0'
    imgs = [rels[b.get(f'{{{R}}}embed')].split('/')[-1] for b in p.iter(f'{{{A}}}blip')]
    return style, numid, lvl, imgs

def block(p):
    style, numid, lvl, imgs = pinfo(p)
    segs = para_runs(p)
    b = {'style': style, 'images': imgs, 'text': plain(segs), 'md': to_md(segs), 'italic': all_italic(segs)}
    if numid and numid in numfmt:
        b['list'] = numfmt[numid].get(lvl or '0')
        b['level'] = int(lvl or 0)
    return b

out = []
for el in doc.find('w:body', ns):
    ln = etree.QName(el).localname
    if ln == 'p':
        out.append({'kind': 'p', **block(el)})
    elif ln == 'tbl':
        rows = []
        for tr in el.findall('w:tr', ns):
            cells = []
            for tc in tr.findall('w:tc', ns):
                cells.append([block(p) for p in tc.findall('w:p', ns)])
            rows.append(cells)
        out.append({'kind': 'table', 'rows': rows})
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
