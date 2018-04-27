// @flow

import { mkStreamRenderer } from "./streamRenderer";
import { mount } from "enzyme";
import { toStream } from "../utils";
import { waitUntil } from "../testUtils";
import React, { type Element } from "react";

describe("StreamRenderer", () => {
  const mkSuccessor = async n => () => <div>rendered successor: {n}</div>;

  it("renders all elements of a given stream", async () => {
    const rendered = [];
    function render(props): Element<*> {
      rendered.push(props.element);
      return <div />;
    }
    const StreamRenderer = mkStreamRenderer(
      toStream([1, 2, 3]),
      render,
      mkSuccessor
    );
    mount(<StreamRenderer />);
    await waitUntil(() => {
      expect(rendered).toEqual([1, 2, 3]);
    });
  });

  it("renders an element", async () => {
    const render = props => <div>number: {props.element}</div>;
    const constant = a => ({ next: async () => a });
    const StreamRenderer = mkStreamRenderer(constant(3), render, mkSuccessor);
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
      mkSuccessor
    );
    const wrapper = mount(<StreamRenderer />);
    await waitUntil(() => {
      expect(wrapper.text()).toEqual("rendered successor: 3");
    });
  });
});
