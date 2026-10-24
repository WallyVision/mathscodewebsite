/**
 * A key that changes with every form action result. After an action, React
 * resets the form, and <select> elements fall back to their first option
 * instead of their defaultValue. Keying the fields on the result remounts
 * them with the submitted values instead.
 */
const keys = new WeakMap<object, number>();
let next = 0;

export function resultKey(state: object): number {
  let key = keys.get(state);
  if (key === undefined) {
    key = next++;
    keys.set(state, key);
  }
  return key;
}
