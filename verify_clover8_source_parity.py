#!/usr/bin/env python3
import json, re, hashlib, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
EXPECTED_SNAPSHOT_SHA='733511e151e123c3e7e7c648391aa00c8f751edee6db974a4e453c1bec1d6d1c'
EXPECTED_ANSWERS={
'1-(1)':'③ not being','1-(2)':'④ providing','1-(3)':'① scarcely','1-(4)':'① be seated','1-(5)':'④ with whom','1-(6)':'① I’d rather not','1-(7)':'① by','1-(8)':'① discuss','1-(9)':'② But for','1-(10)':'① as','1-(11)':'④ dividing','1-(12)':'② that','1-(13)':'③ Had he started at a younger age',
'2-(1)':'leave','2-(2)':'object','2-(3)':'turn','2-(4)':'left','2-(5)':'of',
'3-(1)':'doubled','3-(2)':'waste','3-(3)':'see / off','3-(4)':'ease','3-(5)':'bring',
'4-(1)':'② generally speak','4-(2)':'③ most precious','4-(3)':'① interesting','4-(4)':'③ when','4-(5)':'④ it was delivered','4-(6)':'③ four-years university','4-(7)':'② suggested me that',
'5-(1)':'This is the very thing that I have been looking for.','5-(2)':'Pictures and photos showing scenes from the past 100 years will go on display at the City Museum.','5-(3)':'I’d like a big one with cream on it.','5-(4)':'My troubles deprived me of sleep last night.','5-(5)':'In my opinion, you should avoid paying more tax than you need to.','5-(6)':'The pharmacist was worried about the patient’s health and got him to quit smoking.','5-(7)':'While training to become a dancer, she is having a hard time making ends meet.'}
EXPECTED_ORDER=list(EXPECTED_ANSWERS)
EXPECTED_ORDER_QUESTIONS={
'5-(1)':'This (looking / have / is / the / been / that / I / very / thing) for.',
'5-(2)':'(from / scenes / showing / and / the past 100 years / photos / pictures) will go on display at the City Museum.',
'5-(3)':'(a / with / it / on / I’d / one / big / like / cream).',
'5-(4)':'My (sleep / me / troubles / deprived / lost / of) last night. （1語不要）',
'5-(5)':'In my opinion, you (had better / more tax / paying / to / than / you need / should avoid). （1語(句)不要）',
'5-(6)':'The pharmacist (was / him / the patient’s / worried about / and / got / quit / health / to) smoking.',
'5-(7)':'While training to become a dancer, she (a / ends / hard / having / is / making / time) meet.'}

def load_js():
    s=(ROOT/'lesson-data.js').read_text(encoding='utf-8')
    m=re.search(r'window\.CLOVER_LESSON8\s*=\s*(\{.*\});\s*$',s,re.S)
    if not m: raise AssertionError('lesson-data.js parse failed')
    return json.loads(m.group(1))

def snapshot_from_data(o):
    fields=['id','key','section','sectionName','type','question','choices','answer','completed','translation']
    snap={'lessonId':o['id'],'itemCount':o['itemCount'],'items':[]}
    for i in o['items']:
        row={k:i.get(k) for k in fields}
        for k in ['subQuestions','translations','corrected']:
            if k in i: row[k]=i[k]
        snap['items'].append(row)
    return snap

def canon(x): return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))

def main():
    o=load_js()
    assert o['id']=='clover.lesson8'
    assert o['status']=='review', 'new lesson must remain review until explicit approval'
    assert o['itemCount']==37==len(o['items'])
    keys=[i['key'] for i in o['items']]
    assert keys==EXPECTED_ORDER, f'item order mismatch: {keys}'
    for i in o['items']:
        assert i['id']==f"clover.lesson8.{i['key']}"
        assert i['answer']==EXPECTED_ANSWERS[i['key']], f"answer mismatch {i['key']}: {i['answer']}"
        assert i.get('translation'), f"missing official translation {i['key']}"
        assert i.get('why'), f"missing explanation {i['key']}"
        assert i.get('decision'), f"missing decision rule {i['key']}"
        if i['type']=='choice':
            assert len(i.get('wrong',[]))==len(i.get('choices',[]))-1, f"wrong-choice analysis incomplete {i['key']}"
        if i['type']=='error':
            assert len(i.get('why',[]))>=2, f"error item must explain correction and remaining sections {i['key']}"
    for k,q in EXPECTED_ORDER_QUESTIONS.items():
        got=next(i for i in o['items'] if i['key']==k)['question']
        assert got==q, f'ordering problem source text mismatch {k}'
    snap=json.loads((ROOT/'source-snapshot.json').read_text(encoding='utf-8'))
    h=hashlib.sha256(canon(snap).encode()).hexdigest()
    assert h==EXPECTED_SNAPSHOT_SHA, f'source snapshot lock mismatch: {h}'
    assert snapshot_from_data(o)==snap, 'lesson data differs from source snapshot'
    print('OK: Clover Lesson 8 source parity / 37 items / answers / translations / wrong-answer coverage')
if __name__=='__main__':
    try: main()
    except Exception as e:
        print('FAIL:',e,file=sys.stderr);sys.exit(1)
