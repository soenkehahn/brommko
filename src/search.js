// @flow

import { Scene, shrinkScene } from "./scene";
import { findPath } from "./findPath";
import _ from "lodash";
import { runShrink } from "./shrink";

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
      best = mutated;
      currentFitness = mutatedFitness;
      console.error(`current fitness: ${currentFitness}`);
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
  const clone = scene.clone();
  clone.mutate();
  return clone;
}

export async function mkScene(complexity: number): Promise<Scene> {
  const scene = await search({
    mutate: mutateScene,
    fitness: sceneFitness(complexity),
    start: new Scene()
  });
  const shrunk = await runShrink(
    scene,
    shrinkScene,
    s => sceneFitness(complexity)(s) <= 0
  );
  return shrunk;
}
