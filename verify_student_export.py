#!/usr/bin/env python3
import json, re, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
FORBIDDEN_TEXT=['teacher-tools','Teacher Panel','Teacher Guide','teaching.v1','source-lock','Bridge','Developer','Internal','Schema','教師用授業メモ','clover.teacher.']
def main():
    cfg=json.loads((ROOT/'student-export.json').read_text(encoding='utf-8'))
    allow=cfg['allowlist']
    assert cfg['entry']=='student-index.html'
    for name in allow:
        p=ROOT/name; assert p.exists(), f'missing student file: {name}'
        text=p.read_text(encoding='utf-8',errors='ignore')
        for bad in FORBIDDEN_TEXT:
            assert bad not in text, f'forbidden student content {bad!r} in {name}'
    html=(ROOT/'student-index.html').read_text(encoding='utf-8')
    refs=re.findall(r'(?:src|href)="([^"]+)"',html)
    local=[x.split('?',1)[0].split('#',1)[0] for x in refs if not re.match(r'^[a-z]+:',x) and not x.startswith('#')]
    assert set(local).issubset(set(allow)), f'student HTML references non-allowlisted files: {set(local)-set(allow)}'
    assert 'teacherOverlay' not in html and 'teacher-tools.js' not in html
    print('OK: Student Export positive allowlist / teacher data excluded')
if __name__=='__main__':
    try: main()
    except Exception as e: print('FAIL:',e,file=sys.stderr);sys.exit(1)
