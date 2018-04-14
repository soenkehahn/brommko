// @flow

import { Render } from "./render";
import { Scene } from "../scene";
import { handleKeyboard } from "./keyboard";
import React, { Component, type ComponentType } from "react";

export function mkPlayScene(scene: Scene): ComponentType<{}> {
  return class PlayScene extends Component<{}, { scene: Scene }> {
    state = { scene };

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
