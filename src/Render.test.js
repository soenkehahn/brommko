// @flow

import Enzyme, { mount } from "enzyme";
import React from "react";
import { Render } from "./Render.js";
import { Scene } from "./scene.js";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("renderScene", () => {
  it("renders the player", () => {
    const wrapper = mount(<Render scene={new Scene()} />);
    expect(wrapper.find("rect")).toExist();
  });
});
