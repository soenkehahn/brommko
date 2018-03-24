// @flow

import React from "react";
import { mount } from "enzyme";
import { App } from "./App";
import { simulateKeyEvent } from "./test-utils";
import { Render } from "./Render";

describe("App", () => {
  it("renders without crashing", () => {
    const wrapper = mount(<App />);
  });

  it("relays keydowns to the scene", () => {
    const wrapper = mount(<App />);
    const initialY = wrapper.find(Render).props().scene.player.y;
    simulateKeyEvent("keydown", "ArrowUp");
    const lastY = wrapper.find(Render).props().scene.player.y;
    expect(lastY).toBeGreaterThan(initialY);
  });

  it("updates the App state", () => {
    const wrapper = mount(<App />);
    const state = wrapper.state();
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state()).not.toBe(state);
  });
});
