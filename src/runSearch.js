#!/usr/bin/env babel-node

// @flow

import { Scene, mkScene } from "./scene";
import { type SceneProperties } from "./fitness";
import { readLevels } from "./index";
import { spawnSync } from "child_process";
import { writeFileSync } from "fs";

function writeLevels(scenes: Array<Scene>): void {
  writeFileSync("levels.json", JSON.stringify(scenes, null, 2));
}

async function search(targetProperties: SceneProperties): Promise<void> {
  console.error(`generating scene for ${JSON.stringify(targetProperties)}...`);
  const scene = await mkScene(targetProperties);
  const levels = readLevels();
  levels.push(scene);
  writeLevels(levels);
  console.error(`written scene for ${JSON.stringify(targetProperties)}`);
}

function mkProps(): Array<SceneProperties> {
  const props = [];
  for (let directors = 0; directors <= 4; directors++) {
    for (let switches = 0; switches <= 4; switches++) {
      for (
        let directionChanges = 0;
        directionChanges <= 5;
        directionChanges++
      ) {
        for (let pathLength = 2; pathLength <= 7; pathLength++) {
          const p = {
            pathLength,
            directionChanges,
            switches,
            directors
          };
          props.push(p);
        }
      }
    }
  }
  return props;
}

async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      for (const p of mkProps()) {
        const properties = JSON.stringify(p);
        spawnSync("timeout", ["32", "./src/runSearch.js", properties], {
          stdio: "inherit"
        });
      }
    } else {
      const targetProperties: SceneProperties = JSON.parse(args[0]);
      if (
        targetProperties.pathLength >= targetProperties.directionChanges &&
        targetProperties.pathLength >= targetProperties.switches &&
        targetProperties.pathLength >= targetProperties.directors
      ) {
        await search(targetProperties);
      } else {
        console.error(
          `invalid scene properties: ${JSON.stringify(targetProperties)}`
        );
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
main();
