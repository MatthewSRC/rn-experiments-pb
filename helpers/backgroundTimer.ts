import { AppState, AppStateStatus, NativeEventSubscription, Platform } from 'react-native';

import { storage } from './storage';

/**
 * Clear the saved value and time for a given ID.
 * @param id The unique identifier for the data to clear.
 */
function clearTimeAndValue(id: string) {
  storage.delete(`@value-${id}`);
  storage.delete(`@time-${id}`);
}

/**
 * Save the current value for a given ID.
 * @param id The unique identifier for the data to save.
 * @param value The value to save.
 */
function saveValue(id: string, value: number) {
  storage.set(`@value-${id}`, value.toString());
}

/**
 * Retrieve the saved value for a given ID.
 * @param id The unique identifier for the data to retrieve.
 * @returns A promise that resolves to the retrieved value (or undefined if not found).
 */
function retrieveSavedValue(id: string): string | undefined {
  return storage.getString(`@value-${id}`);
}

/**
 * Save the current time for a given ID.
 * @param id The unique identifier for the data to save.
 */
function saveTime(id: string) {
  const now = new Date();
  storage.set(`@time-${id}`, now.toISOString());
}

/**
 * Retrieve the saved time for a given ID.
 * @param id The unique identifier for the data to retrieve.
 * @returns A promise that resolves to the retrieved time (or undefined if not found).
 */
function retrieveSavedTime(id: string): string | undefined {
  return storage.getString(`@time-${id}`);
}

class AppStateHandler {
  private subscription: NativeEventSubscription | undefined;

  constructor() {
    this.handleStateChanges = this.handleStateChanges.bind(this);
  }

  /**
   * Subscribe to changes in the application's state.
   * @param callback A callback function to be called when the app state changes.
   * @param nextState The next application state.
   */
  public subscribeToStateChanges(callback: (nextState: AppStateStatus) => void) {
    this.subscription = AppState.addEventListener('change', (state) =>
      this.handleStateChanges(state, callback)
    );
  }

  /**
   * Handle changes in the application's state and invoke the provided callback.
   * @param nextState The next application state.
   * @param callback A callback function to be called with the next state.
   */
  // eslint-disable-next-line class-methods-use-this
  private async handleStateChanges(
    nextState: AppStateStatus,
    callback: (nextState: AppStateStatus) => void
  ) {
    callback(nextState);
  }

  /**
   * Unsubscribe from changes in the application's state.
   */
  public unsubscribeFromStateChanges() {
    if (this.subscription) {
      this.subscription.remove();
    }
  }
}

export interface TimerResetOptions {
  initialValue: number;
  changeValue: number;
  intervalMs: number;
  endValue?: number;
}

export class BackgroundTimer {
  private id: string;

  private onInterval?: (value: number) => void;

  private onStart?: () => void;

  private onStop?: () => void;

  private onReset?: () => void;

  private ref: NodeJS.Timeout | undefined;

  private value: number | undefined;

  private appStateHandler = new AppStateHandler();

  private persistedState: { value: number; time: number } | undefined;

  private lastInterval: number | undefined;

  /**
   * @param id Unique identifier for this timer.
   * @param persistedState Whether to retrieve and use persisted state.
   * @param onInterval Callback function to be called on each interval.
   * @param onStart Callback function to be called when the timer starts.
   * @param onStop Callback function to be called when the timer stops.
   * @param onReset Callback function to be called when the timer is reset.
   */
  constructor(
    id: string,
    persistedState?: boolean,
    onInterval?: (value: number) => void,
    onStart?: () => void,
    onStop?: () => void,
    onReset?: () => void
  ) {
    this.id = id;
    if (persistedState) {
      this.retrievePersistedState();
    }
    this.onInterval = onInterval;
    this.onStart = onStart;
    this.onStop = onStop;
    this.onReset = onReset;
  }

  /**
   * Retrieve and initialize the persisted state (value and time) for the timer from storage.
   * This function retrieves the previously saved value and time associated with the timer ID.
   * If both values are successfully retrieved, it initializes the `persistedState` property.
   */
  private async retrievePersistedState() {
    const [retrievedValue, retrievedTime] = await Promise.all([
      retrieveSavedValue(this.id),
      retrieveSavedTime(this.id),
    ]);
    if (retrievedValue && retrievedTime) {
      this.persistedState = {
        value: parseInt(retrievedValue, 10),
        time: Date.parse(retrievedTime),
      };
    }
  }

  /** Start the background timer.
   * @param initialValue The initial value of the timer.
   * @param changeValue The value change on each interval (positive or negative).
   * @param intervalMs The interval in milliseconds.
   * @param endValue Optional value at which the timer should stop.
   */
  start(initialValue: number, changeValue: number, intervalMs: number, endValue?: number) {
    this.value = initialValue;

    this.handlePersistedState(changeValue, intervalMs, endValue);
    this.handleStateChanges(changeValue, intervalMs, endValue);
    this.handleTimer(changeValue, intervalMs, intervalMs, 0, endValue);

    this.onStart?.();
  }

