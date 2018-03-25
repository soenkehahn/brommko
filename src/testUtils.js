// @flow

export function simulateKeyEvent(type: KeyboardEventTypes, code: string) {
  const event = new KeyboardEvent(type, {
    code: code,
    repeat: false
  });
  document.dispatchEvent(event);
}
