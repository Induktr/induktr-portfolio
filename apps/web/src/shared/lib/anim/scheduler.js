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
/**
 * Schedule non-critical work during idle periods between frame renders
 */
export function scheduleLowPriorityTask(taskFn, timeoutMs = 2000) {
    const win = typeof window !== 'undefined' ? window : undefined;
    if (win && typeof win.requestIdleCallback === 'function') {
        win.requestIdleCallback((deadline) => {
            // Execute work in chunks while frame deadline has remaining budget
            if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
                taskFn();
            }
        }, { timeout: timeoutMs });
    }
    else {
        // Fallback for environments lacking requestIdleCallback
        setTimeout(taskFn, 50);
    }
}
/**
 * High-Priority Compositor Tick (rAF) for applying pre-calculated matrices
 */
export function scheduleRenderFrame(renderFn) {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        return window.requestAnimationFrame(renderFn);
    }
    return setTimeout(renderFn, 16);
}
export function cancelRenderFrame(handle) {
    if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(handle);
    }
    else {
        clearTimeout(handle);
    }
}
