// @flow

import { Mutator, type Operations, search } from "./search";
import { failNull } from "./testUtils";
import { pick } from "./random";

describe("search", () => {
  it("finds solutions to a simple problem", async () => {
    function mutate(n: number): number {
      return pick(() => n + 1, () => n - 1);
    }

    async function fitness(n) {
      return { fitness: Math.abs(42 - n) };
    }

    const result = await search({ mutate: mutate, fitness: fitness }, 0);
    expect(result).toEqual(42);
  });
});

describe("nextMutation", () => {
  it("mutates the given candidate and returns it, if fitter", async () => {
    const ops: Operations<number, { fitness: number }> = {
      mutate: n => n - 1,
      fitness: async n => ({ fitness: n })
    };
    const mutator = await Mutator.create(ops, 10);
    expect(failNull(await mutator.nextMutation()).element).toEqual(9);
  });

  it("mutates the given candidate and returns null, if not fitter", async () => {
    const ops: Operations<number, { fitness: number }> = {
      mutate: n => n + 1,
      fitness: async n => ({ fitness: n })
    };
    const mutator = await Mutator.create(ops, 10);
    expect(await mutator.nextMutation()).toEqual(null);
  });

  it("returns the mutation if equally fit", async () => {
    const ops: Operations<number, { fitness: number }> = {
      mutate: n => n,
      fitness: async n => ({ fitness: n })
    };
    const mutator = await Mutator.create(ops, 10);
    expect(failNull(await mutator.nextMutation()).element).toEqual(10);
  });
});
