// @flow

import { type Stream, last } from "./utils";
import _ from "lodash";

export type Operations<A, Fitness: { fitness: number }> = {|
  mutate: A => A,
  fitness: A => Promise<Fitness>
|};

export async function search<A, Fitness: { fitness: number }>(
  operations: Operations<A, Fitness>,
  start: A
): Promise<A> {
  return (await last(await searchStream(operations, start))).element;
}

type Candidate<A, Fitness: { fitness: number }> = {
  element: A,
  fitness: Fitness
};

export async function searchStream<A, Fitness: { fitness: number }>(
  operations: Operations<A, Fitness>,
  start: A
): Promise<Stream<Candidate<A, Fitness>>> {
  let current: Candidate<A, Fitness> = await mkCandidate(operations, start);
  return {
    next: async () => {
      while (current.fitness.fitness > 0) {
        const mutated: null | Candidate<A, Fitness> = await _tryMutation(
          operations,
          current
        );
        if (mutated !== null) {
          current = mutated;
          return current;
        }
      }
    }
  };
}

async function mkCandidate<A, Fitness: { fitness: number }>(
  operations: Operations<A, Fitness>,
  a: A
): Promise<Candidate<A, Fitness>> {
  return {
    element: a,
    fitness: await operations.fitness(a)
  };
}

export async function _tryMutation<A, Fitness: { fitness: number }>(
  operations: Operations<A, Fitness>,
  candidate: Candidate<A, Fitness>
): Promise<null | Candidate<A, Fitness>> {
  const mutated: Candidate<A, Fitness> = await mkCandidate(
    operations,
    operations.mutate(candidate.element)
  );
  if (mutated.fitness.fitness <= candidate.fitness.fitness) {
    return mutated;
  } else {
    return null;
  }
}
