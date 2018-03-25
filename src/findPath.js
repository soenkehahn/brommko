// @flow

import { Scene } from "./scene.js";
import _ from "lodash";

export function findPath(scene: Scene): Array<string> {
  return findFirst(mkAllPaths(), path => {
    const clone = _.cloneDeep(scene);
    simulate(clone, path);
    return clone.success;
  });
}

export function mkAllPaths(): Stream<Array<string>> {
  let path = [];

  function step(n: number) {
    if (n >= path.length) {
      path.push("ArrowUp");
    } else {
      if (path[n] === "ArrowUp") {
        path[n] = "ArrowLeft";
      } else if (path[n] === "ArrowLeft") {
        path[n] = "ArrowRight";
      } else if (path[n] === "ArrowRight") {
        path[n] = "ArrowDown";
      } else if (path[n] === "ArrowDown") {
        path[n] = "ArrowUp";
        step(n + 1);
      } else {
        throw "step: invalid state: " + path.toString();
      }
    }
  }

  return {
    next: () => {
      step(0);
      return _.cloneDeep(path).reverse();
    }
  };
}

function simulate(scene: Scene, path: Array<string>): void {
  for (const control of path) {
    scene.step(control);
  }
}

type Stream<A> = {
  next: () => A
};

function findFirst<A>(stream: Stream<A>, predicate: A => boolean): A {
  const element = stream.next();
  if (predicate(element)) {
    return element;
  } else {
    return findFirst(stream, predicate);
  }
}
