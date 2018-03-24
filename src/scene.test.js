// @flow

import { Scene } from "./scene.js";

describe("player", () => {
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
});
