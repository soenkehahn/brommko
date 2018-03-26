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
  const stream = searchStream(sceneSearchOptions(6.3));
  const StreamRenderer = mkStreamRenderer(
    stream,
    props => <Render scene={props.element} />,
    scene => {
      const PlayScene = mkPlayScene(fillInWalls(scene));
      return () => <PlayScene />;
    }
  );
  mount(StreamRenderer);
}

main();
