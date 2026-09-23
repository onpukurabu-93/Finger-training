let audioContext=null;
function initAudio(){
  if(!audioContext){
    audioContext=new(window.AudioContext||window.webkitAudioContext)();
  }
}
document.addEventListener('touchstart',initAudio,{once:true});
document.addEventListener('click',initAudio,{once:true});
const noteFreqR={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63};
const noteFreqL={C2:65.41,D2:73.42,E2:82.41,F2:87.31,G2:98,A2:110,B2:123.47,C3:130.81};
const melodyR=['C3','D3','E3','F3','G3','F3','E3','D3','C3'];
const melodyL=['C2','D2','E2','C2','D2','E2','G2','E2','D2','C2','D2','E2','C2','D2','E2','C2','D2','E2','G2','E2','D2','C2','D2','E2','C2'];
const fingerR={C3:1,D3:2,E3:3,F3:4,G3:5,A3:1,B3:2,C4:3};
const fingerL={C2:5,D2:4,E2:3,F2:5,G2:4,A2:3,B2:2,C3:1};
const noteNames={C2:'ド',D2:'レ',E2:'ミ',F2:'ファ',G2:'ソ',A2:'ラ',B2:'シ',C3:'ド',C3:'ド',D3:'レ',E3:'ミ',F3:'ファ',G3:'ソ',A3:'ラ',B3:'シ',C4:'ド'};
const colorsR=['#ff4444','#ff9500','#ffd700','#22c55e','#0ea5e9','#ff4444','#ff69b4','#667eea'];
const colorsL=['#0ea5e9','#0ea5e9','#667eea','#0ea5e9','#0ea5e9','#667eea','#ff69b4','#ff4444'];
let mode='right',rightCleared=false,leftCleared=false,isDemo=false,melodyIdx=0,currentMelody=[];
const overlay=document.getElementById('keyboard-overlay');

function createMarkers(){
  overlay.innerHTML='';
  const notes=mode==='right'?['C3','D3','E3','F3','G3','A3','B3','C4']:['C2','D2','E2','F2','G2','A2','B2','C3'];
  for(let i=0;i<8;i++){
    const m=document.createElement('div');
    m.className='key-marker';
    m.style.background='transparent';
    m.style.display='flex';
    m.style.alignItems='center';
    m.style.justifyContent='center';
    m.style.fontSize='28px';
    m.style.fontWeight='bold';
    m.style.color='white';
    m.style.textShadow='2px 2px 4px rgba(0,0,0,0.8)';
    m.textContent='';
    overlay.appendChild(m);
  }
}

function highlight(i){
  const markers=document.querySelectorAll('.key-marker');
  markers.forEach((m,j)=>{
    m.classList.toggle('highlight',i===j);
    if(i===j){
      const fm=mode==='right'?fingerR:fingerL;
      const notes=mode==='right'?['C3','D3','E3','F3','G3','A3','B3','C4']:['C2','D2','E2','F2','G2','A2','B2','C3'];
      m.textContent=fm[notes[i]];
    }else{
      m.textContent='';
    }
  });
}

function clearHL(){
  document.querySelectorAll('.key-marker').forEach(m=>{
    m.classList.remove('highlight');
    m.textContent='';
  });
}

function play(note,left){
  if(!audioContext)initAudio();
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
    if(p<12.5)return'C3
