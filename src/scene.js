// @flow

import _ from "lodash";
import { randomInt, deleteIndex, mutateArray } from "./utils";
import { findPath, simulate } from "./findPath";
import { search } from "./search";
import { type SceneProperties, sceneFitness } from "./fitness";

const sceneSize = 5;

export type Position = { x: number, y: number };

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
  player: Position = { x: 0, y: 0 };
  walls: Array<Position> = [];
  goal: Position = { x: 0, y: 1 };
  success: boolean = false;

  clone(): Scene {
    const result = new Scene();
    result.player.x = this.player.x;
    result.player.y = this.player.y;
    for (const wall of this.walls) {
      result.walls.push(wall);
    }
    result.goal.x = this.goal.x;
    result.goal.y = this.goal.y;
    result.success = this.success;
    return result;
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
}

export function mutateScene(scene: Scene): Scene {
  const result = scene.clone();
  if (Math.random() < 0.5) {
    result.goal = mutatePosition(result.goal);
  } else {
    result.walls = mutateArray(randomPosition, mutatePosition, result.walls);
  }
  return result;
}

export function fillInWalls(scene: Scene): Scene {
  const result = scene.clone();
  const wantedPath = findPath(result);
  if (wantedPath == null) {
    throw "foo";
  }
  for (let x = -sceneSize; x <= sceneSize; x++) {
    for (let y = -sceneSize; y <= sceneSize; y++) {
      const position = { x, y };
      if (
        !_.some(result.walls, position) &&
        !_.isEqual(result.player, position)
      ) {
        const temporary = result.clone();
        temporary.walls.push(position);
        simulate(temporary, wantedPath);
        if (temporary.success) {
          result.walls.push(position);
        }
      }
    }
  }
  return result;
}

export const sceneSearchOptions = (properties: SceneProperties) => ({
  mutate: mutateScene,
  fitness: sceneFitness(properties),
  start: new Scene()
});

export async function mkScene(properties: SceneProperties): Promise<Scene> {
  const scene = await search(sceneSearchOptions(properties));
  return fillInWalls(scene);
}
