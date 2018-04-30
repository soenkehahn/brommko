// @flow

import { Scene } from "./scene";
import { failNull } from "./testUtils";
import { findPath } from "./findPath";
import { sceneFitness } from "./scene/fitness";
import { search } from "./search";

it("finds a simple scene", async () => {
  const result = await search(
    {
      mutate: Scene.mutate,
      fitness: scene =>
        sceneFitness(
          {
            pathLength: 2,
            directionChanges: 0,
            switches: 0,
            directors: 0
          },
          scene
        )
    },
    new Scene()
  );
  const solution = failNull(await findPath(result, 6)).path;
  expect(solution.length).toEqual(2);
  expect(solution[0]).toEqual(solution[1]);
});
