#!/usr/bin/env python3
from pathlib import Path
import re, sys, json
ROOT=Path(__file__).resolve().parent

def main():
    css=(ROOT/'lesson8.css').read_text(encoding='utf-8')
    js=(ROOT/'lesson8-enhance.js').read_text(encoding='utf-8')
    # The toolbar is a normal grid row, never an overlay covering lesson content.
    for token in ['.app-shell{height:100dvh','grid-template-rows:minmax(0,1fr) auto','.stage{min-height:0;overflow:hidden','.stage-scroll{height:100%;min-height:0;overflow:auto']:
        assert token in css, f'missing anti-overflow contract: {token}'
    assert '.toolbar{min-height:' in css
    assert 'position:fixed' not in re.search(r'\.toolbar\{[^}]+\}',css).group(0), 'toolbar must not cover content'
    # Long content is wrapped and scrolls inside the stage.
    assert 'overflow-wrap:anywhere' in css
    assert 'white-space:pre-line' in css
    # Back Up outputs must be genuine phrase segmentation, not a one-sentence single chunk.
    data=(ROOT/'lesson-data.js').read_text(encoding='utf-8')
    obj=json.loads(re.search(r'=\s*(\{.*\});\s*$',data,re.S).group(1))
    outputs=[i for i in obj['items'] if i.get('output')]
    assert outputs, 'no Back Up Technique items'
    for i in outputs:
        phrases=i['output']['phrases']
        assert len(phrases)>=3, f'{i["key"]}: Back Up must have multiple phrases'
        assert all(p.strip() for p in phrases), f'{i["key"]}: empty phrase'
        assert not (len(phrases)==1 and phrases[0].strip()==i['completed'].strip()), f'{i["key"]}: whole sentence used as one phrase'
    assert 'backupHiddenCount++' in js and 'ps.length-backupHiddenCount' in js
    print(f'OK: viewport containment contract / internal scrolling / {len(outputs)} phrase-segmented Back Up items')
if __name__=='__main__':
    try: main()
    except Exception as e: print('FAIL:',e,file=sys.stderr);sys.exit(1)
