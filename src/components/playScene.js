// @flow

import { Render } from "./render";
import { Scene } from "../scene";
import { handleKeyboard } from "./keyboard";
import React, { Component, type ComponentType } from "react";

export function mkPlayScene(scenes: Array<Scene>): ComponentType<{}> {
  const scene = scenes.shift();

  return class PlayScene extends Component<
    {},
    { scene: Scene, rest: Array<Scene> }
  > {
    state = { scene: scene, rest: scenes };

    componentWillMount() {
      handleKeyboard(event => {
        this.state.scene.step(event.code);
        if (this.state.scene.success && this.state.rest.length > 0) {
          this.state.scene = this.state.rest.shift();
        }
        this.setState({ scene: this.state.scene });
      });
    }

    render() {
      return <Render scene={this.state.scene} />;
    }
  };
}
