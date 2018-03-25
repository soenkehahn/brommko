// @flow

import React from "react";
import { mount } from "enzyme";
import { mkApp } from "./app";
import { simulateKeyEvent } from "./testUtils";
import { Render } from "./render";
import { Scene } from "./scene";

describe("App", () => {
  it("renders without crashing", () => {
    const App = mkApp(new Scene());
    const wrapper = mount(<App />);
  });

  it("relays keydowns to the scene", () => {
    const App = mkApp(new Scene());
    const wrapper = mount(<App />);
    const initialY = wrapper.find(Render).props().scene.player.y;
    simulateKeyEvent("keydown", "ArrowUp");
    const lastY = wrapper.find(Render).props().scene.player.y;
    expect(lastY).toBeGreaterThan(initialY);
  });

  it("updates the App state", () => {
    const App = mkApp(new Scene());
    const wrapper = mount(<App />);
    const state = wrapper.state();
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state()).not.toBe(state);
  });
});
