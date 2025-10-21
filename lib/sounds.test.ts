import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { soundManager, useSound } from "./sounds";

// Mock Web Audio API
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    type: "square",
    frequency: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  })),
  createBiquadFilter: vi.fn(() => ({
    type: "lowpass",
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  })),
  destination: {},
  currentTime: 0,
  state: "running",
  resume: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
};

// Mock global AudioContext
Object.defineProperty(window, "AudioContext", {
  writable: true,
  value: vi.fn(() => mockAudioContext),
});

Object.defineProperty(window, "webkitAudioContext", {
  writable: true,
  value: vi.fn(() => mockAudioContext),
});

describe("SoundManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    soundManager.destroy();
  });

  describe("Initialization", () => {
    it("should create sound manager instance", () => {
      expect(soundManager).toBeDefined();
      expect(typeof soundManager.buttonClick).toBe("function");
    });

    it("should initialize audio context on user interaction", () => {
      const clickEvent = new Event("click");
      document.dispatchEvent(clickEvent);

      expect(window.AudioContext).toHaveBeenCalled();
    });
  });

  describe("Volume Control", () => {
    it("should set and get volume", () => {
      soundManager.setVolume(0.5);
      expect(soundManager.getVolume()).toBe(0.5);
    });

    it("should clamp volume between 0 and 1", () => {
      soundManager.setVolume(-0.5);
      expect(soundManager.getVolume()).toBe(0);

      soundManager.setVolume(1.5);
      expect(soundManager.getVolume()).toBe(1);
    });
  });

  describe("Enable/Disable", () => {
    it("should enable and disable sound", () => {
      soundManager.setEnabled(false);
      expect(soundManager.isAudioEnabled()).toBe(false);

      soundManager.setEnabled(true);
      // Will be false until audio context is initialized
      expect(soundManager.isAudioEnabled()).toBe(false);
    });
  });

  describe("Sound Effects", () => {
    it("should not crash when calling sound methods", () => {
      expect(() => soundManager.buttonClick()).not.toThrow();
      expect(() => soundManager.buttonHover()).not.toThrow();
      expect(() => soundManager.success()).not.toThrow();
      expect(() => soundManager.error()).not.toThrow();
      expect(() => soundManager.loading()).not.toThrow();
      expect(() => soundManager.notification()).not.toThrow();
      expect(() => soundManager.type()).not.toThrow();
      expect(() => soundManager.pageTransition()).not.toThrow();
      expect(() => soundManager.snakeEat()).not.toThrow();
      expect(() => soundManager.snakeGameOver()).not.toThrow();
    });

    it("should handle disabled state gracefully", () => {
      soundManager.setEnabled(false);
      expect(() => soundManager.buttonClick()).not.toThrow();
      expect(() => soundManager.success()).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle audio context creation failure", () => {
      const originalAudioContext = window.AudioContext;
      Object.defineProperty(window, "AudioContext", {
        writable: true,
        value: vi.fn(() => {
          throw new Error("Audio not supported");
        }),
      });

      const clickEvent = new Event("click");
      document.dispatchEvent(clickEvent);

      // Should not throw and should disable sound
      expect(() => soundManager.buttonClick()).not.toThrow();

      // Restore
      Object.defineProperty(window, "AudioContext", {
        writable: true,
        value: originalAudioContext,
      });
    });

    it("should not play sounds when disabled", () => {
      soundManager.setEnabled(false);

      const initialCallCount =
        mockAudioContext.createOscillator.mock.calls.length;
      soundManager.buttonClick();

      expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(
        initialCallCount,
      );
    });
  });

  describe("Cleanup", () => {
    it("should handle destroy gracefully", () => {
      expect(() => soundManager.destroy()).not.toThrow();
    });
  });
});

describe("useSound Hook", () => {
  it("should return sound functions", () => {
    const sound = useSound();

    expect(typeof sound.playButtonClick).toBe("function");
    expect(typeof sound.playButtonHover).toBe("function");
    expect(typeof sound.playSuccess).toBe("function");
    expect(typeof sound.playError).toBe("function");
    expect(typeof sound.playLoading).toBe("function");
    expect(typeof sound.playNotification).toBe("function");
    expect(typeof sound.playType).toBe("function");
    expect(typeof sound.playPageTransition).toBe("function");
    expect(typeof sound.playSnakeEat).toBe("function");
    expect(typeof sound.playSnakeGameOver).toBe("function");
    expect(typeof sound.setVolume).toBe("function");
    expect(typeof sound.getVolume).toBe("function");
    expect(typeof sound.setEnabled).toBe("function");
    expect(typeof sound.isEnabled).toBe("function");
  });

  it("should control volume through hook", () => {
    const sound = useSound();

    sound.setVolume(0.7);
    expect(sound.getVolume()).toBe(0.7);
  });

  it("should control enabled state through hook", () => {
    const sound = useSound();

    sound.setEnabled(false);
    expect(sound.isEnabled()).toBe(false);
  });
});
