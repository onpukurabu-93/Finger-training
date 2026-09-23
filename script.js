　// 音声の初期化
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 音階の周波数（1 オクターブ）
const noteFrequencies = {
  'C3': 130.81,
  'D3': 146.83,
  'E3': 164.81,
  'F3': 174.61,
  'G3': 196.00,
  'A3': 220.00,
  'B3': 246.94,
  'C4': 261.63
};

// チューリップの旋律（ドレミファソファミレド）
const melody = ['C4', 'D3', 'E3', 'F3', 'G3', 'F3', 'E3', 'D3', 'C4'];

// 右手の指番号マッピング
const fingerMapRight = {
  'C3': 1,
  'D3': 2,
  'E3': 3,
  'F3': 4,
  'G3': 5,
  'A3': 1,
  'B3': 2,
  'C4': 3
};

// 現在のモード（'right' or 'left'）
let currentMode = 'right';

// 現在の指示（デモ再生中のみ）
let currentDemoIndex = 0;
let isDemoPlaying = false;

// 指選択状態
let selectedFinger = null;

// 音を鳴らす関数
function playNote(note) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(noteFrequencies[note], audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1);
}

// 指の名前を取得
function getFingerName(finger) {
  const names = ['', 'おやゆび', 'ひとさしゆび', 'なかゆび', 'くすりゆび', 'こゆび'];
  return names[finger];
}

// クリック位置から音符を判定（8 分割）
function getNoteFromClick(x) {
  const img = document.getElementById('kaidan');
  const rect = img.getBoundingClientRect();
  const imgWidth = rect.width;
  
  const relativeX = (x - rect.left) / imgWidth * 100;
  
  if (relativeX < 12.5) return 'C3';
  if (relativeX < 25) return 'D3';
  if (relativeX < 37.5) return 'E3';
  if (relativeX < 50) return 'F3';
  if (relativeX < 62.5) return 'G3';
  if (relativeX < 75) return 'A3';
  if (relativeX < 87.5) return 'B3';
  return 'C4';
}

// 指番号ガイドをクリック
document.querySelectorAll('.guide-number').forEach(guide => {
  guide.addEventListener('click', () => {
    const fingerNum = parseInt(guide.textContent);
    selectedFinger = fingerNum;
    
    document.querySelectorAll('.guide-number').forEach(g => {
      g.style.background = '#ff6b6b';
    });
    guide.style.background = '#4ecdc4';
    
    document.getElementById('message').textContent = getFingerName(fingerNum) + ' を えらんだね！つぎは けんばんを タップしてね';
    document.getElementById('message').className = 'correct';
  });
});

// 画像クリック処理
document.getElementById('kaidan').addEventListener('click', (e) => {
  const note = getNoteFromClick(e.clientX);
  const finger = fingerMapRight[note];
  
  playNote(note);
  
  if (selectedFinger !== null) {
    if (selectedFinger === finger) {
      document.getElementById('message').textContent = '⭕️ せいかい！' + getFingerName(finger) + ' で ' + note + '！';
      document.getElementById('message').className = 'correct';
      selectedFinger = null;
    } else {
      document.getElementById('message').textContent = 'ちがうよ〜 ' + getFingerName(finger) + ' だよ';
      document.getElementById('message').className = 'wrong';
      selectedFinger = null;
    }
  } else {
    document.getElementById('message').textContent = getFingerName(finger) + ' で ' + note + '！';
    document.getElementById('message').className = 'correct';
  }
});

// お手本演奏
document.getElementById('demo-btn').addEventListener('click', () => {
  if (isDemoPlaying) return;
  
  isDemoPlaying = true;
  currentDemoIndex = 0;
  document.getElementById('demo-btn').disabled = true;
  document.getElementById('message').textContent = 'お手本を ききます...';
  document.getElementById('message').className = '';
  
  let noteIndex = 0;
  
  function playNextNote() {
    if (noteIndex >= melody.length) {
      isDemoPlaying = false;
      document.getElementById('demo-btn').disabled = false;
      return;
    }
    
    const note = melody[noteIndex];
    const finger = fingerMapRight[note];
    
    playNote(note);
    document.getElementById('message').textContent = getFingerName(finger) + ' で ' + note;
    
    noteIndex++;
    setTimeout(playNextNote, 800);
  }
  
  playNextNote();
});
