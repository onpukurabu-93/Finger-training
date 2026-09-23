// 音声の初期化
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 音階の周波数（右手：1 オクターブ）
const noteFrequenciesRight = {
  'C3': 130.81,
  'D3': 146.83,
  'E3': 164.81,
  'F3': 174.61,
  'G3': 196.00,
  'A3': 220.00,
  'B3': 246.94,
  'C4': 261.63
};

// 音階の周波数（左手：1 オクターブ低い）
const noteFrequenciesLeft = {
  'C2': 65.41,
  'D2': 73.42,
  'E2': 82.41,
  'F2': 87.31,
  'G2': 98.00,
  'A2': 110.00,
  'B2': 123.47,
  'C3': 130.81
};

// チューリップの旋律（ドレミファソファミレド）- C3 開始
const melodyRight = ['C3', 'D3', 'E3', 'F3', 'G3', 'F3', 'E3', 'D3', 'C3'];
const melodyLeft = ['C2', 'D2', 'E2', 'F2', 'G2', 'F2', 'E2', 'D2', 'C2'];

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

// 左手の指番号マッピング（逆順）
const fingerMapLeft = {
  'C2': 5,
  'D2': 4,
  'E2': 3,
  'F2': 2,
  'G2': 1,
  'A2': 5,
  'B2': 4,
  'C3': 3
};

// ドレミ表示
const noteNames = {
  'C2': 'ド', 'D2': 'レ', 'E2': 'ミ', 'F2': 'ファ', 'G2': 'ソ', 'A2': 'ラ', 'B2': 'シ', 'C3': 'ド',
  'C3': 'ド', 'D3': 'レ', 'E3': 'ミ', 'F3': 'ファ', 'G3': 'ソ', 'A3': 'ラ', 'B3': 'シ', 'C4': 'ド'
};

// 現在のモード（'right' or 'left'）
let currentMode = 'right';

// 指選択状態
let selectedFinger = null;

// 指の色（右手）
const fingerColorsRight = ['#ff6b6b', '#ffa500', '#ffd700', '#4ecdc4', '#45b7d1'];
// 指の色（左手）
const fingerColorsLeft = ['#4ecdc4', '#45b7d1', '#667eea', '#ff69b4', '#ff6b6b'];

// 音を鳴らす関数
function playNote(note, isLeft) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  const freq = isLeft ? noteFrequenciesLeft[note] : noteFrequenciesRight[note];
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  
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
  
  if (currentMode === 'right') {
    if (relativeX < 12.5) return 'C3';
    if (relativeX < 25) return 'D3';
    if (relativeX < 37.5) return 'E3';
    if (relativeX < 50) return 'F3';
    if (relativeX < 62.5) return 'G3';
    if (relativeX < 75) return 'A3';
    if (relativeX < 87.5) return 'B3';
    return 'C4';
  } else {
    if (relativeX < 12.5) return 'C2';
    if (relativeX < 25) return 'D2';
    if (relativeX < 37.5) return 'E2';
    if (relativeX < 50) return 'F2';
    if (relativeX < 62.5) return 'G2';
    if (relativeX < 75) return 'A2';
    if (relativeX < 87.5) return 'B2';
    return 'C3';
  }
}

// 指番号ガイドをクリック
document.querySelectorAll('.guide-item').forEach(guide => {
  guide.addEventListener('click', () => {
    const fingerNum = parseInt(guide.querySelector('.guide-number').textContent);
    selectedFinger = fingerNum;
    
    document.querySelectorAll('.guide-number').forEach(g => {
      if (currentMode === 'right') {
        g.style.background = fingerColorsRight[parseInt(g.textContent) - 1];
      } else {
        g.style.background = fingerColorsLeft[parseInt(g.textContent) - 1];
      }
    });
    
    if (currentMode === 'right') {
      guide.querySelector('.guide-number').style.background = fingerColorsRight[fingerNum - 1];
    } else {
      guide.querySelector('.guide-number').style.background = fingerColorsLeft[fingerNum - 1];
    }
    
    document.getElementById('message').textContent = getFingerName(fingerNum) + ' を えらんだね！つぎは けんばんを タップしてね';
    document.getElementById('message').className = 'correct';
  });
});

// 画像クリック処理
document.getElementById('kaidan').addEventListener('click', (e) => {
  const note = getNoteFromClick(e.clientX);
  const finger = currentMode === 'right' ? fingerMapRight[note] : fingerMapLeft[note];
  const noteName = noteNames[note];
  
  playNote(note, currentMode === 'left');
  
  if (selectedFinger !== null) {
    if (selectedFinger === finger) {
      document.getElementById('message').textContent = '⭕️ せいかい！' + getFingerName(finger) + ' で ' + noteName + '！';
      document.getElementById('message').className = 'correct';
      selectedFinger = null;
    } else {
      document.getElementById('message').textContent = 'ちがうよ〜 ' + getFingerName(finger) + ' だよ';
      document.getElementById('message').className = 'wrong';
      selectedFinger = null;
    }
  } else {
    document.getElementById('message').textContent = getFingerName(finger) + ' で ' + noteName + '！';
    document.getElementById('message').className = 'correct';
  }
});

// お手本演奏
document.getElementById('demo-btn').addEventListener('click', () => {
  const melody = currentMode === 'right' ? melodyRight : melodyLeft;
  let noteIndex = 0;
  
  document.getElementById('demo-btn').disabled = true;
  document.getElementById('message').textContent = 'お手本を ききます...';
  document.getElementById('message').className = '';
  
  function playNextNote() {
    if (noteIndex >= melody.length) {
      document.getElementById('demo-btn').disabled = false;
      return;
    }
    
    const note = melody[noteIndex];
    const finger = currentMode === 'right' ? fingerMapRight[note] : fingerMapLeft[note];
    const noteName = noteNames[note];
    
    playNote(note, currentMode === 'left');
    document.getElementById('message').textContent = getFingerName(finger) + ' で ' + noteName;
    
    noteIndex++;
    setTimeout(playNextNote, 800);
  }
  
  playNextNote();
});
