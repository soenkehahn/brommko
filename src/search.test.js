// @flow

import { Scene } from "./scene";
import { failNull } from "./testUtils";
import { findPath } from "./findPath";
import { pick } from "./random";
import { sceneFitness } from "./fitness";
import { search } from "./search";

describe("search", () => {
  it("finds solutions to a simple problem", async () => {
    function mutate(n: number): number {
      return pick(() => n + 1, () => n - 1);
    }

    async function fitness(n) {
      return { fitness: Math.abs(42 - n) };
    }

    const result = await search({ mutate: mutate, fitness: fitness, start: 0 });
    expect(result).toEqual(42);
  });

  it("finds a simple scene", async () => {
    const result = await search({
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
        ),
      start: new Scene()
    });
    const solution = failNull(await findPath(result)).path;
    expect(solution.length).toEqual(2);
    expect(solution[0]).toEqual(solution[1]);
  });
});
