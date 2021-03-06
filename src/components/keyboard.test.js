// @flow

import { handleKeyboard } from "./keyboard";
import { mount } from "enzyme";
import { simulateKeyEvent } from "../testUtils";
import React, { Component } from "react";

class Test extends Component<{}, { keydowns: Array<string> }> {
  state = { keydowns: [] };

  componentWillMount() {
    handleKeyboard(event => {
      this.state.keydowns.push(event.code);
      this.setState({ keydowns: this.state.keydowns });
    });
  }

  render() {
    return <div>{JSON.stringify(this.state.keydowns)}</div>;
  }
}

describe("handleKeyboard", () => {
  it("passes keydowns to the callback", async () => {
    const wrapper = mount(<Test />);
    simulateKeyEvent("keydown", "ArrowUp");
    expect(wrapper.text()).toBe('["ArrowUp"]');
  });

  it("works for multiple key downs", () => {
    const wrapper = mount(<Test />);
    simulateKeyEvent("keydown", "ArrowUp");
    simulateKeyEvent("keydown", "ArrowDown");
    expect(wrapper.text()).toBe('["ArrowUp","ArrowDown"]');
  });
});
