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

async function main() {
  const stream = searchStream(
    sceneSearchOptions({ pathLength: 6, directionChanges: 3 })
  );
  const StreamRenderer = mkStreamRenderer(
    stream,
    props => (
      <div>
        <Render scene={props.element.element} />
        fitness: {props.element.fitness}
      </div>
    ),
    best => {
      const PlayScene = mkPlayScene(fillInWalls(best.element));
      return () => <PlayScene />;
    }
  );
  mount(StreamRenderer);
}

main();
