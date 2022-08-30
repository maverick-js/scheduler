export type ScheduledTask = () => void;
export type StopFlushUpdates = () => void;

export type Scheduler = {
  tick: Promise<void>;
  enqueue: (task: ScheduledTask) => void;
  flush: () => void;
  flushSync: () => void;
  onFlush: (callback: () => void) => StopFlushUpdates;
};

/**
 * Creates a scheduler which batches tasks and runs them in the microtask queue.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide}
 * @example
 * ```ts
 * const scheduler = createScheduler();
 *
 * // Queue tasks.
 * scheduler.enqueue(() => {});
 * scheduler.enqueue(() => {});
 *
 * // Schedule a flush - can be invoked more than once.
 * scheduler.flush();
 *
 * // Wait for flush to complete.
 * await scheduler.tick;
 * ```
 */
export function createScheduler(): Scheduler {
  const queue = new Set<ScheduledTask>();
  const microtask = Promise.resolve();
  const callbacks = new Set<() => void>();
  const queueTask = typeof queueMicrotask !== 'undefined' ? queueMicrotask : microtask.then;

  function enqueue(task: ScheduledTask) {
    queue.add(task);
    scheduleFlush();
  }

  let flushing = false;
  function scheduleFlush() {
    if (!flushing) {
      flushing = true;
      queueTask(flush);
    }
  }

  function flush() {
    for (const task of queue) {
      task();
      queue.delete(task);
    }

    flushing = false;
    for (const callback of callbacks) callback();
  }

  return {
    tick: microtask,
    enqueue,
    flush: scheduleFlush,
    flushSync: flush,
    onFlush: (callback) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
  };
}
