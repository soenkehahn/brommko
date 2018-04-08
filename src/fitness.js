// @flow

import { Scene } from "./scene";
import { findPath } from "./findPath";

export const sceneFitness: SceneProperties => Scene => number = targetProperties => scene => {
  const path = findPath(scene);
  if (!path) {
    return Infinity;
  }
  const sceneProperties = getProperties(scene, path);
  return (
    Math.abs(targetProperties.pathLength - sceneProperties.pathLength) +
    Math.abs(
      targetProperties.directionChanges - sceneProperties.directionChanges
    ) +
    Math.abs(targetProperties.switches - sceneProperties.switches)
  );
};

export type SceneProperties = {|
  pathLength: number,
  directionChanges: number,
  switches: number
|};

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
