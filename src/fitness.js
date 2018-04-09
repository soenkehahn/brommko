// @flow

import { Scene } from "./scene";
import { findPath } from "./findPath";
import { type Node, object, number } from "validated/schema";

export type SceneProperties = {|
  pathLength: number,
  directionChanges: number,
  switches: number
|};

export const scenePropertiesSchema: Node<SceneProperties> = object({
  pathLength: number,
  directionChanges: number,
  switches: number
});

export function sceneFitness(
  targetProperties: SceneProperties,
  scene: Scene
): {|
  fitness: number,
  sceneProperties: ?SceneProperties
|} {
  const path = findPath(scene);
  if (!path) {
    return { fitness: Infinity, sceneProperties: null };
  }
  const sceneProperties = getProperties(scene, path);
  return {
    fitness:
      Math.abs(targetProperties.pathLength - sceneProperties.pathLength) +
      Math.abs(
        targetProperties.directionChanges - sceneProperties.directionChanges
      ) *
        10 +
      Math.abs(targetProperties.switches - sceneProperties.switches) * 100,
    sceneProperties
  };
}

function getProperties(scene: Scene, path: Array<string>): SceneProperties {
  let directionChanges = 0;
  for (let i = 0; i <= path.length - 2; i++) {
    if (path[i] !== path[i + 1]) {
      directionChanges += 1;
    }
  }
  return {
    pathLength: path.length,
    directionChanges,
    switches: scene.switches.length
  };
}
