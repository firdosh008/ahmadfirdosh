// UI sound without a single audio file. A pair of mp3s would be a licence to
// keep track of, ~30KB to fetch and a decode to schedule before the first
// blip lands; an oscillator and a gain envelope is the same two sounds for
// nothing, and they play the instant they're asked to.

const STORAGE_KEY = 'ui-sound';

let context = null;

// Built on first use, never at import: browsers refuse to start a context
// outside a user gesture, and one created early just arrives suspended with a
// resume to remember. Every caller here is already inside a gesture.
const audio = () => {
  const Ctor = window.AudioContext ?? window.webkitAudioContext;
  if (!Ctor) return null;

  context ??= new Ctor();
  if (context.state === 'suspended') context.resume();

  return context;
};

export const readMuted = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'off';
  } catch {
    // Private windows and blocked site data throw on access rather than
    // returning null. Sound on is the default, so that's what they get.
    return false;
  }
};

export const writeMuted = muted => {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'off' : 'on');
  } catch {
    // Nothing to do about it — the choice just won't survive the visit.
  }
};

// Frequency, length and level are the whole instrument. Sine, because a square
// or a saw at these lengths reads as a beep from a 1998 alert box.
const blip = (freq, duration, level) => {
  const ctx = audio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const at = ctx.currentTime;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, at);

  // A tick, not a tone: up in 4ms, gone by the end. Ramped from a hair above
  // zero rather than zero itself — exponentialRamp can't leave zero, and a
  // step into full gain is its own audible click.
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(level, at + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  osc.connect(env).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + duration);
};

// Hover is deliberately the quieter, shorter, higher of the two: it fires far
// more often, and at click's level it would be exhausting within a screen.
export const hoverSound = () => blip(1180, 0.045, 0.015);
export const clickSound = () => blip(520, 0.085, 0.05);
