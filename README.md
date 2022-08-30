# Scheduler

[![package-badge]][package]
[![license-badge]][license]
[![size-badge]][bundlephobia]

This is a tiny (~250B minzipped) scheduler which batches and runs tasks off the microtask queue.

## Installation

```bash
$: npm i @maverick-js/scheduler

$: pnpm i @maverick-js/scheduler

$: yarn add @maverick-js/scheduler
```

## Usage

```js
import { createScheduler } from '@maverick-js/scheduler';

const scheduler = createScheduler();

const taskA = () => {};
const taskB = () => {};

// Queue tasks.
scheduler.enqueue(taskA);
scheduler.enqueue(taskB);

// Be notified of a flush.
const stop = scheduler.onFlush(() => {
  console.log('Flushed!');
});

stop(); // unsubscribe

// Schedule a flush - can be invoked more than once.
scheduler.flush();

// Wait for flush to complete.
await scheduler.tick;

// Synchronously flush the queue whenever desired.
scheduler.flushSync();
```

Extra reading:

- The [source file](./src/index.ts) is only ~80 LOC so feel free to dig through.
- You can read more about microtasks on [MDN][mdn-microtasks].

## Inspiration

`@maverick-js/scheduler` was made possible based on my learnings from:

- [Svelte Scheduler][svelte-scheduler]

[package]: https://www.npmjs.com/package/@maverick-js/scheduler
[package-badge]: https://img.shields.io/npm/v/@maverick-js/scheduler/latest
[license]: https://github.com/maverick-js/scheduler/blob/main/LICENSE
[license-badge]: https://img.shields.io/github/license/maverick-js/scheduler
[size-badge]: https://img.shields.io/bundlephobia/minzip/@maverick-js/scheduler@^1.0.0
[svelte-scheduler]: https://github.com/sveltejs/svelte/blob/master/src/runtime/internal/scheduler.ts
[mdn-microtasks]: https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
[bundlephobia]: https://bundlephobia.com/package/@maverick-js/scheduler@^1.0.0
