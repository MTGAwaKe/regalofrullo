/**
 * A tiny, original party-tune loop synthesized with the Web Audio API — no
 * external audio file to host or license. Melody + soft bass, looped
 * forever once started, with an optional "flourish" for celebration
 * moments (confetti bursts).
 */

const NOTE_FREQS: Record<string, number> = {
  G2: 98.0,
  A2: 110.0,
  C3: 130.81,
  G3: 196.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  C6: 1046.5,
};

const MELODY = ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'D4', 'G4'];
const BASS: { step: number; note: string }[] = [
  { step: 0, note: 'C3' },
  { step: 4, note: 'G3' },
];
const STEP_SECONDS = 0.22;
const LOOP_SECONDS = STEP_SECONDS * MELODY.length;
const FLOURISH = ['C5', 'D5', 'E5', 'G5'];

type Prefs = { muted: boolean; volume: number };

const PREFS_KEY = 'regalofrullo:audio';

export function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return { muted: false, volume: 0.5 };
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return { muted: false, volume: 0.5 };
    const parsed = JSON.parse(raw);
    return {
      muted: Boolean(parsed.muted),
      volume: typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : 0.5,
    };
  } catch {
    return { muted: false, volume: 0.5 };
  }
}

export function savePrefs(prefs: Prefs) {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

class BackgroundMusic {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private playing = false;
  private loopTimer: ReturnType<typeof setTimeout> | null = null;
  private targetVolume = 0;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Must be called from within a user-gesture handler the first time. */
  start(initialVolume: number) {
    const ctx = this.ensureContext();
    this.targetVolume = initialVolume;
    if (ctx.state === 'suspended') ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.masterGain!.gain.setValueAtTime(initialVolume, ctx.currentTime);
    this.scheduleLoop(ctx.currentTime + 0.05);
  }

  setVolume(v: number) {
    this.targetVolume = v;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.06);
    }
  }

  private scheduleLoop(startTime: number) {
    if (!this.playing || !this.ctx) return;
    MELODY.forEach((note, i) => {
      this.playNote(NOTE_FREQS[note], startTime + i * STEP_SECONDS, STEP_SECONDS * 0.85, 'square', 0.22);
    });
    BASS.forEach(({ step, note }) => {
      this.playNote(NOTE_FREQS[note], startTime + step * STEP_SECONDS, STEP_SECONDS * 3.4, 'triangle', 0.2);
    });
    const delayMs = LOOP_SECONDS * 1000;
    this.loopTimer = setTimeout(() => this.scheduleLoop(startTime + LOOP_SECONDS), delayMs - 80);
  }

  /** A quick ascending flourish layered on top of the loop, for confetti moments. */
  flourish() {
    if (!this.ctx || !this.masterGain) return;
    const start = this.ctx.currentTime + 0.02;
    FLOURISH.forEach((note, i) => {
      this.playNote(NOTE_FREQS[note], start + i * 0.09, 0.22, 'triangle', 0.3);
    });
  }

  /** A short cheerful "ding" for a correct answer / found match / solved puzzle. */
  playCorrect() {
    if (!this.ctx || !this.masterGain) return;
    const start = this.ctx.currentTime + 0.01;
    this.playNote(NOTE_FREQS.E5, start, 0.12, 'triangle', 0.28);
    this.playNote(NOTE_FREQS.C6, start + 0.09, 0.16, 'triangle', 0.26);
  }

  /** A short low buzz for a wrong answer. */
  playWrong() {
    if (!this.ctx || !this.masterGain) return;
    const start = this.ctx.currentTime + 0.01;
    this.playNote(NOTE_FREQS.A2, start, 0.16, 'sawtooth', 0.18);
  }

  /** A tiny neutral click — a maze wall bump, a tile that can't move, etc. */
  playTick() {
    if (!this.ctx || !this.masterGain) return;
    this.playNote(NOTE_FREQS.C6, this.ctx.currentTime + 0.005, 0.05, 'square', 0.12);
  }

  private playNote(freq: number, time: number, dur: number, type: OscillatorType, peak: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(gain).connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }
}

let instance: BackgroundMusic | null = null;

export function getBackgroundMusic(): BackgroundMusic {
  if (!instance) instance = new BackgroundMusic();
  return instance;
}
