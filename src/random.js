// @flow

export function _pickRandomly<A>(random: number, actions: Array<() => A>): A {
  if (actions.length === 0) {
    throw "pickRandomly: empty actions array";
  }
  let pick = 0;
  for (let i = 0; i < actions.length; i++) {
    if (random < (i + 1) / actions.length) {
      pick = i;
      break;
    }
  }
  return actions[pick]();
}

export function pickRandomly<A>(...actions: Array<() => A>): A {
  return _pickRandomly(Math.random(), actions);
}
