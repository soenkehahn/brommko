// @flow

import React, { Component } from "react";
import { Render } from "./Render";
import { Scene } from "./scene";
import { handleKeyboard } from "./keyboard";

export function mkApp(scene: Scene) {
  return class App extends Component<{}, { scene: Scene }> {
    constructor(props: *) {
      super(props);
      this.state = { scene: scene };
    }

    componentWillMount() {
      handleKeyboard(event => {
        this.state.scene.step(event.code);
        this.setState({ scene: this.state.scene });
      });
    }

    render() {
      return <Render scene={this.state.scene} />;
    }
  };
}
