import { createEffect, createSignal } from "solid-js";

export function createTimeout() {
  const [timeoutRef, setTimeoutRef] = createSignal<NodeJS.Timeout | null>(null);

  createEffect(() => {
    clear();
  });

  function set(delay: number, fn: () => void): void {
    clear();
    setTimeoutRef(setTimeout(fn, delay));
  }

  function clear(): void {
    clearTimeout(timeoutRef());
  }

  return { set, clear };
}

