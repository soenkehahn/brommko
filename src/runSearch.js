#!/usr/bin/env babel-node

// @flow

import { mkScene } from "./search";

async function main() {
  console.log(await mkScene());
}
main();
