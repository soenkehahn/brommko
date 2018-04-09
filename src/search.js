// @flow

import { Scene, fillInWalls } from "./scene";
import { findPath } from "./findPath";
import { type Stream, last } from "./utils";
import _ from "lodash";

export async function search<A, Fitness: { fitness: number }>(options: {|
  mutate: A => A,
  fitness: A => Fitness,
  start: A
|}): Promise<A> {
  return (await last(searchStream(options))).element;
}

export function searchStream<A, Fitness: { fitness: number }>(options: {|
  mutate: A => A,
  fitness: A => Fitness,
  start: A
|}): Stream<{
  element: A,
  fitness: Fitness
}> {
  const { mutate, fitness, start } = options;
  let best = start;
  let currentFitness = fitness(best);
  return {
    next: () => {
      while (currentFitness.fitness > 0) {
        const mutated = mutate(best);
        const mutatedFitness = fitness(mutated);
        if (mutatedFitness.fitness <= currentFitness.fitness) {
          best = mutated;
          currentFitness = mutatedFitness;
          return { element: best, fitness: currentFitness };
        }
      }
      return null;
    }
  };
}
