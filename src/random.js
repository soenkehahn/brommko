// @flow

import _ from "lodash";

export type Action<A> = {| weight: number, action: () => A |} | (() => A);

export function _pick<A>(random: number, actions: Array<Action<A>>): A {
  if (actions.length === 0) {
    throw "pick: empty actions array";
  }
  const weightedActions: Array<{
    weight: number,
    action: () => A
  }> = actions.map(action => {
    if (typeof action === "function") {
      return { weight: 1, action };
    } else {
      return action;
    }
  });
  const allWeights = _.sum(weightedActions.map(action => action.weight));
  let pick = 0;
  let limit = 0;
  for (let i = 0; i < weightedActions.length; i++) {
    limit += weightedActions[i].weight;
    if (random < limit / allWeights) {
      pick = i;
      break;
    }
  }
  return weightedActions[pick].action();
}

export function pick<A>(...actions: Array<Action<A>>): A {
  return _pick(Math.random(), actions);
}
