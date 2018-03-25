// @flow

import _ from "lodash";
import { deleteIndex } from "./utils";

const sceneSize = 3;

export type Position = { x: number, y: number };

function randomInt(lower, upper) {
  return Math.floor(Math.random() * Math.floor(1 + upper - lower)) + lower;
}

function randomPosition(): Position {
  return {
    x: randomInt(-sceneSize, sceneSize),
    y: randomInt(-sceneSize, sceneSize)
  };
}

function mutatePosition({ x, y }): Position {
  if (Math.random() < 1 / 3) {
    return { x: randomInt(-sceneSize, sceneSize), y };
  } else if (Math.random() < 2 / 3) {
    return { x, y: randomInt(-sceneSize, sceneSize) };
  } else {
    return {
      x: randomInt(-sceneSize, sceneSize),
      y: randomInt(-sceneSize, sceneSize)
    };
  }
}

export class Scene {
  player: Position;

  walls: Array<Position>;

  goal: Position;

  success: boolean;

  constructor() {
    this.player = { x: 0, y: 0 };
    this.walls = [];
    this.goal = { x: 0, y: 1 };
    this.success = false;
  }

  step(keycode: string) {
    if (!this.success) {
      const newPlayer = _.cloneDeep(this.player);
      if (keycode === "ArrowUp") {
        newPlayer.y++;
      } else if (keycode === "ArrowDown") {
        newPlayer.y--;
      } else if (keycode === "ArrowLeft") {
        newPlayer.x--;
      } else if (keycode === "ArrowRight") {
        newPlayer.x++;
      }
      const isInWall = _.some(this.walls, newPlayer);
      if (!isInWall) {
        this.player = newPlayer;
      }
      if (_.isEqual(this.player, this.goal)) {
        this.success = true;
      }
    }
  }

  mutate() {
    if (Math.random() < 0.5) {
      this.goal = mutatePosition(this.goal);
    } else {
      this.walls = mutateArray(randomPosition, mutatePosition, this.walls);
    }
  }
}

function mutateArray<A>(
  mkNew: () => A,
  mutate: A => A,
  array: Array<A>
): Array<A> {
  const random = Math.random();
  if (random < 1 / (array.length + 1)) {
    return array.concat([mkNew()]);
  } else {
    const index = randomInt(0, array.length - 1);
    if (Math.random() < 0.3) {
      return deleteIndex(array, index);
    } else {
      array[index] = mutate(array[index]);
      return array;
    }
  }
}

export function shrinkScene(scene: Scene): Array<Scene> {
  const results = [];
  for (let x = -sceneSize; x <= sceneSize; x++) {
    for (let y = -sceneSize; y <= sceneSize; y++) {
      const position = { x, y };
      if (!_.some(scene.walls, position)) {
        const clone = _.cloneDeep(scene);
        clone.walls.push(position);
        results.push(clone);
      }
    }
  }
  return results;
}
