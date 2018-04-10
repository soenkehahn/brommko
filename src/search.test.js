// @flow

import { search } from "./search";
import { Scene, mutateScene } from "./scene";
import { sceneFitness } from "./fitness";
import { findPath } from "./findPath";
import { failNull } from "./testUtils";
import { pick } from "./random";

describe("search", () => {
  it("finds solutions to a simple problem", async () => {
    function mutate(n: number): number {
      return pick(() => n + 1, () => n - 1);
    }

    function fitness(n) {
      return { fitness: Math.abs(42 - n) };
    }

    const result = await search({ mutate: mutate, fitness: fitness, start: 0 });
    expect(result).toEqual(42);
  });

  it("finds a simple scene", async () => {
    const result = await search({
      mutate: mutateScene,
      fitness: scene =>
        sceneFitness(
          {
            pathLength: 2,
            directionChanges: 0,
            switches: 0
          },
          scene
        ),
      start: new Scene()
    });
    const solution = failNull(findPath(result));
    expect(solution.length).toEqual(2);
    expect(solution[0]).toEqual(solution[1]);
  });
});
