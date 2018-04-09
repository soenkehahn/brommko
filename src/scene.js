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

class Switch {
  pushed: boolean = false;
  position: Position;

  constructor(position: Position): void {
    this.position = position;
  }

  clone(): Switch {
    const result = new Switch(this.position);
    result.pushed = this.pushed;
    return result;
  }

  static handleSwitches(scene: Scene): boolean {
    let allPushed = true;
    for (const switsch of scene.switches) {
      if (_.isEqual(scene.player, switsch.position)) {
        switsch.pushed = true;
      }
      allPushed = allPushed && switsch.pushed;
    }
    return allPushed;
  }

  static random(): Switch {
    return new Switch(randomPosition());
  }

  static mutate(s: Switch): Switch {
    return new Switch(mutatePosition(s.position));
  }
}

export class Scene {
  player: Position = { x: 0, y: 0 };
  walls: Array<Position> = [];
  switches: Array<Switch> = [];
  goal: Position = { x: 0, y: 1 };
  success: boolean = false;

  clone(): Scene {
    const result = new Scene();
    result.player.x = this.player.x;
    result.player.y = this.player.y;
    for (const wall of this.walls) {
      result.walls.push(wall);
    }
    for (const s of this.switches) {
      result.switches.push(s.clone());
    }
    result.goal.x = this.goal.x;
    result.goal.y = this.goal.y;
    result.success = this.success;
    return result;
  }

  addSwitch(switsch: Position): void {
    this.switches.push(new Switch(switsch));
  }

  step(keycode: string): void {
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
      const allPushed: boolean = Switch.handleSwitches(this);
      if (_.isEqual(this.player, this.goal) && allPushed) {
        this.success = true;
      }
    }
  }
}

export function mutateScene(scene: Scene): Scene {
  const result = scene.clone();
  const r = Math.random();
  if (r < 1 / 3) {
    result.goal = mutatePosition(result.goal);
  } else if (r < 2 / 3) {
    result.walls = mutateArray(randomPosition, mutatePosition, result.walls);
  } else {
    result.switches = mutateArray(
      Switch.random,
      Switch.mutate,
      result.switches
    );
  }
  return result;
}

export function fillInWalls(scene: Scene): Scene {
  const result = scene.clone();
  const wantedPath = findPath(result);
  if (wantedPath == null) {
    throw "fillInWalls: can't find path";
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
  fitness: (scene: Scene) => sceneFitness(properties, scene),
  start: new Scene()
});

export async function mkScene(properties: SceneProperties): Promise<Scene> {
  const scene = await search(sceneSearchOptions(properties));
  return fillInWalls(scene);
}
