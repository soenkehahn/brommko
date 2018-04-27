// @flow

import { Render } from "./render";
import { type SceneProperties } from "../fitness";
import { fillInWalls, sceneSearchOptions } from "../scene";
import { mkPlayScene } from "./playScene";
import { mkStreamRenderer } from "./streamRenderer";
import { searchStream } from "../search";
import React, { Component, type ComponentType } from "react";

export function renderComponents(obj: ?{}): string {
  let result = [];
  for (const key in obj) {
    result.push(`${key}: ${obj[key]}`);
  }
  return result.join(" --- ");
}

export async function mkGenerate(properties: SceneProperties) {
  const stream = await searchStream(sceneSearchOptions(properties));
  const inner = mkStreamRenderer(
    stream,
    props => (
      <div>
        <Render scene={props.element.element} />
        <div>
          {renderComponents(props.element.fitness.sceneProperties)} ---
          (current)
        </div>
        <div>{renderComponents(properties)} --- (target)</div>
      </div>
    ),
    async best => {
      const PlayScene = mkPlayScene([await fillInWalls(best.element)]);
      return () => <PlayScene />;
    }
  );
  return class Generate extends Component<{}> {
    inner: ComponentType<*> = inner;
    sceneProperties: SceneProperties = properties;

    render() {
      const Inner = this.inner;
      return <Inner />;
    }
  };
}
