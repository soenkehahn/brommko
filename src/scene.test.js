// @flow

import { Scene, Switch, fillInWalls } from "./scene.js";
import { findPath } from "./findPath";
import { removeDuplicates } from "./utils";
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
      scene.addWalls({ x: 0, y: 1 });
      scene.step("ArrowUp");
      expect(scene.player).toEqual({ x: 0, y: 0 });
    });
  });

  describe("goal", () => {
    it("sets success when the player reaches the goal", () => {
      const scene = new Scene();
      scene.setGoal({ x: 0, y: 1 });
      scene.step("ArrowUp");
      expect(scene.success).toBe(true);
    });

    it("stops simulating the game when goal is reached", () => {
      const scene = new Scene();
      scene.setGoal({ x: 0, y: 1 });
      scene.step("ArrowUp");
      scene.step("ArrowUp");
      expect(scene.player).toEqual({ x: 0, y: 1 });
    });
  });
});

describe("switches", () => {
  describe("levels with one switch", () => {
    let scene;

    beforeEach(() => {
      scene = new Scene();
      scene.addSwitch({ x: 1, y: 0 });
    });

    it("switches a switch on when touched", () => {
      expect(scene.switches.map(x => x.pushed)).toEqual([false]);
      scene.step("ArrowRight");
      expect(scene.switches.map(x => x.pushed)).toEqual([true]);
    });

    it("doesn't allow to finish the level if there are unswitched switches", () => {
      scene.step("ArrowUp");
      expect(scene.success).toEqual(false);
    });

    it("allows to finish a level after touching a switch", () => {
      scene.step("ArrowRight");
      scene.step("ArrowLeft");
      scene.step("ArrowUp");
      expect(scene.success).toEqual(true);
    });
  });

  describe("levels with more switches", () => {
    let scene;

    beforeEach(() => {
      scene = new Scene();
      scene.addSwitch({ x: 1, y: 0 });
      scene.addSwitch({ x: 1, y: 1 });
    });

    it("allows to finish the level after touching all switches", () => {
      scene.step("ArrowRight");
      scene.step("ArrowUp");
      scene.step("ArrowLeft");
      expect(scene.success).toEqual(true);
    });

    it("doesn't allow to finish the level after touching only a subset of switches", () => {
      scene.step("ArrowRight");
      scene.step("ArrowLeft");
      scene.step("ArrowUp");
      expect(scene.success).toEqual(false);
    });
  });
});

describe("fillInWalls", () => {
  it("fills in all possible walls", () => {
    const scene = fillInWalls(new Scene());
    expect(scene.walls).toContainEqual({ x: -3, y: -3 });
    expect(scene.walls).toContainEqual({ x: 3, y: 3 });
  });

  it("doesn't put a wall where the player is", async () => {
    const scene = fillInWalls(new Scene());
    expect(scene.walls).not.toContainEqual({ x: 0, y: 0 });
  });
});

describe("Scene", () => {
  function toJSON(x) {
    return JSON.parse(JSON.stringify(x));
  }

  describe("clone", () => {
    it("copies all mutating fields", () => {
      let scene = new Scene();
      expect(toJSON(scene.clone())).toEqual(toJSON(scene));
      for (let i = 0; i <= 100; i++) {
        scene = Scene.mutate(scene);
        expect(toJSON(scene.clone())).toEqual(toJSON(scene));
      }
    });

    it("copies the player and success", () => {
      const scene = new Scene();
      scene.player = { x: 13, y: 42 };
      scene.success = true;
      expect(scene.clone().player).toEqual({ x: 13, y: 42 });
      expect(scene.clone().success).toEqual(true);
    });
  });

  describe("_normalize", () => {
    it("removes wall duplicates", () => {
      const scene = new Scene();
      scene.addWalls({ x: 1, y: 1 });
      scene.addWalls({ x: 1, y: 1 });
      scene._normalize();
      expect(Array.from(scene.walls)).toEqual([{ x: 1, y: 1 }]);
    });

    it("removes switch duplicates", () => {
      const scene = new Scene();
      scene.addSwitch({ x: 1, y: 1 });
      scene.addSwitch({ x: 1, y: 1 });
      scene._normalize();
      expect(Array.from(scene.switches)).toEqual([new Switch({ x: 1, y: 1 })]);
    });

    it("removes walls below the player", () => {
      const scene = new Scene();
      scene.addWalls({ x: 0, y: 0 });
      scene._normalize();
      expect(Array.from(scene.walls)).toEqual([]);
    });

    it("removes switches below the player", () => {
      const scene = new Scene();
      scene.addSwitch({ x: 0, y: 0 });
      scene._normalize();
      expect(Array.from(scene.switches)).toEqual([]);
    });

    it("removes switches below the goal", () => {
      const scene = new Scene();
      scene.addSwitch({ x: 0, y: 1 });
      scene._normalize();
      expect(Array.from(scene.switches)).toEqual([]);
    });

    it("does not modify a valid level", () => {
      const scene = new Scene();
      scene.addSwitch({ x: 1, y: 1 });
      scene.addWalls({ x: 2, y: 2 });
      const before = toJSON(scene);
      scene._normalize();
      const after = toJSON(scene);
      expect(after).toEqual(before);
    });
  });
});

describe("mutate", () => {
  it("calls _normalize", () => {
    let scene = new Scene();
    scene.addWalls({ x: 2, y: 3 });
    scene.addWalls({ x: 2, y: 3 });
    expect(scene.walls).toEqual([{ x: 2, y: 3 }, { x: 2, y: 3 }]);
    scene = Scene.mutate(scene);
    expect(scene.walls).toEqual(removeDuplicates(scene.walls));
  });
});
