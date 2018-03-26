// @flow

import React from "react";
import { mount } from "enzyme";
import { mkPlayScene } from "./playScene";
import { simulateKeyEvent } from "./testUtils";
import { Render } from "./render";
import { Scene } from "./scene";

describe("PlayScene", () => {
  it("renders without crashing", () => {
    const PlayScene = mkPlayScene(new Scene());
    const wrapper = mount(<PlayScene />);
  });

  it("relays keydowns to the scene", () => {
    const PlayScene = mkPlayScene(new Scene());
    const wrapper = mount(<PlayScene />);
    const initialY = wrapper.find(Render).props().scene.player.y;
    simulateKeyEvent("keydown", "ArrowUp");
    const lastY = wrapper.find(Render).props().scene.player.y;
    expect(lastY).toBeGreaterThan(initialY);
  });

  it("updates the PlayScene state", () => {
    const PlayScene = mkPlayScene(new Scene());
    const wrapper = mount(<PlayScene />);
    const state = wrapper.state();
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state()).not.toBe(state);
  });
});
