// @flow

import _ from "lodash";

export type Position = { x: number, y: number };

export class Scene {
  player: Position;

  walls: Set<Position>;

  constructor() {
    this.player = { x: 0, y: 0 };
    this.walls = new Set();
  }

  step(keycode: string) {
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
    const isInWall = _.some(Array.from(this.walls), newPlayer);
    if (!isInWall) {
      this.player = newPlayer;
    }
  }
}
