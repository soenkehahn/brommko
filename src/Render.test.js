// @flow

import { mount } from "enzyme";
import React from "react";
import { Render } from "./Render.js";
import { Scene } from "./scene.js";
import { simulateKeyEvent } from "./test-utils";

describe("renderScene", () => {
  it("renders the player", () => {
    const wrapper = mount(<Render scene={new Scene()} />);
    expect(wrapper.find("rect")).toExist();
  });

  it("updates the player on scene changes", () => {
    const scene = new Scene();
    const wrapper = mount(<Render scene={scene} />);
    const initialY = wrapper.find("rect").props().y;
    scene.step("ArrowUp");
    wrapper.setProps({ scene: scene });
    const lastY = wrapper.find("rect").props().y;
    expect(lastY).toBeLessThan(initialY);
  });

  function getPlayerProps(scene) {
    const wrapper = mount(<Render scene={scene} />);
    return wrapper.find("rect").props();
  }

  it("renders the x position", () => {
    const scene = new Scene();
    const initialProps = getPlayerProps(scene);
    scene.player.x = 3;
    const nextProps = getPlayerProps(scene);
    expect(nextProps.x).toBeGreaterThan(initialProps.x);
  });
});
