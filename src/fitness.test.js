// @flow

import { Scene } from "./scene";
import { sceneFitness } from "./fitness";

describe("sceneFitness", () => {
  let scene;
  beforeEach(() => {
    scene = new Scene();
  });

  describe("path length", () => {
    describe("when training for a path length of 2", () => {
      it("returns zero for a path length of 2", () => {
        scene.setGoal({ x: 2, y: 0 });
        const fitness: number = sceneFitness(
          {
            pathLength: 2,
            directionChanges: 0,
            switches: 0,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(0);
      });

      it("it returns the distance to the wanted value for longer paths", () => {
        scene.setGoal({ x: 3, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 2,
            directionChanges: 0,
            switches: 0,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(1);
      });

      it("it returns the distance to the wanted value for shorter paths", () => {
        scene.setGoal({ x: 1, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 2,
            directionChanges: 0,
            switches: 0,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(1);
      });
    });
  });

  describe("direction changes", () => {
    describe("when requesting 1 direction change", () => {
      it("returns zero for an optimal solution", () => {
        scene.setGoal({ x: 1, y: 1 });
        const fitness = sceneFitness(
          {
            pathLength: 2,
            directionChanges: 1,
            switches: 0,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(0);
      });

      it("returns the distance for more direction changes", () => {
        scene.addWalls({ x: 0, y: 2 });
        scene.addWalls({ x: 1, y: 0 });
        scene.setGoal({ x: 1, y: 2 });
        const fitness = sceneFitness(
          {
            pathLength: 3,
            directionChanges: 1,
            switches: 0,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(10);
      });

      it("returns the distance for less direction changes", () => {
        scene.setGoal({ x: 2, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 2,
            directionChanges: 1,
            switches: 0,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(10);
      });
    });
  });

  describe("number of switches", () => {
    describe("when requesting 2 switches", () => {
      it("returns zero for an optimal solution", () => {
        scene.addSwitch({ x: 1, y: 0 });
        scene.addSwitch({ x: 2, y: 0 });
        scene.setGoal({ x: 4, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 4,
            directionChanges: 0,
            switches: 2,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(0);
      });

      it("returns the distance for more switches", () => {
        scene.addSwitch({ x: 1, y: 0 });
        scene.addSwitch({ x: 2, y: 0 });
        scene.addSwitch({ x: 3, y: 0 });
        scene.setGoal({ x: 4, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 4,
            directionChanges: 0,
            switches: 2,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(100);
      });

      it("returns the distance for less switches", () => {
        scene.addSwitch({ x: 1, y: 0 });
        scene.setGoal({ x: 4, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 4,
            directionChanges: 0,
            switches: 2,
            directors: 0
          },
          scene
        ).fitness;
        expect(fitness).toEqual(100);
      });
    });
  });

  describe("number of directors", () => {
    describe("when requesting one passed director", () => {
      it("returns zero for an optimal solution", () => {
        scene.addDirector({ x: 0, y: 1 }, "left");
        scene.setGoal({ x: -1, y: 4 });
        const fitness = sceneFitness(
          {
            pathLength: 4,
            directionChanges: 0,
            switches: 0,
            directors: 1
          },
          scene
        ).fitness;
        expect(fitness).toEqual(0);
      });

      it("returns the distance for less directors", () => {
        scene.setGoal({ x: 4, y: 0 });
        const fitness = sceneFitness(
          {
            pathLength: 4,
            directionChanges: 0,
            switches: 0,
            directors: 1
          },
          scene
        ).fitness;
        expect(fitness).toEqual(100);
      });

      it("returns the distance for more directors", () => {
        scene.addDirector({ x: 0, y: 1 }, "left");
        scene.addDirector({ x: -1, y: 2 }, "left");
        scene.setGoal({ x: -2, y: 4 });
        const fitness = sceneFitness(
          {
            pathLength: 4,
            directionChanges: 0,
            switches: 0,
            directors: 1
          },
          scene
        ).fitness;
        expect(fitness).toEqual(100);
      });
    });
  });
});
