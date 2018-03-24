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

  function getPlayerProps(wrapper) {
    return wrapper
      .find("rect")
      .findWhere(x => x.props().fill === "blue")
      .props();
  }

  function renderPlayerProps(scene) {
    const wrapper = mount(<Render scene={scene} />);
    return getPlayerProps(wrapper);
  }

  it("updates the player on scene changes", () => {
    const scene = new Scene();
    const wrapper = mount(<Render scene={scene} />);
    const initialY = getPlayerProps(wrapper).y;
    scene.step("ArrowUp");
    wrapper.setProps({ scene: scene });
    const lastY = getPlayerProps(wrapper).y;
    expect(lastY).toBeLessThan(initialY);
  });

  it("renders the x position", () => {
    const scene = new Scene();
    const initialProps = renderPlayerProps(scene);
    scene.player.x = 3;
    const nextProps = renderPlayerProps(scene);
    expect(nextProps.x).toBeGreaterThan(initialProps.x);
  });
});
