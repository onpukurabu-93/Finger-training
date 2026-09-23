// 音声の初期化
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 音階の周波数（ド〜ソ）
const noteFrequencies = {
  'C': 261.63,  // ド
  'D': 293.66,  // レ
  'E': 329.63,  // ミ
  'F': 349.23,  // ファ
  'G': 392.00   // ソ
};

// チューリップの旋律（ドレミファソファミレド）
const melody = ['C', 'D', 'E', 'F', 'G', 'F', 'E', 'D', 'C'];

// 指番号のマッピング
const fingerMap = {
  'C': 1,  // ドは親指
  'D': 2,  // レは人差し指
  'E': 3,  // ミは中指
  'F': 4,  // ファは薬指
  'G': 5   // ソは小指
};

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

// クリック位置から音符を判定
function getNoteFromClick(x) {
  const img = document.getElementById('kaidan');
  const rect = img.getBoundingClientRect();
  const imgWidth = rect.width;
  
  // 画像の相対位置を計算（％）
  const relativeX = (x - rect.left) / imgWidth * 100;
  
  // 仮の判定（画像の幅を 5 等分）
  if (relativeX < 20) return 'C';
  if (relativeX < 40) return 'D';
  if (relativeX < 60) return 'E';
  if (relativeX < 80) return 'F';
  return 'G';
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
    // 指を選択していない（自由練習モード）
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
