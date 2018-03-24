// @flow

import { Scene } from "./scene.js";

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
      scene.walls = new Set([{ x: 0, y: 1 }]);
      scene.step("ArrowUp");
      expect(scene.player).toEqual({ x: 0, y: 0 });
    });
  });
});
