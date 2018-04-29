// @flow

import { type Direction, Director } from "./director";
import { type SceneProperties, sceneFitness } from "./fitness";
import {
  arrayOf,
  enumeration,
  number,
  object,
  partialObject
} from "validated/schema";
import { findPath, simulate } from "./findPath";
import { mutateArray, randomInt, removeDuplicates } from "./utils";
import { pick } from "./random";
import { search } from "./search";
import { validate } from "validated/object";
import _ from "lodash";
import boxmuller from "box-muller";

const sceneSize = 5;

export type Position = { x: number, y: number };

export function randomPosition(): Position {
  return {
    x: randomInt(-sceneSize, sceneSize),
    y: randomInt(-sceneSize, sceneSize)
  };
}

export function mutatePosition(input: Position): Position {
  function sample(n: number): number {
    return Math.min(
      sceneSize,
      Math.max(-sceneSize, Math.round(n + boxmuller() * 2))
    );
  }
  const result = { x: sample(input.x), y: sample(input.y) };
  if (!_.isEqual(result, input)) {
    return result;
  } else {
    return mutatePosition(input);
  }
}

export class Switch {
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
  goal: Position = { x: 0, y: 1 };
  walls: Array<Position> = [];
  switches: Array<Switch> = [];
  directors: Array<Director> = [];
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
    for (const director of this.directors) {
      result.directors.push(director.clone());
    }
    result.goal.x = this.goal.x;
    result.goal.y = this.goal.y;
    result.success = this.success;
    return result;
  }

  static fromJSON(json: mixed): Scene {
    const positionSchema = object({
      x: number,
      y: number
    });
    const schema = partialObject({
      goal: positionSchema,
      walls: arrayOf(positionSchema),
      switches: arrayOf(partialObject({ position: positionSchema })),
      directors: arrayOf(
        partialObject({
          position: positionSchema,
          direction: enumeration("up", "right", "down", "left")
        })
      )
    });
    const valid = validate(schema, json);
    const scene = new Scene();
    scene.setGoal(valid.goal);
    scene.addWalls(valid.walls);
    for (const s of valid.switches) {
      scene.addSwitch(s.position);
    }
    for (const director of valid.directors) {
      scene.addDirector(director.position, director.direction);
    }
    return scene;
  }

  static mutate(scene: Scene): Scene {
    const result = scene.clone();
    pick(
      () => {
        result.goal = mutatePosition(result.goal);
      },
      () => {
        result.walls = mutateArray(
          randomPosition,
          mutatePosition,
          result.walls
        );
      },
      () => {
        result.switches = mutateArray(
          Switch.random,
          Switch.mutate,
          result.switches
        );
      },
      () => {
        result.directors = mutateArray(
          Director.random,
          Director.mutate,
          result.directors
        );
      }
    );
    result._normalize();
    return result;
  }

  static searchOperations(properties: SceneProperties) {
    return {
      mutate: Scene.mutate,
      fitness: (scene: Scene) => sceneFitness(properties, scene)
    };
  }

  setPlayer(position: Position) {
    this.player = position;
  }

  setGoal(position: Position) {
    this.goal = position;
  }

  addWalls(walls: Array<Position> | Position) {
    if (Array.isArray(walls)) {
      for (const wall of walls) {
        this.walls.push(wall);
      }
    } else {
      this.walls.push(walls);
    }
  }

  addSwitch(switsch: Position): void {
    this.switches.push(new Switch(switsch));
  }

  addDirector(position: Position, direction: Direction) {
    this.directors.push(new Director(position, direction));
  }

  _normalize(): void {
    this.walls = removeDuplicates(this.walls);
    this.walls = _.filter(this.walls, e => !_.isEqual(e, this.player));
    this.switches = removeDuplicates(this.switches);
    this.switches = _.filter(
      this.switches,
      e =>
        !(
          _.isEqual(e.position, this.player) || _.isEqual(e.position, this.goal)
        )
    );
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
      Director.handleDirectors(this);
      const allPushed: boolean = Switch.handleSwitches(this);
      if (_.isEqual(this.player, this.goal) && allPushed) {
        this.success = true;
      }
    }
  }
}

export async function fillInWalls(scene: Scene): Promise<Scene> {
  const result = scene.clone();
  const solution = await findPath(result);
  if (solution == null) {
    throw "fillInWalls: can't find path";
  }
  const wantedPath = solution.path;
  for (let x = -sceneSize; x <= sceneSize; x++) {
    for (let y = -sceneSize; y <= sceneSize; y++) {
      const position = { x, y };
      if (
        !_.some(result.walls, position) &&
        !_.isEqual(result.player, position)
      ) {
        const temporary = result.clone();
        temporary.addWalls(position);
        simulate(temporary, wantedPath);
        if (temporary.success) {
          result.addWalls(position);
        }
      }
    }
  }
  return result;
}

export async function mkScene(properties: SceneProperties): Promise<Scene> {
  const scene = await search(Scene.searchOperations(properties), new Scene());
  return fillInWalls(scene);
}
