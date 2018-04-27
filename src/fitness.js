// @flow

import { type Node, number, object } from "validated/schema";
import { Scene } from "./scene";
import { findPath } from "./findPath";
import _ from "lodash";

export type SceneProperties = {|
  pathLength: number,
  directionChanges: number,
  switches: number,
  directors: number
|};

export const scenePropertiesSchema: Node<SceneProperties> = object({
  pathLength: number,
  directionChanges: number,
  switches: number,
  directors: number
});

export async function sceneFitness(
  targetProperties: SceneProperties,
  scene: Scene
): Promise<{|
  fitness: number,
  sceneProperties: ?SceneProperties
|}> {
  const solution = await findPath(scene);
  if (!solution) {
    return { fitness: Infinity, sceneProperties: null };
  }
  const sceneProperties = getProperties(solution.scene, solution.path);
  return {
    fitness:
      Math.abs(targetProperties.pathLength - sceneProperties.pathLength) +
      Math.abs(
        targetProperties.directionChanges - sceneProperties.directionChanges
      ) *
        10 +
      Math.abs(targetProperties.switches - sceneProperties.switches) * 100 +
      Math.abs(targetProperties.directors - sceneProperties.directors) * 100,
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
    switches: scene.switches.length,
    directors: _.filter(scene.directors, director => director.passed).length
  };
}
