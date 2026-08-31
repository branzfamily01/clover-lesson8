window.CLOVER_LESSON8_REFERENCES = {
  grammarMap: [
    {no:'01',name:'文型・SVOC',axis:'Vが何を要求するか / O=C',active:true,questions:['1-(4)','1-(8)','1-(10)','5-(6)']},
    {no:'02',name:'時制・進行形',axis:'いつ / 途中',active:true,questions:['3-(1)']},
    {no:'03',name:'完了形',axis:'基準時より前',active:true,questions:['1-(9)','1-(13)','3-(1)']},
    {no:'04',name:'助動詞',axis:'話し手の判断・態度',active:true,questions:['1-(6)','1-(13)']},
    {no:'05',name:'受動態',axis:'誰を主語にするか',active:true,questions:['1-(4)','2-(5)']},
    {no:'06',name:'不定詞',axis:'役割 / 誰がするか',active:true,questions:['1-(10)','5-(6)']},
    {no:'07',name:'分詞・分詞構文',axis:'能動/受動・同時/先行',active:true,questions:['1-(2)','1-(11)','4-(1)','4-(5)','5-(2)','5-(7)']},
    {no:'08',name:'比較',axis:'何と何を比べるか',active:true,questions:['4-(2)','5-(5)']},
    {no:'09',name:'関係詞',axis:'先行詞 + 関係節の空所',active:true,questions:['1-(5)','5-(1)']},
    {no:'10',name:'名詞',axis:'数え方・名詞の働き',active:true,questions:['2-(1)','2-(2)','3-(2)','4-(3)','4-(6)']},
    {no:'11',name:'代名詞・限定詞',axis:'何を代用・限定するか',active:true,questions:['3-(2)','5-(3)']},
    {no:'12',name:'話法',axis:'発話時点と報告時点',active:false,questions:[]},
    {no:'13',name:'否定',axis:'否定の範囲・準否定語',active:true,questions:['1-(1)','1-(3)','1-(6)']},
    {no:'14',name:'倒置',axis:'語順を変える条件',active:true,questions:['1-(13)']},
    {no:'15',name:'強調・it/that',axis:'焦点と復元',active:false,questions:[]},
    {no:'16',name:'名詞構文・同格',axis:'名詞の中身を文へ戻す',active:true,questions:['1-(12)']},
    {no:'17',name:'無生物主語',axis:'原因・条件を主語にする',active:true,questions:['5-(4)']},
    {no:'18',name:'語彙・語法',axis:'動詞・前置詞・定型表現',active:true,questions:['1-(7)','1-(8)','2-(1)〜(5)','3-(1)〜(5)','4-(7)']}
  ],
  cards: {
    gerund: {
      title:'動名詞：名詞として使う -ing', source:'正本解説 + Lesson 8補助整理',
      rules:['前置詞の後ろに動詞内容を置くときは -ing。','否定は not + -ing。','意味上の主語は所有格または目的格を -ing の前に置ける。','avoid / have a hard time など，動名詞を要求する語法は「動詞ごと」に確認する。'],
      check:'「前に何があるか」「誰がするか」「否定か」を順に見る。'
    },
    participle: {
      title:'分詞・分詞構文：主語関係を復元', source:'高校英文法 Visual Grammar 07 分詞・分詞構文',
      rules:['名詞修飾：名詞が動作する → -ing / 名詞が動作される → p.p.','分詞構文：意味上の主語 = 主節主語かを最初に確認。','主節より前の能動なら having + p.p.。','dangling participle（主語ずれ）を必ず点検する。'],
      check:'①誰がする？ ②能動/受動？ ③同時/先行？'
    },
    relative: {
      title:'関係詞：先行詞と「空所」をつなぐ', source:'高校英文法 Visual Grammar 09 関係詞',
      rules:['幹の文を完成 → 先行詞 → 説明文の重複部分を空所にする。','前置詞を関係詞の前へ出す正式な形では prep + whom / which。','前置詞の直後に that は置けない。','the very / the only など強い限定がある先行詞では that が好まれる。'],
      check:'関係節の中で「何が欠けているか」を先に探す。'
    },
    comparison: {
      title:'比較：比較対象の数と省略を読む', source:'高校英文法 Visual Grammar 08 比較',
      rules:['2者 → 比較級、3者以上の集合 → 最上級が基本。','the + 比較級 + of the two =「2つのうちより～な方」。','than 節では共通部分が省略されることがある。','more tax than you need to = than you need to (pay tax)。'],
      check:'まず「いくつを比べているか」を確定する。'
    },
    negation: {
      title:'否定：not だけでなく準否定語も見る', source:'高校英文法 Visual Grammar 13 否定',
      rules:['hardly / scarcely =「ほとんど～ない」。','scarcely any + 名詞 = almost no + 名詞。','否定は形だけでなく「どこまで否定しているか」を読む。'],
      check:'否定語・準否定語を見つけ，後ろの any / ever などとの組合せを見る。'
    },
    inversion: {
      title:'倒置：if省略なら Had / Were / Should が前へ', source:'高校英文法 Visual Grammar 14 倒置',
      rules:['If S had p.p. → Had S p.p.','これは疑問文ではなく，書き言葉の条件節。','主節の would/might/could have p.p. と時間関係を対応させる。'],
      check:'元の if節に戻せるかを確認する。'
    },
    apposition: {
      title:'同格 that：名詞の「中身」を述べる', source:'高校英文法 Visual Grammar 16 名詞構文・同格',
      rules:['the possibility that S V =「S V という可能性」。','同格thatの後ろは基本的に完全文。','関係代名詞thatは節内に名詞要素の空所を持つ。','fact / idea / news / belief / hope / possibility などは命題内容を取りやすい。'],
      check:'that節が「名詞の中身」か，「名詞を修飾する空所つき節」かを区別する。'
    },
    inanimate: {
      title:'無生物主語：原因を主語にする英語', source:'高校英文法 Visual Grammar 17 無生物主語',
      rules:['まず英語のS-V-Oをそのまま解析する。','直訳を作ってから，自然な日本語では人主語へ戻してよい。','deprive A of B =「AからBを奪う」。My troubles を原因主語にできる。'],
      check:'英語の主語を勝手に日本語の「私」に置き換えず，構造を先に取る。'
    },
    svoc: {
      title:'SVOC：O と C の小さな文を作る', source:'高校英文法 Visual Grammar 01 文型・SVOC',
      rules:['get + O + to do：O does do の関係。','leave + O + 状態：O = / is C の状態を残す。','Cの形は動詞の語法で決まる。'],
      check:'O と C の間に「OがCする / OがCである」を復元する。'
    },
    verbpattern: {
      title:'語法：日本語訳より「動詞が何を取るか」', source:'正本解説 + Visual Grammar 01/18 の考え方',
      rules:['discuss + 目的語（about不要）。','seat + 人 / be seated。','suggest to A that S + 原形。','rob A of B / see A off / object to A など前置詞ごと覚える。'],
      check:'動詞の後ろを「目的語直結 / 前置詞 / to do / -ing」で分類する。'
    },
    modal: {
      title:'助動詞・準助動詞：後ろの形を固定', source:'高校英文法 Visual Grammar 04 助動詞 + 正本解説',
      rules:['would rather + 原形。','否定は would rather not + 原形。','feel like は + -ing、prefer not は + to do と，似た日本語でも後ろの形が違う。'],
      check:'意味だけでなく「後ろに何の形が来るか」で選択肢を切る。'
    },
    conditional: {
      title:'仮定法：現実との差を時間で読む', source:'正本解説 + Visual Grammar 14 倒置',
      rules:['but for + 名詞 =「～がなかったならば」。','過去の反事実：would / could / might have + p.p.。','If it had not been for ... と書き換えて確認できる。'],
      check:'主節の助動詞 + have p.p. を先に見つける。'
    },
    pronoun: {
      title:'one：同じ種類の名詞を繰り返さない', source:'正本解説（代名詞 one）',
      rules:['one は「不特定の1つ」を代用する。','a big one = a big + 前に話題の名詞。','one の後ろに with ... などの説明を足せる。'],
      check:'one が具体的に何の代わりかを補って読む。'
    }
  }
};
