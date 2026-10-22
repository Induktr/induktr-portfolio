/**
 * ============================================================================
 * Induktr Studio v2.0 — Scheduler & V8 Task Orchestrator
 * Based on Notion Standard: [JS-CORE] 22. Scheduler API & RequestIdleCallback
 * ============================================================================
 * Principle:
 * 1. Background computation & matrix pre-baking happens in requestIdleCallback (rIC).
 * 2. ZERO DOM MUTATIONS inside rIC (prevents layout invalidation before render).
 * 3. DOM transforms are dispatched strictly in requestAnimationFrame (rAF) at vsync.
 */

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface WindowWithIdleCallback {
  requestIdleCallback?(callback: IdleRequestCallback, options?: { timeout: number }): number;
  cancelIdleCallback?(handle: number): void;
}

/**
 * Schedule non-critical work during idle periods between frame renders
 */
export function scheduleLowPriorityTask(taskFn: () => void, timeoutMs = 2000): void {
  const win = typeof window !== 'undefined' ? (window as unknown as WindowWithIdleCallback) : undefined;

  if (win && typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(
      (deadline: IdleDeadline) => {
        // Execute work in chunks while frame deadline has remaining budget
        if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
          taskFn();
        }
      },
      { timeout: timeoutMs }
    );
  } else {
    // Fallback for environments lacking requestIdleCallback
    setTimeout(taskFn, 50);
  }
}

/**
 * High-Priority Compositor Tick (rAF) for applying pre-calculated matrices
 */
export function scheduleRenderFrame(renderFn: (timestamp: number) => void): number {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(renderFn);
  }
  return setTimeout(renderFn, 16) as unknown as number;
}

export function cancelRenderFrame(handle: number): void {
  if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(handle);
  } else {
    clearTimeout(handle);
  }
}
