#!/usr/bin/env babel-node

// @flow

import { mkScene, sceneFitness } from "./search";

async function main() {
  try {
    const args = process.argv.slice(2);
    const scene = await mkScene(parseFloat(args[0]));
    console.log(JSON.stringify(scene, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
main();
