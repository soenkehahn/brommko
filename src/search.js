// @flow

import { Scene, fillInWalls } from "./scene";
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
      best = mutated;
      currentFitness = mutatedFitness;
      console.error(`current fitness: ${currentFitness}`);
    }
  }
  return best;
}
