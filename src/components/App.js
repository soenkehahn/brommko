// @flow

import { Render } from "./render";
import { fillInWalls, sceneSearchOptions } from "../scene";
import { mkPlayScene } from "./playScene";
import { mkStreamRenderer } from "./streamRenderer";
import { searchStream } from "../search";
import React from "react";

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
    const PlayScene = mkPlayScene([fillInWalls(best.element)]);
    return () => <PlayScene />;
  }
);
