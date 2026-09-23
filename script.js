// 音声の初期化
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 音階の周波数（1 オクターブ）
const noteFrequencies = {
  'C3': 130.81,  // ド（低）
  'D3': 146.83,  // レ
  'E3': 164.81,  // ミ
  'F3': 174.61,  // ファ
  'G3': 196.00,  // ソ
  'A3': 220.00,  // ラ
  'B3': 246.94,  // シ
  'C4': 261.63   // ド（高）
};

// チューリップの旋律（ドレミファソファミレド）
const melody = ['C4', 'D3', 'E3', 'F3', 'G3', 'F3', 'E3', 'D3', 'C4'];

// 右手の指番号マッピング
const fingerMapRight = {
  'C3': 1,  // ドは親指
  'D3': 2,  // レは人差し指
  'E3': 3,  // ミは中指
  'F3': 4,  // ファは薬指
  'G3': 5,  // ソは小指
  'A3': 1,  // ラは親指（持ち替え）
  'B3': 2,  // シは人差し指
  'C4': 3   // ド（高）は中指
};

// 左手の指番号マッピング（逆順）
const fingerMapLeft = {
  'C3': 5,  // ドは小指
  'D3': 4,  // レは薬指
  'E3': 3,  // ミは中指
  'F3': 2,  // ファは人差し指
  'G3': 1,  // ソは親指
  'A3': 5,  // ラは小指（持ち替え）
  'B3': 4,  // シは薬指
  'C4': 3   // ド（高）は中指
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
  
  // 画像の相対位置を計算（％）
  const relativeX = (x - rect.left) / imgWidth * 100;
  
  // 8 等分
  if (relativeX < 12.5) return 'C3';
  if (relativeX < 25) return 'D3';
  if (relativeX < 37.5) return 'E3';
  if (relativeX < 50) return 'F3';
  if (relativeX < 62.5) return 'G3';
  if (relativeX < 75) return 'A3';
  if (relativeX < 87.5) return 'B3';
  return 'C4';
}

// 指イラストをクリック
document.querySelectorAll('.finger').forEach(finger => {
  finger.addEventListener('click', () => {
    const fingerNum = parseInt(finger.dataset.finger);
    
    // 指を選択状態に
    document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
    finger.classList.add('correct');
    selectedFinger = fingerNum;
    
    document.getElementById('message').textContent = getFingerName(fingerNum) + ' を えらんだね！つぎは けんばんを タップしてね';
    document.getElementById('message').className = 'correct';
  });
});

// 画像クリック処理
document.getElementById('kaidan').addEventListener('click', (e) => {
  const note = getNoteFromClick(e.clientX);
  const fingerMap = currentMode === 'right' ? fingerMapRight : fingerMapLeft;
  const finger = fingerMap[note];
  
  // 音を出す
  playNote(note);
  
  // 指が選択されているかチェック
  if (selectedFinger !== null) {
    if (selectedFinger === finger) {
      // 指も鍵盤も正解
      document.getElementById('message').textContent = '⭕️ せいかい！' + getFingerName(finger) + ' で ' + note + '！';
      document.getElementById('message').className = 'correct';
      selectedFinger = null; // リセット
    } else {
      // 指が違う
      document.getElementById('message').textContent = 'ちがうよ〜 ' + getFingerName(finger) + ' だよ';
      document.getElementById('message').className = 'wrong';
      selectedFinger = null; // リセット
    }
  } else {
    // 自由練習モード
    document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
    document.querySelector(`.finger[data-finger="${finger}"]`).classList.add('correct');
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
  
  const fingerMap = currentMode === 'right' ? fingerMapRight : fingerMapLeft;
  let noteIndex = 0;
  
  function playNextNote() {
    if (noteIndex >= melody.length) {
      isDemoPlaying = false;
      document.getElementById('demo-btn').disabled = false;
      return;
    }
    
    const note = melody[noteIndex];
    const finger = fingerMap[note];
    
    // 音を出す
    playNote(note);
    
    // 指のハイライト
    document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
    document.querySelector(`.finger[data-finger="${finger}"]`).classList.add('correct');
    
    document.getElementById('message').textContent = getFingerName(finger) + ' で ' + note;
    
    noteIndex++;
    setTimeout(playNextNote, 800);
  }
  
  playNextNote();
});
