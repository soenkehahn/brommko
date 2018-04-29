// @flow

import { Scene } from "./scene";
import { failNull } from "./testUtils";
import { findPath, mkAllPaths } from "./findPath";

describe("findPath", () => {
  it("finds a solution to a simple scene", async () => {
    const scene = new Scene();
    expect(failNull(await findPath(scene)).path).toEqual(["ArrowUp"]);
  });

  it("also returns the solved scene", async () => {
    const scene = new Scene();
    const solved: Scene = failNull(await findPath(scene)).scene;
    expect(solved.success).toEqual(true);
  });

  it("finds a longer solution", async () => {
    const scene = new Scene();
    scene.setGoal({ x: 0, y: 3 });
    expect(failNull(await findPath(scene)).path).toEqual([
      "ArrowUp",
      "ArrowUp",
      "ArrowUp"
    ]);
  });

  it("aborts after trying many solutions", async () => {
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
    expect(await findPath(scene)).toEqual(null);
  });
});

describe("mkAllPaths", () => {
  it("enumerates paths", async () => {
    const allPaths = mkAllPaths(20);
    expect(await allPaths.next()).toEqual(["ArrowUp"]);
    expect(await allPaths.next()).toEqual(["ArrowLeft"]);
    expect(await allPaths.next()).toEqual(["ArrowRight"]);
    expect(await allPaths.next()).toEqual(["ArrowDown"]);
    expect(await allPaths.next()).toEqual(["ArrowUp", "ArrowUp"]);
    expect(await allPaths.next()).toEqual(["ArrowUp", "ArrowLeft"]);
    expect(await allPaths.next()).toEqual(["ArrowUp", "ArrowRight"]);
    expect(await allPaths.next()).toEqual(["ArrowUp", "ArrowDown"]);
    expect(await allPaths.next()).toEqual(["ArrowLeft", "ArrowUp"]);
    expect(await allPaths.next()).toEqual(["ArrowLeft", "ArrowLeft"]);
  });

  it("goes on for a long time", async () => {
    const allPaths = mkAllPaths(20);
    for (const _i of Array(1000)) {
      allPaths.next();
    }
    expect(await allPaths.next()).toEqual([
      "ArrowRight",
      "ArrowRight",
      "ArrowLeft",
      "ArrowLeft",
      "ArrowUp"
    ]);
  });
});
