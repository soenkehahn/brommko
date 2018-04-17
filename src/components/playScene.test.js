// @flow

import { Render } from "./render";
import { Scene } from "../scene";
import { mkPlayScene } from "./playScene";
import { mount } from "enzyme";
import { simulateKeyEvent } from "../testUtils";
import React from "react";

describe("PlayScene", () => {
  it("renders without crashing", () => {
    const PlayScene = mkPlayScene([new Scene()]);
    mount(<PlayScene />);
  });

  it("relays keydowns to the scene", () => {
    const PlayScene = mkPlayScene([new Scene()]);
    const wrapper = mount(<PlayScene />);
    const initialY = wrapper.find(Render).props().scene.player.y;
    simulateKeyEvent("keydown", "ArrowUp");
    const lastY = wrapper.find(Render).props().scene.player.y;
    expect(lastY).toBeGreaterThan(initialY);
  });

  it("updates the PlayScene state", () => {
    const PlayScene = mkPlayScene([new Scene()]);
    const wrapper = mount(<PlayScene />);
    const state = wrapper.state();
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state()).not.toBe(state);
  });

  it("does not switch to the next scene when the scene is not completed", () => {
    const first = new Scene();
    const second = new Scene();
    const PlayScene = mkPlayScene([first, second]);
    const wrapper = mount(<PlayScene />);
    simulateKeyEvent("keydown", "ArrowLeft");
    expect(wrapper.state().scene).toBe(first);
  });

  it("switches to the next scene when the scene is completed", () => {
    const first = new Scene();
    const second = new Scene();
    const PlayScene = mkPlayScene([first, second]);
    const wrapper = mount(<PlayScene />);
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state().scene).toBe(second);
  });

  it("switches to the third scene when the secon scene is completed", () => {
    const first = new Scene();
    const second = new Scene();
    const third = new Scene();
    const PlayScene = mkPlayScene([first, second, third]);
    const wrapper = mount(<PlayScene />);
    simulateKeyEvent("keydown", "ArrowUp");
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state().scene).toBe(third);
  });

  it("keeps rendering the last scene on success", () => {
    const first = new Scene();
    const PlayScene = mkPlayScene([first]);
    const wrapper = mount(<PlayScene />);
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.state().scene).toBe(first);
  });
});
