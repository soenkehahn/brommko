// @flow

export function simulateKeyEvent(type: KeyboardEventTypes, code: string) {
  const event = new KeyboardEvent(type, {
    code: code,
    repeat: false
  });
  document.dispatchEvent(event);
}

export function failNull<A>(a: ?A): A {
  if (!a) {
    throw "failNull: found null";
  }
  return a;
}
