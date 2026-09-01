
window.LessonAudio = window.LessonAudio || {
  speak(item, stage){
    if(!('speechSynthesis' in window)) return;
    const u=new SpeechSynthesisUtterance();
    u.lang='en-US'; u.rate=0.88;
    if(stage==='problem' || stage==='hint'){
      let t=item.problem.replace(/\([^)]*　[^)]*\)/g,' blank ').replace(/（[^）]*　[^）]*）/g,' blank ').replace(/①[^②\n]*/g,'').replace(/②[^③\n]*/g,'').replace(/③[^④\n]*/g,'').replace(/④[^⑤\n]*/g,'').replace(/⑤[^\n]*/g,'');
      u.text=t;
    } else if(stage==='backup') return;
    else u.text=item.answer.replace(/\s*\/\s*/g,'. ');
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
};
