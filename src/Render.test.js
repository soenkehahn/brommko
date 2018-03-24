// @flow

import { mount } from "enzyme";
import React from "react";
import { Render } from "./Render.js";
import { Scene } from "./scene.js";

describe("renderScene", () => {
  it("renders the player", () => {
    const wrapper = mount(<Render scene={new Scene()} />);
    expect(wrapper.find("rect")).toExist();
  });
});
