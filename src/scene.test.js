// @flow

import { Scene, fillInWalls, pathComplexity } from "./scene.js";
import { findPath } from "./findPath";
import _ from "lodash";

describe("player", () => {
  describe("simple movement", () => {
    it("starts at (0, 0)", () => {
      expect(new Scene().player).toEqual({ x: 0, y: 0 });
    });

    it("can be moved up", () => {
      const scene = new Scene();
      scene.step("ArrowUp");
      expect(scene.player).toEqual({ x: 0, y: 1 });
    });

    it("can be moved down", () => {
      const scene = new Scene();
      scene.step("ArrowDown");
      expect(scene.player).toEqual({ x: 0, y: -1 });
    });

    it("can be moved left", () => {
      const scene = new Scene();
      scene.step("ArrowLeft");
      expect(scene.player).toEqual({ x: -1, y: 0 });
    });

    it("can be moved right", () => {
      const scene = new Scene();
      scene.step("ArrowRight");
      expect(scene.player).toEqual({ x: 1, y: 0 });
    });
  });

  describe("walls", () => {
    it("prevents the player from entering walls", () => {
      const scene = new Scene();
      scene.walls = [{ x: 0, y: 1 }];
      scene.step("ArrowUp");
      expect(scene.player).toEqual({ x: 0, y: 0 });
    });
  });

  describe("goal", () => {
    it("sets success when the player reaches the goal", () => {
      const scene = new Scene();
      scene.goal = { x: 0, y: 1 };
      scene.step("ArrowUp");
      expect(scene.success).toBe(true);
    });

    it("stops simulating the game when goal is reached", () => {
      const scene = new Scene();
      scene.goal = { x: 0, y: 1 };
      scene.step("ArrowUp");
      scene.step("ArrowUp");
      expect(scene.player).toEqual({ x: 0, y: 1 });
    });
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

describe("fillInWalls", () => {
  it("fills in all possible walls", () => {
    const scene = fillInWalls(new Scene());
    expect(scene.walls).toContainEqual({ x: -3, y: -3 });
    expect(scene.walls).toContainEqual({ x: 3, y: 3 });
  });

  it("doesn't put a wall where the player is", async () => {
    const scene = await fillInWalls(new Scene());
    expect(scene.walls).not.toContainEqual({ x: 0, y: 0 });
  });
});
