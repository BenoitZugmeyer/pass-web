
export function stop(fn) {
  return (...args) => {
    if (args[0] instanceof Event) args.shift().preventDefault();
    if (fn) fn(...args);
  }
}
