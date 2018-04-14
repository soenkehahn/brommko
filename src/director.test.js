// @flow

import React from "react";
import { Scene } from "./scene";
import { Director } from "./director";
import { Render } from "./render";
import { mount } from "enzyme";

describe("director", () => {
  describe("render", () => {
    it("renders without crashing", () => {
      const scene = new Scene();
      scene.addDirector({ x: 0, y: 0 }, "up");
      scene.addDirector({ x: 1, y: 0 }, "right");
      scene.addDirector({ x: 2, y: 0 }, "down");
      scene.addDirector({ x: 3, y: 0 }, "left");
      const wrapper = mount(<Render scene={scene} />);
    });

    it("returns a polygon with a correct position (through a translate transform)", () => {
      const director = new Director({ x: 3, y: 4 }, "left");
      const render = new Render();
      const expected = {
        x: render.svgWidth / 2 + render.size * 3 + render.size / 2,
        y: render.svgHeight / 2 + render.size * -4 + render.size / 2
      };
      expect(director.render(render, 0).props.transform).toEqual(
        `translate(${expected.x} ${expected.y})`
      );
    });
  });

  it("remembers when player passes through the director", () => {
    const scene = new Scene();
    scene.addDirector({ x: -1, y: 0 }, "left");
    expect(scene.directors[0].passed).toEqual(false);
    scene.step("ArrowLeft");
    expect(scene.directors[0].passed).toEqual(true);
  });

  test("'up' pushes the player up", () => {
    const scene = new Scene();
    scene.addDirector({ x: -1, y: 0 }, "up");
    scene.step("ArrowLeft");
    expect(scene.player).toEqual({ x: -1, y: 1 });
  });

  test("'right' pushes the player to the right", () => {
    const scene = new Scene();
    scene.addDirector({ x: -1, y: 0 }, "right");
    scene.step("ArrowLeft");
    expect(scene.player).toEqual({ x: 0, y: 0 });
  });

  test("'down' pushes the player down", () => {
    const scene = new Scene();
    scene.addDirector({ x: -1, y: 0 }, "down");
    scene.step("ArrowLeft");
    expect(scene.player).toEqual({ x: -1, y: -1 });
  });

  it("'left' pushes the player to the left", () => {
    const scene = new Scene();
    scene.addDirector({ x: -1, y: 0 }, "left");
    scene.step("ArrowLeft");
    expect(scene.player).toEqual({ x: -2, y: 0 });
  });
});
