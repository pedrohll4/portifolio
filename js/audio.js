// ============================================================
// PedroOS - Synthesized Sound System (Web Audio API)
// Provides clean, non-intrusive sound effects without external audio files
// ============================================================

const PedroOSAudio = (function() {
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('pedroos_sound') === 'true'; // default muted

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!isSoundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  return {
    isEnabled: () => isSoundEnabled,
    toggleSound: () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('pedroos_sound', isSoundEnabled);
      if (isSoundEnabled) {
        initAudioContext();
        PedroOSAudio.playPop();
      }
      return isSoundEnabled;
    },
    setSound: (state) => {
      isSoundEnabled = !!state;
      localStorage.setItem('pedroos_sound', isSoundEnabled);
    },
    playClick: () => {
      playTone(600, 'sine', 0.04, 0.03);
    },
    playPop: () => {
      playTone(880, 'sine', 0.06, 0.04);
    },
    playOpenWindow: () => {
      if (!isSoundEnabled) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(now + 0.14);
      } catch (e) {}
    },
    playCloseWindow: () => {
      if (!isSoundEnabled) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.1);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(now + 0.12);
      } catch (e) {}
    },
    playBootChime: () => {
      if (!isSoundEnabled) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            playTone(freq, 'sine', 0.28, 0.05);
          }, idx * 110);
        });
      } catch (e) {}
    }
  };
})();

window.PedroOSAudio = PedroOSAudio;
