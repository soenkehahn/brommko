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

export function wait(n: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, n * 1000);
  });
}

export async function waitUntil(
  action: () => void,
  n: number = 100
): Promise<void> {
  try {
    action();
  } catch (err) {
    if (n > 0) {
      await wait(0.01);
      await waitUntil(action, n - 1);
    } else {
      throw err;
    }
  }
}
