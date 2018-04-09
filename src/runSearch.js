#!/usr/bin/env babel-node

// @flow

import { mkScene } from "./scene";
import {
  type SceneProperties,
  scenePropertiesSchema,
  sceneFitness
} from "./fitness";
import { validate } from "validated/json5";

async function main() {
  try {
    const args = process.argv.slice(2);
    const targetProperties: SceneProperties = validate(
      scenePropertiesSchema,
      args[0]
    );
    const scene = await mkScene(targetProperties);
    console.log(JSON.stringify(scene, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
main();
