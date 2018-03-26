// @flow

import { search, mutateScene, sceneFitness, pathComplexity } from "./search";
import { Scene } from "./scene";
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
      return Math.abs(42 - n);
    }

    const result = await search({ mutate: mutate, fitness: fitness, start: 0 });
    expect(result).toEqual(42);
  });

  it("aborts if finding a better fitness takes too long");

  it("finds a simple scene", async () => {
    const result = await search({
      mutate: mutateScene,
      fitness: sceneFitness(2),
      start: new Scene()
    });
    const solution = failNull(findPath(result));
    expect(solution.length).toEqual(2);
    expect(solution[0]).toEqual(solution[1]);
  });
});

describe("pathComplexity", () => {
  it("returns 0 for the empty path", () => {
    expect(pathComplexity([])).toEqual(0);
  });

  it("returns the path complexity", () => {
    expect(pathComplexity(["ArrowUp"])).toEqual(1);
    expect(pathComplexity(["ArrowUp", "ArrowUp"])).toEqual(2);
    expect(pathComplexity(["ArrowUp", "ArrowDown"])).toEqual(2.1);
    expect(pathComplexity(["ArrowUp", "ArrowUp", "ArrowLeft"])).toEqual(3.1);
  });

  it("judges longer paths as more complex", () => {
    expect(pathComplexity(["ArrowUp", "ArrowDown"])).toBeGreaterThan(
      pathComplexity(["ArrowUp"])
    );
  });

  it("judges changes in direction as more complex", () => {
    expect(pathComplexity(["ArrowUp", "ArrowLeft"])).toBeGreaterThan(
      pathComplexity(["ArrowUp", "ArrowUp"])
    );
  });
});
