// @flow

import React from "react";
import ReactDOM from "react-dom";
import { mkApp } from "./app";
import { Scene } from "./scene";

const scene = new Scene();
scene.walls = [{ x: 1, y: 1 }];
const App = mkApp(scene);

const domElement = document.getElementById("root");
if (!domElement) {
  throw new Error("please load a html page with an elemend with id 'root'");
}
ReactDOM.render(<App />, domElement);
