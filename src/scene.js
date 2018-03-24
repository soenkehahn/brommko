// @flow

export class Scene {
  player: { x: number, y: number };

  constructor() {
    this.player = { x: 0, y: 0 };
  }

  step(controls: string) {
    this.player.y++;
  }
}
