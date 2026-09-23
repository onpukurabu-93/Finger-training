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

// 現在の指示（デモ再生中のみ）
let currentDemoIndex = 0;
let isDemoPlaying = false;

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

// 鍵盤をタップしたときの処理
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    const note = key.dataset.note;
    const finger = parseInt(key.dataset.finger);
    
    // 音を出す
    playNote(note);
    
    // 鍵盤のアニメーション
    key.classList.add('pressed');
    setTimeout(() => key.classList.remove('pressed'), 200);
    
    // 正解判定（デモ再生中のみ）
    if (isDemoPlaying) {
      const expectedFinger = parseInt(document.querySelector(`.key[data-note="${melody[currentDemoIndex]}"]`).dataset.finger);
      
      if (finger === expectedFinger) {
        // 正解
        document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
        document.querySelector(`.finger[data-finger="${finger}"]`).classList.add('correct');
        document.getElementById('message').textContent = '⭕️ せいかい！';
        document.getElementById('message').className = 'correct';
        
        currentDemoIndex++;
        
        // 曲が終わったら
        if (currentDemoIndex >= melody.length) {
          isDemoPlaying = false;
          document.getElementById('demo-btn').disabled = false;
          setTimeout(() => {
            document.getElementById('message').textContent = 'よくできました！🎵';
            document.getElementById('message').className = 'correct';
          }, 1000);
        }
      } else {
        // 間違い（でも❌は出さない）
        document.getElementById('message').textContent = 'つぎは ' + getFingerName(expectedFinger) + ' だよ';
        document.getElementById('message').className = 'wrong';
      }
    } else {
      // 自由練習モード
      document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
      document.querySelector(`.finger[data-finger="${finger}"]`).classList.add('correct');
      document.getElementById('message').textContent = getFingerName(finger) + ' で ひいたね！';
      document.getElementById('message').className = 'correct';
    }
  });
});

// 指の名前を取得
function getFingerName(finger) {
  const names = ['', 'おやゆび', 'ひとさしゆび', 'なかゆび', 'くすりゆび', 'こゆび'];
  return names[finger];
}

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
    const key = document.querySelector(`.key[data-note="${note}"]`);
    const finger = parseInt(key.dataset.finger);
    
    // 音を出す
    playNote(note);
    
    // 鍵盤のアニメーション
    key.classList.add('pressed');
    setTimeout(() => key.classList.remove('pressed'), 200);
    
    // 指のハイライト
    document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
    document.querySelector(`.finger[data-finger="${finger}"]`).classList.add('correct');
    
    document.getElementById('message').textContent = getFingerName(finger) + ' で ' + note;
    
    noteIndex++;
    setTimeout(playNextNote, 800);
  }
  
  playNextNote();
});

// 指もタップ可能に
document.querySelectorAll('.finger').forEach(finger => {
  finger.addEventListener('click', () => {
    const fingerNum = parseInt(finger.dataset.finger);
    document.querySelectorAll('.finger').forEach(f => f.classList.remove('correct', 'wrong'));
    finger.classList.add('correct');
    document.getElementById('message').textContent = getFingerName(fingerNum) + ' だね！';
    document.getElementById('message').className = 'correct';
  });
});
