export function createStore(initial) {
  let state = structuredClone(initial);
  const listeners = new Set();

  return {
    get() {
      return state;
    },
    set(updater) {
      state = updater(state);
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn); // unsubscribe
    },
  };
}
