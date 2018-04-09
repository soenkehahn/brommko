// @flow

import { search } from "./search";
import { Scene, mutateScene } from "./scene";
import { sceneFitness } from "./fitness";
import { findPath } from "./findPath";
import { failNull } from "./testUtils";

describe("search", () => {
  it("finds solutions to a simple problem", async () => {
    function mutate(n) {
      if (Math.random() < 0.5) {
        return n + 1;
      } else {
        return n - 1;
      }
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
      fitness: sceneFitness({
        pathLength: 2,
        directionChanges: 0,
        switches: 0
      }),
      start: new Scene()
    });
    const solution = failNull(findPath(result));
    expect(solution.length).toEqual(2);
    expect(solution[0]).toEqual(solution[1]);
  });
});
