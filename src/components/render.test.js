// @flow

import { Render } from "./render.js";
import { Scene } from "../scene";
import { mount } from "enzyme";
import React from "react";

describe("renderScene", () => {
  it("renders the player", () => {
    const wrapper = mount(<Render scene={new Scene()} />);
    expect(wrapper.find("polygon")).toExist();
  });

  function getPlayerProps(wrapper) {
    return wrapper
      .find("polygon")
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
    const initialTransform = getPlayerProps(wrapper).transform;
    scene.step("ArrowUp");
    wrapper.setProps({ scene: scene });
    const lastTransform = getPlayerProps(wrapper).transform;
    expect(lastTransform).not.toEqual(initialTransform);
  });

  it("renders the x position", () => {
    const scene = new Scene();
    const initialProps = renderPlayerProps(scene);
    scene.setPlayer({ x: 3, y: 0 });
    const nextProps = renderPlayerProps(scene);
    expect(nextProps.transform).not.toEqual(initialProps.transform);
  });

  it("renders a success message", () => {
    const scene = new Scene();
    const wrapper = mount(<Render scene={scene} />);
    scene.step("ArrowUp");
    wrapper.setProps({ scene: scene });
    expect(wrapper.text()).toEqual("Success!!!");
  });
});
