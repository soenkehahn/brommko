// @flow

import { Scene } from "./scene.js";
import { findPath, mkAllPaths } from "./findPath";

describe("findPath", () => {
  it("finds a solution to a simple scene", () => {
    const scene = new Scene();
    expect(findPath(scene)).toEqual(["ArrowUp"]);
  });

  it("finds a longer solution", () => {
    const scene = new Scene();
    scene.setGoal({ x: 0, y: 3 });
    expect(findPath(scene)).toEqual(["ArrowUp", "ArrowUp", "ArrowUp"]);
  });

  it("aborts after trying many solutions", () => {
    const scene = new Scene();
    scene.setGoal({ x: 0, y: 2 });
    scene.addWalls([
      { x: -1, y: 3 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: -1, y: 2 },
      { x: 1, y: 2 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]);
    expect(findPath(scene)).toEqual(null);
  });
});

describe("mkAllPaths", () => {
  it("enumerates paths", () => {
    const allPaths = mkAllPaths(20);
    expect(allPaths.next()).toEqual(["ArrowUp"]);
    expect(allPaths.next()).toEqual(["ArrowLeft"]);
    expect(allPaths.next()).toEqual(["ArrowRight"]);
    expect(allPaths.next()).toEqual(["ArrowDown"]);
    expect(allPaths.next()).toEqual(["ArrowUp", "ArrowUp"]);
    expect(allPaths.next()).toEqual(["ArrowUp", "ArrowLeft"]);
    expect(allPaths.next()).toEqual(["ArrowUp", "ArrowRight"]);
    expect(allPaths.next()).toEqual(["ArrowUp", "ArrowDown"]);
    expect(allPaths.next()).toEqual(["ArrowLeft", "ArrowUp"]);
    expect(allPaths.next()).toEqual(["ArrowLeft", "ArrowLeft"]);
  });

  it("goes on for a long time", () => {
    const allPaths = mkAllPaths(20);
    for (const i of Array(1000)) {
      allPaths.next();
    }
    expect(allPaths.next()).toEqual([
      "ArrowRight",
      "ArrowRight",
      "ArrowLeft",
      "ArrowLeft",
      "ArrowUp"
    ]);
  });
});
