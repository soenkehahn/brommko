// @flow

import { Scene } from "./scene";
import { type Stream } from "./utils";

export function findPath(scene: Scene, maxLength: number = 6): ?Array<string> {
  return findFirst(mkAllPaths(maxLength), path => {
    const clone = scene.clone();
    simulate(clone, path);
    return clone.success;
  });
}

export function mkAllPaths(maxLength: number): Stream<Array<string>> {
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
      if (path.length <= maxLength) {
        step(0);
        return Array.from((path: Array<string>)).reverse();
      } else {
        return null;
      }
    }
  };
}

function simulate(scene: Scene, path: Array<string>): void {
  for (const control of path) {
    scene.step(control);
  }
}

function findFirst<A>(stream: Stream<A>, predicate: A => boolean): ?A {
  let element = stream.next();
  while (element && !predicate(element)) {
    element = stream.next();
  }
  return element;
}
