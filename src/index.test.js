// @flow

import { Scene } from "./scene";
import { readLevels } from "./index";

describe("readLevels", () => {
  it("works", () => {
    const levels: Array<Scene> = readLevels();
    expect(levels[0].player).toEqual({ x: 0, y: 0 });
  });
});
