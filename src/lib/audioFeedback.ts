// Audio feedback system untuk Facebook UID Checker
class AudioFeedback {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Check if Web Audio API is supported and we're in browser
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('AudioContext initialization failed:', error);
        this.audioContext = null;
      }
    }
    
    // Check user preference for sound (only in browser)
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      this.isEnabled = localStorage.getItem('audio-feedback-enabled') !== 'false';
    }
  }

  // Enable/disable audio feedback
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      localStorage.setItem('audio-feedback-enabled', enabled.toString());
    }
  }

  // Check if audio is enabled
  isAudioEnabled(): boolean {
    return this.isEnabled && this.audioContext !== null;
  }

  // Create a simple beep sound using Web Audio API
  private createBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio feedback failed:', error);
    }
  }

  // Success sound (completion)
  playSuccess(): void {
    if (!this.isAudioEnabled()) return;
    
    // Play ascending notes for success
    setTimeout(() => this.createBeep(523, 0.1), 0); // C5
    setTimeout(() => this.createBeep(659, 0.1), 100); // E5
    setTimeout(() => this.createBeep(784, 0.2), 200); // G5
  }

  // Error sound
  playError(): void {
    if (!this.isAudioEnabled()) return;
    
    // Play descending notes for error
    setTimeout(() => this.createBeep(400, 0.2, 'sawtooth'), 0); // G4
    setTimeout(() => this.createBeep(300, 0.2, 'sawtooth'), 200); // D4
  }

  // Warning sound
  playWarning(): void {
    if (!this.isAudioEnabled()) return;
    
    // Play two quick beeps
    this.createBeep(440, 0.1); // A4
    setTimeout(() => this.createBeep(440, 0.1), 150);
  }

  // Start sound
  playStart(): void {
    if (!this.isAudioEnabled()) return;
    
    // Play a single low beep
    this.createBeep(220, 0.1, 'triangle'); // A3
  }

  // Progress sound (small tick)
  playProgress(): void {
    if (!this.isAudioEnabled()) return;
    
    // Very subtle tick sound
    this.createBeep(880, 0.02, 'sine'); // A5
  }

  // Complete sound (all done)
  playComplete(): void {
    if (!this.isAudioEnabled()) return;
    
    // Play a pleasant completion chord
    setTimeout(() => this.createBeep(523, 0.15), 0); // C5
    setTimeout(() => this.createBeep(659, 0.15), 100); // E5
    setTimeout(() => this.createBeep(784, 0.15), 200); // G5
    setTimeout(() => this.createBeep(1047, 0.3), 350); // C6 (higher)
  }

  // Play sound based on result type
  playResultSound(type: 'success' | 'error' | 'warning' | 'start' | 'progress' | 'complete'): void {
    switch (type) {
      case 'success':
        this.playSuccess();
        break;
      case 'error':
        this.playError();
        break;
      case 'warning':
        this.playWarning();
        break;
      case 'start':
        this.playStart();
        break;
      case 'progress':
        this.playProgress();
        break;
      case 'complete':
        this.playComplete();
        break;
    }
  }
}

// Create instance with safety check
let audioFeedbackInstance: AudioFeedback | null = null;

export const audioFeedback = (() => {
  if (typeof window !== 'undefined') {
    audioFeedbackInstance = new AudioFeedback();
  }
  return audioFeedbackInstance;
})();

export default audioFeedback;