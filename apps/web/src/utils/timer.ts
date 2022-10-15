enum TimerState {
  initialized,
  started,
  paused,
  stopped,
}

class Timer {
  #startTime: number;
  #spanTime: number;
  #state: TimerState;

  constructor() {
    this.#startTime = 0;
    this.#spanTime = 0;
    this.#state = TimerState.initialized;
  }

  get spanTime() {
    return this.#spanTime;
  }

  get state() {
    return this.#state;
  }

  start() {
    if (this.#state === TimerState.initialized || this.#state === TimerState.paused) {
      this.#startTime = Date.now();
      this.#state = TimerState.started;
    }
  }

  pause() {
    if (this.state === TimerState.started) {
      this.#state = TimerState.paused;
      this.#spanTime = Date.now() - this.#startTime;
      this.#startTime = 0;
    }
  }

  stop() {
    if (this.state === TimerState.paused) {
      this.#state = TimerState.stopped;
    }

    if(this.#state === TimerState.started) {
      this.#spanTime = Date.now() - this.#startTime;
    }
  }
}

export default Timer;
