// @flow

import { mkStreamRenderer } from "./streamRenderer";
import { mount } from "enzyme";
import { toStream } from "../utils";
import React, { type Element } from "react";

function wait(n: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, n * 1000);
  });
}

async function waitUntil(action: () => void, n: number = 100): Promise<void> {
  try {
    action();
  } catch (err) {
    if (n > 0) {
      await wait(0.01);
      await waitUntil(action, n - 1);
    } else {
      throw err;
    }
  }
}

describe("StreamRenderer", () => {
  const Successor = n => () => <div>rendered successor: {n}</div>;

  it("renders all elements of a given stream", async () => {
    const rendered = [];
    function render(props): Element<*> {
      rendered.push(props.element);
      return <div />;
    }
    const StreamRenderer = mkStreamRenderer(
      toStream([1, 2, 3]),
      render,
      Successor
    );
    mount(<StreamRenderer />);
    await waitUntil(() => {
      expect(rendered).toEqual([1, 2, 3]);
    });
  });

  it("renders an element", async () => {
    const render = props => <div>number: {props.element}</div>;
    const constant = a => ({ next: () => a });
    const StreamRenderer = mkStreamRenderer(constant(3), render, Successor);
    const wrapper = mount(<StreamRenderer />);
    await waitUntil(() => {
      expect(wrapper.text()).toEqual("number: 3");
    });
  });

  it("renders the successor after the stream is done", async () => {
    const render = _n => <div />;
    const StreamRenderer = mkStreamRenderer(
      toStream([1, 2, 3]),
      render,
      Successor
    );
    const wrapper = mount(<StreamRenderer />);
    await waitUntil(() => {
      expect(wrapper.text()).toEqual("rendered successor: 3");
    });
  });
});
