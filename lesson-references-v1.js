window.LESSON_REFERENCES={
  title:'Clover Lesson 8 — Grammar & Usage Map',
  subtitle:'ばらばらに見える問題を「形 → 役割 → 意味 → 文脈」で整理する。',
  sections:[
    {
      title:'0. 全体地図',type:'map',lead:'まず「何の問題か」を当てにいかず、文のどこで判断するかを決めよう。',
      groups:[
        {lesson:true,title:'準動詞',items:['動名詞','分詞','分詞構文','to do / -ing'],note:'名詞・形容詞・副詞のどの役割かを見る。'},
        {lesson:true,title:'節・関係',items:['前置詞 + whom','同格 that','in that','関係節'],note:'空所の前後を元の2文・節に戻して考える。'},
        {lesson:true,title:'否定・仮定',items:['scarcely / hardly','But for','Had S p.p.'],note:'見た目の否定語だけでなく、文全体の意味と時制を見る。'},
        {lesson:true,title:'比較',items:['of the two','the + 比較級'],note:'比較する数が2つか3つ以上かを先に見る。'},
        {lesson:true,title:'語法',items:['discuss + O','be seated','deprive A of B','suggest to A that'],note:'日本語訳ではなく、動詞が要求する形で判断する。'},
        {lesson:true,title:'語順',items:['S/V/O/C','固定表現','修飾語'],note:'単語を訳順に並べず、骨格→かたまりの順で組み立てる。'}
      ]
    },
    {
      title:'1. 準動詞',type:'branch',lead:'-ing / p.p. / to do は、まず文中の役割を見る。',
      rows:[
        {head:'動名詞',core:'名詞の役割',branches:['前置詞 + -ing','not + -ing','意味上の主語 + -ing']},
        {head:'分詞',core:'名詞を説明',branches:['doing = 能動・進行','p.p. = 受動・完了','名詞との関係を確認']},
        {head:'分詞構文',core:'主節全体を説明',branches:['主節の主語と一致','時が前なら Having + p.p.','ぶら下がり分詞に注意']}
      ]
    },
    {
      title:'2. 節・関係',type:'flow',lead:'関係詞は「元の2文」を復元すると見抜きやすい。',
      nodes:['先行詞を確認','→','後ろの節で欠けている役割','→','必要なら前置詞を戻す','→','関係詞を決める']
    },
    {
      title:'3. 否定・仮定',type:'compare',lead:'似た形ほど、意味と時間関係で分ける。',
      columns:[
        {badge:'NEGATION',title:'scarcely / hardly',body:'「ほとんど〜ない」。any と自然に結びつく。',meaning:'scarcely any = almost no'},
        {badge:'CONDITION',title:'But for / Had S p.p.',body:'現実と反対の条件や過去の反実仮想を表す。',meaning:'if を省略すると倒置が起こる'}
      ]
    },
    {
      title:'4. 比較・数量',type:'matrix',lead:'比較問題では、まず「何個を比べているか」を見る。',
      headers:['見る場所','2つ','3つ以上'],
      rows:[['基本','比較級','最上級'],['例','the more precious of the two','the most precious of the three'],['判断','of the two が手がかり','of all / in the group など']]
    },
    {
      title:'5. 語法',type:'matrix',lead:'語法は「日本語では言えそう」ではなく、その動詞が取れる形で判断する。',
      headers:['表現','正しい型','注意'],
      rows:[
        ['discuss','discuss + O','about を足さない'],
        ['seat','be seated','seat は基本的に他動詞'],
        ['deprive','deprive A of B','AからBを奪う'],
        ['suggest','suggest to A that ...','suggest A that ... としない'],
        ['avoid','avoid doing','to do ではなく -ing']
      ]
    },
    {
      title:'6. 語順',type:'flow',lead:'整序は訳順ではなく、英語の骨格から作る。',
      nodes:['S / V を作る','→','O / C を置く','→','熟語をかたまりで置く','→','修飾語をつなぐ','→','不要語を確認']
    }
  ]
};
