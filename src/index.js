// @flow

import { Scene } from "./scene";
import { arrayOf, partialObject } from "validated/schema";
import { mkPlayScene } from "./components/playScene";
import { validate } from "validated/object";
import React from "react";
import ReactDOM from "react-dom";

function mount(Komponent) {
  const domElement = document.getElementById("root");
  if (!domElement) {
    throw new Error("please load a html page with an elemend with id 'root'");
  }
  ReactDOM.render(<Komponent />, domElement);
}

export function readLevels(): Array<Scene> {
  return validate(arrayOf(partialObject({})), require("../levels.json")).map(
    Scene.fromJSON
  );
}

async function main() {
  const levels = readLevels();
  const PlayScene = mkPlayScene(levels);
  mount(PlayScene);
}

if (!module.parent) {
  main();
}
