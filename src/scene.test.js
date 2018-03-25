// @flow

import { Scene, shrinkScene } from "./scene.js";
import { findPath } from "./findPath";
import { runShrink } from "./shrink";
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

  describe("shrinkScene", () => {
    it("terminates", async () => {
      const scene = new Scene();
      scene.goal = { x: 0, y: 2 };
      const predicate = scene =>
        _.isEqual(findPath(2, scene), ["ArrowUp", "ArrowUp"]);
      await runShrink(scene, shrinkScene, predicate);
    });

    it("fills cells with walls");

    it("enumrates scenes with single added walls", () => {
      const stream = shrinkScene(new Scene());
      expect((stream.next(): any).walls).toEqual([{ x: -3, y: -3 }]);
      expect((stream.next(): any).walls).toEqual([{ x: -2, y: -3 }]);
      expect((stream.next(): any).walls).toEqual([{ x: -1, y: -3 }]);
    });
  });
});
