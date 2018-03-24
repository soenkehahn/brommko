// @flow

import React, { Component } from "react";
import { mount } from "enzyme";
import { handleKeyboard } from "./keyboard";

class Test extends Component<{}, { keydowns: Array<string> }> {
  constructor(props) {
    super(props);
    this.state = { keydowns: [] };
  }

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

function simulateKeyEvent(type: KeyboardEventTypes, code: string) {
  const event = new KeyboardEvent(type, {
    code: code,
    repeat: false
  });
  document.dispatchEvent(event);
}
