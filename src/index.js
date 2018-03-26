// @flow

import React from "react";
import ReactDOM from "react-dom";
import { mkApp } from "./app";
import { Scene, mkScene } from "./scene";

async function main() {
  const scene = await mkScene(4.2);
  const App = mkApp(scene);

  const domElement = document.getElementById("root");
  if (!domElement) {
    throw new Error("please load a html page with an elemend with id 'root'");
  }
  ReactDOM.render(<App />, domElement);
}

main();
