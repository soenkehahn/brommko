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
  return await last(searchStream(options));
}

export function searchStream<A>(options: {|
  mutate: A => A,
  fitness: A => number,
  start: A
|}): Stream<A> {
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
          return best;
        }
      }
      return null;
    }
  };
}
