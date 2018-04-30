// @flow

import { Scene } from "./scene";
import { type Stream, mapStream } from "./utils";

export async function findPath(
  targetScene: Scene,
  maxLength: number
): Promise<?{ path: Array<string>, scene: Scene }> {
  const stream: Stream<{ scene: Scene, path: Array<string> }> = mapStream(
    path => ({ scene: targetScene.clone(), path: path }),
    mkAllPaths(maxLength)
  );
  return await findFirst(stream, ({ path, scene: clone }) => {
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
    next: async () => {
      if (path.length <= maxLength) {
        step(0);
        return Array.from((path: Array<string>)).reverse();
      } else {
        return null;
      }
    }
  };
}

export function simulate(scene: Scene, path: Array<string>): void {
  for (const control of path) {
    scene.step(control);
  }
}

async function findFirst<A>(
  stream: Stream<A>,
  predicate: A => boolean
): Promise<?A> {
  let element = await stream.next();
  while (element && !predicate(element)) {
    element = await stream.next();
  }
  return element;
}
