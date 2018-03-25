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
    scene.goal = { x: 0, y: 3 };
    expect(findPath(scene)).toEqual(["ArrowUp", "ArrowUp", "ArrowUp"]);
  });
});

describe("mkAllPaths", () => {
  it("enumerates paths", () => {
    const allPaths = mkAllPaths();
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
    const allPaths = mkAllPaths();
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
