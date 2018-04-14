// @flow

import { Render } from "./render";
import { Scene } from "../scene";
import { mkPlayScene } from "./playScene";
import { mount } from "enzyme";
import { simulateKeyEvent } from "../testUtils";
import React from "react";

describe("PlayScene", () => {
  it("renders without crashing", () => {
    const PlayScene = mkPlayScene(new Scene());
    mount(<PlayScene />);
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
