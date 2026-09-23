const audioContext=new(window.AudioContext||window.webkitAudioContext)();
const noteFreqR={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63};
const noteFreqL={C2:65.41,D2:73.42,E2:82.41,F2:87.31,G2:98,A2:110,B2:123.47,C3:130.81};
const melodyR=['C3','D3','E3','F3','G3','F3','E3','D3','C3'];
const melodyL=['C2','D2','E2','C2','D2','E2','G2','E2','D2','C2','D2','E2','C2','D2','E2','C2','D2','E2','G2','E2','D2','C2','D2','E2','C2'];
const fingerR={C3:1,D3:2,E3:3,F3:4,G3:5,A3:1,B3:2,C4:3};
const fingerL={C2:5,D2:4,E2:3,F2:5,G2:4,A2:3,B2:2,C3:1};
const noteNames={C2:'ド',D2:'レ',E2:'ミ',F2:'ファ',G2:'ソ',A2:'ラ',B2:'シ',C3:'ド',C3:'ド',D3:'レ',E3:'ミ',F3:'ファ',G3:'ソ',A3:'ラ',B3:'シ',C4:'ド'};
const colorsR=['#ff4444','#ff9500','#ffd700','#22c55e','#0ea5e9','#ff4444','#ff69b4','#667eea'];
const colorsL=['#0ea5e9','#0ea5e9','#667eea','#0ea5e9','#0ea5e9','#667eea','#ff69b4','#ff4444'];
let mode='right',rightCleared=false,leftCleared=false,selectedFinger=null,isDemo=false,melodyIdx=0,currentMelody=[];
const overlay=document.getElementById('keyboard-overlay');

function createMarkers(){
  overlay.innerHTML='';
  const colors=mode==='right'?colorsR:colorsL;
  const fm=mode==='right'?fingerR:fingerL;
  const notes=mode==='right'?['C3','D3','E3','F3','G3','A3','B3','C4']:['C2','D2','E2','F2','G2','A2','B2','C3'];
  for(let i=0;i<8;i++){
    const m=document.createElement('div');
    m.className='key-marker';
    m.style.background=colors[i];
    m.textContent=fm[notes[i]];
    overlay.appendChild(m);
  }
}

function highlight(i){document.querySelectorAll('.key-marker').forEach((m,j)=>m.classList.toggle('highlight',i===j));}
function clearHL(){document.querySelectorAll('.key-marker').forEach(m=>m.classList.remove('highlight'));}

function play(note,left){
  const osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.connect(gain);gain.connect(audioContext.destination);
  osc.type='sine';osc.frequency.value=left?noteFreqL[note]:noteFreqR[note];
  gain.gain.setValueAtTime(0.3,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+1);
  osc.start();osc.stop(audioContext.currentTime+1);
}

function getFingerName(f){return['','おやゆび','ひとさしゆび','なかゆび','くすりゆび','こゆび'][f];}

function getNote(x){
  const r=document.getElementById('kaidan').getBoundingClientRect(),p=(x-r.left)/r.width*100;
  if(mode==='right'){
    if(p<12.5)return'C3';if(p<25)return'D3';if(p<37.5)return'E3';if(p<50)return'F3';
    if(p<62.5)return'G3';if(p<75)return'A3';if(p<87.5)return'B3';return'C4';
  }else{
    if(p<12.5)return'C2';if(p<25)return'D2';if(p<37.5)return'E2';if(p<50)return'F2';
    if(p<62.5)return'G2';if(p<75)return'A2';if(p<87.5)return'B2';return'C3';
  }
}

document.getElementById('right-mode-btn').onclick=()=>{if(isDemo)return;mode='right';update();createMarkers();};
document.getElementById('left-mode-btn').onclick=()=>{if(isDemo||!rightCleared)return;mode='left';update();createMarkers();};

function update(){
  const rb=document.getElementById('right-mode-btn'),lb=document.getElementById('left-mode-btn');
  rb.classList.toggle('active',mode==='right');lb.classList.toggle('active',mode==='left');
  lb.classList.toggle('locked',!rightCleared);
}

document.getElementById('kaidan').onclick=e=>{
  if(isDemo)return;
  const note=getNote(e.clientX),fm=mode==='right'?fingerR:fingerL,f=fm[note],nn=noteNames[note];
  play(note,mode==='left');
  document.getElementById('message').textContent=getFingerName(f)+' で '+nn+'!';
  document.getElementById('message').className='correct';
};

document.getElementById('demo-btn').onclick=()=>{
  if(isDemo)return;
  currentMelody=mode==='right'?melodyR:melodyL;melodyIdx=0;isDemo=true;
  document.getElementById('demo-btn').disabled=true;
  function next(){
    if(melodyIdx>=currentMelody.length){
      isDemo=false;document.getElementById('demo-btn').disabled=false;clearHL();
      if(mode==='right'&&!rightCleared){rightCleared=true;update();document.getElementById('message').textContent='みぎて クリア!';}
      else if(mode==='left'&&!leftCleared){leftCleared=true;document.getElementById('message').textContent='ひだりて クリア!';}
      return;
    }
    const note=currentMelody[melodyIdx],fm=mode==='right'?fingerR:fingerL,f=fm[note],nn=noteNames[note];
    const notes=mode==='right'?['C3','D3','E3','F3','G3','A3','B3','C4']:['C2','D2','E2','F2','G2','A2','B2','C3'];
    highlight(notes.indexOf(note));
    play(note,mode==='left');
    document.getElementById('message').textContent=getFingerName(f)+' で '+nn;
    melodyIdx++;
    setTimeout(next,800);
  }
  next();
};

update();createMarkers();
