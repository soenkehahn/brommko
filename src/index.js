// @flow

import React from "react";
import ReactDOM from "react-dom";
import { mkPlayScene } from "./playScene";
import { Scene, sceneSearchOptions, fillInWalls } from "./scene";
import { mkStreamRenderer } from "./streamRenderer";
import { searchStream } from "./search";
import { Render } from "./render";

function mount(Komponent) {
  const domElement = document.getElementById("root");
  if (!domElement) {
    throw new Error("please load a html page with an elemend with id 'root'");
  }
  ReactDOM.render(<Komponent />, domElement);
}

export function renderComponents(obj: ?{}): string {
  let result = [];
  for (const key in obj) {
    result.push(`${key}: ${obj[key]}`);
  }
  return result.join(" --- ");
}

async function main() {
  const targetProperties = {
    pathLength: 3,
    directionChanges: 0,
    switches: 0,
    directors: 2
  };
  const stream = searchStream(sceneSearchOptions(targetProperties));
  const StreamRenderer = mkStreamRenderer(
    stream,
    props => (
      <div>
        <Render scene={props.element.element} />
        <div>
          {renderComponents(props.element.fitness.sceneProperties)} ---
          (current)
        </div>
        <div>{renderComponents(targetProperties)} --- (target)</div>
      </div>
    ),
    best => {
      const PlayScene = mkPlayScene(fillInWalls(best.element));
      return () => <PlayScene />;
    }
  );
  mount(StreamRenderer);
}

if (!module.parent) {
  main();
}
