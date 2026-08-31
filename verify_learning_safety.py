#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def load_data():
 s=(ROOT/'lesson-data.js').read_text(encoding='utf-8');m=re.search(r'=\s*(\{.*\});\s*$',s,re.S);return json.loads(m.group(1))
def norm(s):return re.sub(r'^[①②③④⑤]\s*','',s or '').strip().lower()
def main():
 o=load_data()
 for i in o['items']:
  a=norm(i.get('answer',''))
  for n,h in enumerate(i.get('hints',[]),1):
   # Exact answer leakage is disallowed; long-sentence ordering answers are naturally absent from generic hints.
   assert not (a and len(a)>=4 and a in h.lower()), f'answer leakage in hint {i["key"]} Hint {n}'
 enhance=(ROOT/'lesson8-enhance.js').read_text(encoding='utf-8')
 assert "(stage==='problem'||stage.startsWith('hint'))" in enhance
 assert "i.subQuestions?.length?i.subQuestions.join('. '):i.question" in enhance
 # Back Up Technique must advance hiddenCount by exactly one, never jump to total.
 assert 'backupHiddenCount++' in enhance
 assert 'backupHiddenCount=total' not in enhance and 'backupHiddenCount+=total' not in enhance
 assert "ps.length-backupHiddenCount" in enhance
 print('OK: hints have no exact-answer leakage / Stage 0 audio uses problem text / Back Up increments one phrase')
if __name__=='__main__':
 try:main()
 except Exception as e:print('FAIL:',e,file=sys.stderr);sys.exit(1)
