'use client';

import { useEffect, useRef, useState } from 'react';
import { getBackgroundMusic, loadPrefs, savePrefs } from './backgroundMusic';

/**
 * Wires the synthesized background loop to persisted mute/volume prefs and
 * starts it on the first tap/click anywhere (autoplay policies require a
 * user gesture) — the engine stays silent at 0 gain until then if muted.
 */
export function useBackgroundMusic() {
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const startedRef = useRef(false);

  // Load persisted prefs once we're on the client. Reading localStorage
  // during render (e.g. in a lazy useState initializer) would embed one
  // value in the static prerendered HTML and a possibly different one on
  // the client, so this intentionally happens post-mount instead.
  useEffect(() => {
    const prefs = loadPrefs();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMuted(prefs.muted);
    setVolumeState(prefs.volume);
  }, []);

  useEffect(() => {
    function startOnGesture() {
      if (startedRef.current) return;
      startedRef.current = true;
      const prefs = loadPrefs();
      getBackgroundMusic().start(prefs.muted ? 0 : prefs.volume);
      document.removeEventListener('pointerdown', startOnGesture);
    }
    document.addEventListener('pointerdown', startOnGesture);
    return () => document.removeEventListener('pointerdown', startOnGesture);
  }, []);

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      savePrefs({ muted: next, volume });
      if (startedRef.current) getBackgroundMusic().setVolume(next ? 0 : volume);
      return next;
    });
  }

  function setVolume(v: number) {
    setVolumeState(v);
    savePrefs({ muted, volume: v });
    if (startedRef.current && !muted) getBackgroundMusic().setVolume(v);
  }

  function flourish() {
    if (startedRef.current) getBackgroundMusic().flourish();
  }

  return { muted, volume, toggleMute, setVolume, flourish };
}
