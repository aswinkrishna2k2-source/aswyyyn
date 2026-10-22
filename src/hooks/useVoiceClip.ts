import { useCallback, useEffect, useRef, useState } from 'react';

export interface VoiceClip {
  playing: boolean;
  /** 0–1 playback position */
  progress: number;
  duration: number;
  toggle: () => void;
  /**
   * Fills `out` with 0–1 loudness per band from the live audio, so visuals can react to the
   * actual voice. Returns false when nothing is playing (callers fall back to an idle animation).
   */
  readLevels: (out: Float32Array) => boolean;
}

type AudioCtx = typeof AudioContext;

/**
 * Plays a short voice clip and exposes its frequency levels through Web Audio. The AudioContext
 * is created on the first play (browsers only allow audio after a tap or click).
 */
export function useVoiceClip(src?: string): VoiceClip {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const binsRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = src;
    audioRef.current = audio;

    const onMeta = () => setDuration(audio.duration);
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      audio.currentTime = 0;
      setProgress(0);
      setPlaying(false);
    };
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      analyserRef.current = null;
    };
  }, [src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    // Wire the analyser once, on the first user-initiated play
    if (!ctxRef.current) {
      const Ctx: AudioCtx | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtx }).webkitAudioContext;
      if (Ctx) {
        try {
          const ctx = new Ctx();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.72;
          ctx.createMediaElementSource(audio).connect(analyser);
          analyser.connect(ctx.destination);
          ctxRef.current = ctx;
          analyserRef.current = analyser;
          binsRef.current = new Uint8Array(analyser.frequencyBinCount);
        } catch {
          /* no analyser — the clip still plays, visuals use the idle animation */
        }
      }
    }
    ctxRef.current?.resume().catch(() => {});
    audio.play().catch(() => setPlaying(false));
  }, []);

  const readLevels = useCallback((out: Float32Array) => {
    const analyser = analyserRef.current;
    const bins = binsRef.current;
    const audio = audioRef.current;
    if (!analyser || !bins || !audio || audio.paused) return false;
    analyser.getByteFrequencyData(bins);
    // Speech lives in the lower bins; spread those across the bars, mirrored from the centre
    const usable = Math.floor(bins.length * 0.55);
    const half = Math.ceil(out.length / 2);
    for (let i = 0; i < half; i++) {
      const v = bins[Math.min(usable - 1, Math.floor((i / half) * usable))] / 255;
      const level = Math.min(1, v * 1.25);
      out[half - 1 - i] = level;
      out[out.length - half + i] = level;
    }
    return true;
  }, []);

  return { playing, progress, duration, toggle, readLevels };
}
