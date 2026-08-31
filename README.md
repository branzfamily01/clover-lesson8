# Clover Lesson 8

高校英語教材 **Clover Lesson 8** の授業用インタラクティブHTMLです。

## Entry points

- `index.html` — 教師授業用。問題進行・Grammar Map・音声・授業メモを含む。
- `student-index.html` — 生徒用。教師用機能を読み込まない positive allowlist 構成。

## 授業UX

問題 → Hint → Check → Why? → 誤答分析 → Meaning → 文法整理 → 必要な問題だけ Output の順で進みます。

- 37問を正本の順番で収録。
- 選択問題は不正解選択肢ごとに理由を表示。
- 誤文訂正は、誤りの訂正だけでなく、残りの下線部が正しい理由も確認。
- Grammar Map は高校英文法18領域の中で Lesson 8 が使う場所を問題番号付きで表示。
- 情報量が多い画面は画面外へクリップせず、ステージ内部だけをスクロール。
- Back Up Technique は **1回の操作で1フレーズだけ** 文末側から隠す。全文一括非表示にはしない。
- 問題・Hint段階の英語音声は問題文だけを読み、空所を `blank` として扱う。完成英文は Check 後のみ読み上げる。

## 進度

`?year=2026&class=1A&resume=1` のように開くと、年度 × クラス × Lesson ごとに localStorage へ進度を保持します。

## Status

`review`

実物確認後に明示的な承認があるまで `ready` へ変更しません。

## Validation

```bash
node --check lesson-data.js
node --check lesson-references.js
node --check lesson8-learning.js
node --check lesson8-enhance.js
node --check teacher-tools.js
python verify_clover8_source_parity.py
python verify_student_export.py
python verify_learning_safety.py
python verify_layout_contract.py
```

GitHub Actions でも同じ検証を行います。

## GitHub Pages

リポジトリ名は `clover-lesson8` を推奨します。

ZIPをGitHubへ置くのではなく、**ZIPを解凍して出てきた中身をリポジトリのルートへそのままアップロード**してください。公開起点は `index.html` です。
