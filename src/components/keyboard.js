// @flow

import * as React from "react";

type KeyEvent = {
  code: string
};

export function handleKeyboard(callback: KeyEvent => void): void {
  addKeyboardEventListener("keydown", event => {
    callback({ code: event.code });
  });
}

function addKeyboardEventListener(
  type: KeyboardEventTypes,
  callback: KeyboardEventListener
) {
  document.addEventListener(type, callback);
}
