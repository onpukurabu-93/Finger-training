const keys = document.querySelectorAll('.key');
const message = document.getElementById('message');
const startBtn = document.getElementById('startBtn');

let noteIndex = 0;
let isRightHand = true;

// 右手モードの音符
const rightHandNotes = [
    { note: 'C3', finger: 1 },
    { note: 'C3', finger: 1 },
    { note: 'G3', finger: 5 },
    { note: 'G3', finger: 5 },
    { note: 'A3', finger: 5 },
    { note: 'A3', finger: 5 },
    { note: 'G3', finger: 5 },
    { note: 'F3', finger: 4 },
    { note: 'F3', finger: 4 },
    { note: 'E3', finger: 3 },
    { note: 'E3', finger: 3 },
    { note: 'D3', finger: 2 },
    { note: 'D3', finger: 2 },
    { note: 'C3', finger: 1 }
];

// 左手モードの音符
const leftHandNotes = [
    { note: 'C3', finger: 5 },
    { note: 'E3', finger: 3 },
    { note: 'G3', finger: 1 },
    { note: 'C4', finger: 1 },
    { note: 'G3', finger: 1 },
    { note: 'E3', finger: 3 },
    { note: 'C3', finger: 5 }
];

// 鍵盤の音階
const notes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];

// 音を出す
function play(note) {
    const audio = new Audio(`https://cdn.jsdelivr.net/gh/tony-sfc/keyboard-sounds@1.0.0/${note.toLowerCase()}.mp3`);
    audio.play();
}

// 鍵盤を光らせる
function highlight(note, isRightHand) {
    const keyIndex = notes.indexOf(note);
    if (keyIndex >= 0 && keyIndex < keys.length) {
        const key = keys[keyIndex];
        key.style.backgroundColor = 'yellow';
        setTimeout(() => {
            key.style.backgroundColor = isRightHand ? '#f0f0f0' : '#e0e0e0';
        }, 500);
    }
}

// 数字を鍵盤の下段に表示
function updateDisplay(note, finger, isRightHand) {
    message.textContent = `おやゆび で ド`;
    message.style.color = 'red';
    
    const keyIndex = notes.indexOf(note);
    if (keyIndex >= 0 && keyIndex < keys.length) {
        const key = keys[keyIndex];
        const numSpan = key.querySelector('.number');
        if (numSpan) {
            numSpan.textContent = finger;
            numSpan.style.display = 'inline';
        }
    }
}

// 右手モードの演奏
function playRightHand() {
    if (noteIndex < rightHandNotes.length) {
        const { note, finger } = rightHandNotes[noteIndex];
        play(note);
        highlight(note, true);
        updateDisplay(note, finger, true);
        noteIndex++;
        setTimeout(playRightHand, 1000);
    } else {
        // 右手モード終了、左手モードへ
        noteIndex = 0;
        isRightHand = false;
        message.textContent = '左手モード';
        message.style.color = 'blue';
        setTimeout(playLeftHand, 2000);
    }
}

// 左手モードの演奏
function playLeftHand() {
    if (noteIndex < leftHandNotes.length) {
        const { note, finger } = leftHandNotes[noteIndex];
        play(note);
        highlight(note, false);
        updateDisplay(note, finger, false);
        noteIndex++;
        setTimeout(playLeftHand, 1000);
    } else {
        // 終了
        message.textContent = '終了！';
        message.style.color = 'green';
    }
}

//
