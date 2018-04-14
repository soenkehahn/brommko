// @flow

import React, { type Element } from "react";
import { type Position, randomPosition, mutatePosition, Scene } from "./scene";
import { Render } from "./render";
import { pick } from "./random";
import _ from "lodash";

export type Direction = "up" | "right" | "down" | "left";

function randomDirection(): Direction {
  return pick(() => "up", () => "right", () => "down", () => "left");
}

export class Director {
  position: Position;
  direction: Direction;
  passed: boolean = false;

  constructor(position: Position, direction: Direction): void {
    this.position = position;
    this.direction = direction;
  }

  clone(): Director {
    return new Director(this.position, this.direction);
  }

  static random(): Director {
    return new Director(randomPosition(), randomDirection());
  }

  static mutate(director: Director): Director {
    const result = director.clone();
    pick(
      () => {
        result.position = mutatePosition(result.position);
      },
      () => {
        result.direction = randomDirection();
      }
    );
    return result;
  }

  static handleDirectors(scene: Scene) {
    for (const director of scene.directors) {
      if (_.isEqual(scene.player, director.position)) {
        director.passed = true;
        if (director.direction === "up") {
          scene.player.y += 1;
        } else if (director.direction === "right") {
          scene.player.x += 1;
        } else if (director.direction === "down") {
          scene.player.y -= 1;
        } else if (director.direction === "left") {
          scene.player.x -= 1;
        } else {
          throw `handleDirectors: NYI: ${director.direction}`;
        }
      }
    }
  }

  render(render: Render, key: number): Element<*> {
    const len = render.size / 2 * 0.6;
    function mkPoints(direction: Direction) {
      if (direction === "up") {
        return `0,${-len} ${len},0 ${-len},0`;
      } else if (direction === "right") {
        return `0,${-len} ${len},0 0,${len}`;
      } else if (direction === "down") {
        return `${len},0 0,${len} ${-len},0`;
      } else if (direction === "left") {
        return `0,${-len} 0,${len} ${-len},0`;
      } else {
        throw `mkPoints: NYI: ${direction}`;
      }
    }
    return (
      <polygon
        points={mkPoints(this.direction)}
        transform={render.mkPositionTransform(this.position)}
        fill="yellow"
        key={key}
      />
    );
  }
}
