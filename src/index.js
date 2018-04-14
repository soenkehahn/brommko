// @flow

import React from "react";
import ReactDOM from "react-dom";
import { mkPlayScene } from "./components/playScene";
import { Scene, sceneSearchOptions, fillInWalls } from "./scene";
import { mkStreamRenderer } from "./components/streamRenderer";
import { searchStream } from "./search";
import { Render } from "./components/render";
import { App } from "./components/App";

function mount(Komponent) {
  const domElement = document.getElementById("root");
  if (!domElement) {
    throw new Error("please load a html page with an elemend with id 'root'");
  }
  ReactDOM.render(<Komponent />, domElement);
}

async function main() {
  mount(App);
}

if (!module.parent) {
  main();
}