  private handleTimer(
    changeValue: number,
    intervalMs: number,
    fixedIntervalMs: number,
    cycleNumber: number,
    endValue?: number
  ) {
    const isDecreasing = changeValue < 0;
    this.ref = setTimeout(() => {
      if (this.value === undefined) {
        return;
      }
      let diff = 0;
      const now = Date.now();
      if (this.lastInterval) {
        const distance = now - this.lastInterval;
        diff = fixedIntervalMs - distance;

        if (cycleNumber === 1) {
          diff *= 2;
        }
      }
      this.lastInterval = now;
      const newValue = Math.round(this.value + changeValue);

      const shouldBeStopped =
        endValue !== undefined &&
        ((isDecreasing && newValue <= endValue) || (!isDecreasing && newValue >= endValue));

      if (shouldBeStopped) {
        this.stop();
        this.onInterval?.(endValue);
        return;
      }

      this.value = newValue;
      this.onInterval?.(newValue);
      clearTimeout(this.ref);
      this.ref = undefined;
      this.handleTimer(changeValue, intervalMs + diff, fixedIntervalMs, cycleNumber + 1, endValue);
    }, intervalMs);
  }

  private handlePersistedState(changeValue: number, intervalMs: number, endValue?: number) {
    if (this.persistedState) {
      const isDecreasing = changeValue < 0;
      const now = Date.now();
      const diff = (now - this.persistedState.time) / intervalMs;

      const newValue = Math.round(this.persistedState.value + changeValue * diff);
      if (
        endValue &&
        ((isDecreasing && newValue <= endValue) || (!isDecreasing && newValue >= endValue))
      ) {
        this.stop();
        this.onInterval?.(endValue);
        return;
      }
      this.value = newValue;
      this.onInterval?.(newValue);
    }
  }

  private handleStateChanges(changeValue: number, intervalMs: number, endValue?: number) {
    // IOS doesn't need background saving, it keeps running.
    if (Platform.OS !== 'android') {
      return;
    }

    const isDecreasing = changeValue < 0;
    this.appStateHandler.subscribeToStateChanges(async (nextState) => {
      if (nextState === 'active') {
        const retrievedTime = retrieveSavedTime(this.id);
        if (retrievedTime !== undefined && this.value) {
          const parsedTime = Date.parse(retrievedTime);
          const now = Date.now();
          const diff = (now - parsedTime) / intervalMs;
          const newValue = Math.round(this.value + changeValue * diff);

          if (
            endValue &&
            ((isDecreasing && newValue <= endValue) || (!isDecreasing && newValue >= endValue))
          ) {
            this.stop();
            this.onInterval?.(endValue);
            return;
          }
          this.value = newValue;
          this.onInterval?.(newValue);
        }
      } else if (nextState === 'inactive' || nextState === 'background') {
        saveTime(this.id);
        this.lastInterval = undefined;
        if (this.value) {
          saveValue(this.id, this.value);
        }
      }
    });
  }

  /**
   * Reset the background timer.
   * This stops the current timer, clears all persisted state, and optionally restarts with new parameters.
   * @param options Optional parameters to restart the timer immediately after reset.
   * @param callStopCallback Whether to call the onStop callback during reset (default: false).
   */
  reset(options?: TimerResetOptions, callStopCallback: boolean = false) {
    // Stop current timer operations
    this.appStateHandler.unsubscribeFromStateChanges();
    clearTimeout(this.ref);
    this.ref = undefined;
    this.value = undefined;
    this.lastInterval = undefined;
    this.persistedState = undefined;

    // Clear persisted storage
    clearTimeAndValue(this.id);

    // Call callbacks
    if (callStopCallback) {
      this.onStop?.();
    }
    this.onReset?.();

    // Optionally restart with new parameters
    if (options) {
      this.start(options.initialValue, options.changeValue, options.intervalMs, options.endValue);
    }
  }

  /**
   * Get the current timer value.
   * @returns The current value of the timer, or undefined if not running.
   */
  getCurrentValue(): number | undefined {
    return this.value;
  }

  /**
   * Check if the timer is currently running.
   * @returns True if the timer is running, false otherwise.
   */
  isRunning(): boolean {
    return this.ref !== undefined;
  }

  /**
   * Stop the background timer.
   */
  stop() {
    this.appStateHandler.unsubscribeFromStateChanges();
    clearTimeout(this.ref);
    this.ref = undefined;
    this.value = undefined;
    this.lastInterval = undefined;
    clearTimeAndValue(this.id);
    this.onStop?.();
  }
}
