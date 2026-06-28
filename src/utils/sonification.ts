"use client";

type FeedbackType = "hover" | "click" | "morph";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private enabled = false;

  private init() {
    if (this.ctx || typeof window === "undefined") return;

    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      this.ctx = new AudioCtor();
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterVolume.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
      this.masterVolume = null;
    }
  }

  public setEnabled(value: boolean) {
    this.enabled = value;
  }

  public triggerFeedback(type: FeedbackType) {
    if (!this.enabled) return;

    this.init();
    if (!this.ctx || !this.masterVolume || this.ctx.state === "suspended") return;

    const time = this.ctx.currentTime;

    if (type === "hover") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, time);
      osc.frequency.exponentialRampToValueAtTime(800, time + 0.04);
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(time);
      osc.stop(time + 0.05);
    }

    if (type === "click") {
      const osc = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.setValueAtTime(80, time + 0.01);
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(55, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(time);
      oscSub.start(time);
      osc.stop(time + 0.09);
      oscSub.stop(time + 0.09);
    }

    if (type === "morph") {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, time);
      osc.frequency.exponentialRampToValueAtTime(320, time + 0.25);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(120, time);
      filter.frequency.exponentialRampToValueAtTime(800, time + 0.25);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);
      osc.start(time);
      osc.stop(time + 0.3);
    }
  }

}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const sound = new SoundEngine();
