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
  const mutator = await Mutator.create(operations, start);
  return {
    next: async () => {
      while (!mutator.done()) {
        const mutated: null | Candidate<
          A,
          Fitness
        > = await mutator.nextMutation();
        if (mutated !== null) {
          return mutated;
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

type Impossible = true & false;

export class Mutator<A, Fitness: { fitness: number }> {
  operations: Operations<A, Fitness>;
  current: Candidate<A, Fitness>;
  generationsWithoutSuccess: number = 0;

  // don't use 'new Mutator', but 'Mutator.create'!
  constructor(x: Impossible) {
    if (x !== "don't freak, called from new") {
      throw new Error("don't use 'new Mutator', but 'new'!");
    }
  }

  static async create<A, Fitness: { fitness: number }>(
    operations: Operations<A, Fitness>,
    start: A
  ): Promise<Mutator<A, Fitness>> {
    const mutator = new Mutator(("don't freak, called from new": any));
    mutator.operations = operations;
    mutator.current = await mkCandidate(operations, start);
    return mutator;
  }

  done(): boolean {
    return this.current.fitness.fitness <= 0;
  }

  async nextMutation(): Promise<null | Candidate<A, Fitness>> {
    const mutated: Candidate<A, Fitness> = await mkCandidate(
      this.operations,
      this.operations.mutate(this.current.element)
    );
    const fitnessMargin = Math.floor(this.generationsWithoutSuccess / 10);
    if (
      mutated.fitness.fitness <=
      this.current.fitness.fitness + fitnessMargin
    ) {
      if (mutated.fitness.fitness < this.current.fitness.fitness) {
        this.generationsWithoutSuccess = 0;
      }
      this.current = mutated;
      return this.current;
    } else {
      this.generationsWithoutSuccess++;
      return null;
    }
  }
}
