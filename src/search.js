// @flow

import { Scene } from "./scene";
import { findPath } from "./findPath";
import _ from "lodash";

export async function search<A>(options: {|
  mutate: A => A,
  fitness: A => number,
  start: A
|}): Promise<A> {
  const { mutate, fitness, start } = options;
  let best = start;
  let currentFitness = fitness(best);
  while (currentFitness > 0) {
    await null;
    const mutated = mutate(best);
    const mutatedFitness = fitness(mutated);
    if (mutatedFitness <= currentFitness) {
      console.log(mutatedFitness);
      best = mutated;
      currentFitness = mutatedFitness;
    }
  }
  return best;
}

export function pathComplexity(path: Array<string>): number {
  let directionChanges = 0;
  for (let i = 0; i <= path.length - 2; i++) {
    if (path[i] !== path[i + 1]) {
      directionChanges += 0.2;
    }
  }
  return path.length + directionChanges;
}

export const sceneFitness: number => Scene => number = target => scene => {
  const path = findPath(5, scene);
  if (!path) {
    return Infinity;
  }
  const complexity = pathComplexity(path);
  return Math.abs(complexity - target) - 0.01;
};

export function mutateScene(scene: Scene): Scene {
  const clone = _.cloneDeep(scene);
  clone.mutate();
  return clone;
}

export async function mkScene() {
  const scene = await search({
    mutate: mutateScene,
    fitness: sceneFitness(4.4),
    start: new Scene()
  });
  console.log(scene, findPath(6, scene));
  return scene;
}
