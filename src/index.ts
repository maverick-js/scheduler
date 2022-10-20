export type ScheduledTask = () => void;
export type StopFlushUpdates = () => void;

export type Scheduler = {
  tick: Promise<void>;
  enqueue: (task: ScheduledTask) => void;
  flush: () => void;
  flushSync: () => void;
  onBeforeFlush: (callback: () => void) => StopFlushUpdates;
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
  const beforeCallbacks = new Set<() => void>();
  const afterCallbacks = new Set<() => void>();
  const queueTask = typeof queueMicrotask !== 'undefined' ? queueMicrotask : microtask.then;

  const enqueue = (task: ScheduledTask) => {
    queue.add(task);
    scheduleFlush();
  };

  let flushing = false;
  const scheduleFlush = () => {
    if (!flushing) {
      flushing = true;
      queueTask(flush);
    }
  };

  const flush = () => {
    runAll(beforeCallbacks);

    for (const task of queue) {
      task();
      queue.delete(task);
    }

    flushing = false;
    runAll(afterCallbacks);
  };

  return {
    tick: microtask,
    enqueue,
    flush: scheduleFlush,
    flushSync: flush,
    onBeforeFlush: hook(beforeCallbacks),
    onFlush: hook(afterCallbacks),
  };
}

function hook(callbacks: Set<() => void>) {
  return (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };
}

function runAll(callbacks: Set<() => void>) {
  for (const callback of callbacks) callback();
}
