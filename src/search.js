// @flow

import { type Stream, last } from "./utils";
import _ from "lodash";

export async function search<A, Fitness: { fitness: number }>(options: {|
  mutate: A => A,
  fitness: A => Promise<Fitness>,
  start: A
|}): Promise<A> {
  return (await last(await searchStream(options))).element;
}

export async function searchStream<A, Fitness: { fitness: number }>(options: {|
  mutate: A => A,
  fitness: A => Promise<Fitness>,
  start: A
|}): Promise<
  Stream<{
    element: A,
    fitness: Fitness
  }>
> {
  const { mutate, fitness, start } = options;
  let best = start;
  let currentFitness = await fitness(best);
  return {
    next: async () => {
      while (currentFitness.fitness > 0) {
        const mutated = mutate(best);
        const mutatedFitness = await fitness(mutated);
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
