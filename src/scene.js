// @flow

export class Scene {
  player: { x: number, y: number };

  constructor() {
    this.player = { x: 0, y: 0 };
  }

  step(keycode: string) {
    if (keycode === "ArrowUp") {
      this.player.y++;
    } else if (keycode === "ArrowDown") {
      this.player.y--;
    } else if (keycode === "ArrowLeft") {
      this.player.x--;
    } else if (keycode === "ArrowRight") {
      this.player.x++;
    }
  }
}
