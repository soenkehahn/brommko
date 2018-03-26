// @flow

import { Scene, fillInWalls } from "./scene";
import { findPath } from "./findPath";
import { type Stream, last } from "./utils";
import _ from "lodash";

export async function search<A>(options: {|
  mutate: A => A,
  fitness: A => number,
  start: A
|}): Promise<A> {
  return (await last(searchStream(options))).element;
}

export function searchStream<A>(options: {|
  mutate: A => A,
  fitness: A => number,
  start: A
|}): Stream<{ element: A, fitness: number }> {
  const { mutate, fitness, start } = options;
  let best = start;
  let currentFitness = fitness(best);
  return {
    next: () => {
      while (currentFitness > 0) {
        const mutated = mutate(best);
        const mutatedFitness = fitness(mutated);
        if (mutatedFitness <= currentFitness) {
          best = mutated;
          currentFitness = mutatedFitness;
          console.error(`current fitness: ${currentFitness}`);
          return { element: best, fitness: currentFitness };
        }
      }
      return null;
    }
  };
}
