// @flow

import { type Stream } from "../utils";
import React, { Component, type ComponentType, type Element } from "react";

export function mkStreamRenderer<A>(
  stream: Stream<A>,
  Render: ComponentType<{ element: A }>,
  mkSuccessor: A => ComponentType<{}>
): ComponentType<{}> {
  return class StreamRenderer extends Component<
    {},
    { element: ?A, successor: ?ComponentType<{}> }
  > {
    state = { element: null, successor: null };

    loop() {
      setTimeout(() => {
        const next = stream.next();
        if (next != null) {
          this.setState({ element: next });
          this.loop();
        } else {
          if (this.state.element != null) {
            this.setState({ successor: mkSuccessor(this.state.element) });
          }
        }
      });
    }

    componentWillMount() {
      this.loop();
    }

    render() {
      if (this.state.element == null) {
        return <div>empty</div>;
      } else {
        if (this.state.successor == null) {
          return <Render element={this.state.element} />;
        } else {
          const Successor = this.state.successor;
          return <Successor element={this.state.element} />;
        }
      }
    }
  };
}
