// @flow

import { Scene } from "../scene";
import { arrayOf, partialObject } from "validated/schema";
import { mkPlayScene } from "./playScene";
import { validate } from "validated/object";

export function readLevels(): Array<Scene> {
  return validate(arrayOf(partialObject({})), require("../../levels.json")).map(
    Scene.fromJSON
  );
}

export const Pregenerated = mkPlayScene(readLevels());
