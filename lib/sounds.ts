// Sound system for pixel art portfolio
// Uses Web Audio API to generate retro-style sound effects

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private isEnabled = true;

  constructor() {
    // Initialize on first user interaction
    if (typeof window !== "undefined") {
      document.addEventListener("click", this.initializeAudio.bind(this), {
        once: true,
      });
      document.addEventListener("keydown", this.initializeAudio.bind(this), {
        once: true,
      });
    }
  }

  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.warn("Audio initialization failed:", error);
      this.isEnabled = false;
    }
  }

  private createOscillator(
    frequency: number,
    type: OscillatorType = "square",
  ): OscillatorNode | null {
    if (!this.audioContext || !this.isEnabled) return null;

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );

    return oscillator;
  }

  private createGainNode(initialVolume = 1): GainNode | null {
    if (!this.audioContext || !this.isEnabled) return null;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(
      initialVolume * this.masterVolume,
      this.audioContext.currentTime,
    );

    return gainNode;
  }

  // Button click sound - classic pixel game blip
  buttonClick() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(800, "square");
    const gainNode = this.createGainNode(0.2);

    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Quick attack and decay
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2 * this.masterVolume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  // Hover sound - subtle frequency sweep
  buttonHover() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(600, "triangle");
    const gainNode = this.createGainNode(0.1);

    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.linearRampToValueAtTime(700, now + 0.05);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1 * this.masterVolume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  // Success sound - ascending notes
  success() {
    if (!this.audioContext || !this.isEnabled) return;

    const frequencies = [523, 659, 784]; // C, E, G

    frequencies.forEach((freq, index) => {
      const oscillator = this.createOscillator(freq, "square");
      const gainNode = this.createGainNode(0.15);

      if (!oscillator || !gainNode) return;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      const now = this.audioContext!.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(
        0.15 * this.masterVolume,
        now + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      oscillator.start(now);
      oscillator.stop(now + 0.2);
    });
  }

  // Error sound - descending buzz
  error() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(400, "sawtooth");
    const gainNode = this.createGainNode(0.2);

    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.linearRampToValueAtTime(200, now + 0.3);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2 * this.masterVolume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  // Loading sound - pulsing tone
  loading() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(440, "sine");
    const gainNode = this.createGainNode(0.1);

    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;

    // Create pulsing effect
    for (let i = 0; i < 4; i++) {
      const pulseStart = now + i * 0.2;
      gainNode.gain.setValueAtTime(0, pulseStart);
      gainNode.gain.linearRampToValueAtTime(
        0.1 * this.masterVolume,
        pulseStart + 0.05,
      );
      gainNode.gain.linearRampToValueAtTime(0, pulseStart + 0.1);
    }

    oscillator.start(now);
    oscillator.stop(now + 0.8);
  }

  // Notification sound - gentle chime
  notification() {
    if (!this.audioContext || !this.isEnabled) return;

    const frequencies = [880, 1108]; // A5, C#6

    frequencies.forEach((freq, index) => {
      const oscillator = this.createOscillator(freq, "sine");
      const gainNode = this.createGainNode(0.1);

      if (!oscillator || !gainNode) return;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      const now = this.audioContext!.currentTime + index * 0.1;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(
        0.1 * this.masterVolume,
        now + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      oscillator.start(now);
      oscillator.stop(now + 0.5);
    });
  }

  // Type sound - quick blip for typewriter effect
  type() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(1200, "square");
    const gainNode = this.createGainNode(0.05);

    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(
      0.05 * this.masterVolume,
      now + 0.001,
    );
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    oscillator.start(now);
    oscillator.stop(now + 0.02);
  }

  // Page transition sound - swoosh
  pageTransition() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(800, "triangle");
    const gainNode = this.createGainNode(0.15);

    if (!oscillator || !gainNode) return;

    // Add a filter for sweeping effect
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      100,
      this.audioContext.currentTime + 0.3,
    );

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15 * this.masterVolume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  // Game sounds for the Snake game
  snakeEat() {
    if (!this.audioContext || !this.isEnabled) return;

    const oscillator = this.createOscillator(660, "square");
    const gainNode = this.createGainNode(0.2);

    if (!oscillator || !gainNode) return;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(660, now);
    oscillator.frequency.linearRampToValueAtTime(880, now + 0.1);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2 * this.masterVolume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  snakeGameOver() {
    if (!this.audioContext || !this.isEnabled) return;

    const frequencies = [440, 415, 392, 370]; // Descending notes

    frequencies.forEach((freq, index) => {
      const oscillator = this.createOscillator(freq, "square");
      const gainNode = this.createGainNode(0.2);

      if (!oscillator || !gainNode) return;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      const now = this.audioContext!.currentTime + index * 0.15;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(
        0.2 * this.masterVolume,
        now + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      oscillator.start(now);
      oscillator.stop(now + 0.3);
    });
  }

  // Volume and state controls
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.masterVolume;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled && this.audioContext !== null;
  }

  // Cleanup
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// React hook for using sounds
export function useSound() {
  return {
    playButtonClick: () => soundManager.buttonClick(),
    playButtonHover: () => soundManager.buttonHover(),
    playSuccess: () => soundManager.success(),
    playError: () => soundManager.error(),
    playLoading: () => soundManager.loading(),
    playNotification: () => soundManager.notification(),
    playType: () => soundManager.type(),
    playPageTransition: () => soundManager.pageTransition(),
    playSnakeEat: () => soundManager.snakeEat(),
    playSnakeGameOver: () => soundManager.snakeGameOver(),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    getVolume: () => soundManager.getVolume(),
    setEnabled: (enabled: boolean) => soundManager.setEnabled(enabled),
    isEnabled: () => soundManager.isAudioEnabled(),
  };
}
