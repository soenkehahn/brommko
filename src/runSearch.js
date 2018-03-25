#!/usr/bin/env babel-node

// @flow

import { mkScene, sceneFitness } from "./search";
import { shrinkScene } from "./scene";
import { runShrink } from "./shrink";

async function main() {
  const scene = await mkScene(4.4);
  console.log(JSON.stringify(scene, null, 2));
}
main();
