// @flow

import React from "react";
import { searchStream } from "../search";
import { Scene, sceneSearchOptions, fillInWalls } from "../scene";
import { mkStreamRenderer } from "./streamRenderer";
import { Render } from "./render";
import { mkPlayScene } from "./playScene";

export function renderComponents(obj: ?{}): string {
  let result = [];
  for (const key in obj) {
    result.push(`${key}: ${obj[key]}`);
  }
  return result.join(" --- ");
}

const targetProperties = {
  pathLength: 3,
  directionChanges: 0,
  switches: 0,
  directors: 2
};

const stream = searchStream(sceneSearchOptions(targetProperties));

export const App = mkStreamRenderer(
  stream,
  props => (
    <div>
      <Render scene={props.element.element} />
      <div>
        {renderComponents(props.element.fitness.sceneProperties)} --- (current)
      </div>
      <div>{renderComponents(targetProperties)} --- (target)</div>
    </div>
  ),
  best => {
    const PlayScene = mkPlayScene(fillInWalls(best.element));
    return () => <PlayScene />;
  }
);
