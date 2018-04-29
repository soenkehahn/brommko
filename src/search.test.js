// @flow

import { type Operations, _tryMutation, search } from "./search";
import { Scene } from "./scene";
import { failNull } from "./testUtils";
import { findPath } from "./findPath";
import { pick } from "./random";
import { sceneFitness } from "./fitness";

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

  it("finds a simple scene", async () => {
    const result = await search(
      {
        mutate: Scene.mutate,
        fitness: scene =>
          sceneFitness(
            {
              pathLength: 2,
              directionChanges: 0,
              switches: 0,
              directors: 0
            },
            scene
          )
      },
      new Scene()
    );
    const solution = failNull(await findPath(result)).path;
    expect(solution.length).toEqual(2);
    expect(solution[0]).toEqual(solution[1]);
  });
});

describe("tryMutation", () => {
  it("mutates the given candidate and returns it, if fitter", async () => {
    const ops: Operations<number, { fitness: number }> = {
      mutate: n => n - 1,
      fitness: async n => ({ fitness: n })
    };
    const result = await _tryMutation(ops, {
      element: 10,
      fitness: await ops.fitness(10)
    });
    expect(failNull(result).element).toEqual(9);
  });

  it("mutates the given candidate and returns null, if not fitter", async () => {
    const ops: Operations<number, { fitness: number }> = {
      mutate: n => n + 1,
      fitness: async n => ({ fitness: n })
    };
    const result = await _tryMutation(ops, {
      element: 10,
      fitness: await ops.fitness(10)
    });
    expect(result).toEqual(null);
  });

  it("returns the mutation if equally fit", async () => {
    const ops: Operations<number, { fitness: number }> = {
      mutate: n => n,
      fitness: async n => ({ fitness: n })
    };
    const result = await _tryMutation(ops, {
      element: 10,
      fitness: await ops.fitness(10)
    });
    expect(failNull(result).element).toEqual(10);
  });
});
