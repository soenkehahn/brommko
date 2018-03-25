// @flow

import _ from "lodash";
import { runShrink } from "./shrink";
import { type Stream, toStream, empty } from "./utils";

describe("shrink", () => {
  it("can shrink simple integers", async () => {
    const shrink = n => toStream([n - 1]);
    const predicate = n => n >= 23;
    const result = await runShrink(42, shrink, predicate);
    expect(result).toEqual(23);
  });

  describe("when the starting value doesn't fulfill the predicate", () => {
    it("throws an exception", async () => {
      let caught = false;
      try {
        await runShrink(42, n => toStream([n - 1]), n => false);
      } catch (err) {
        caught = true;
        expect(err).toMatch("predicate not fulfilled");
      }
      expect(caught).toBe(true);
    });
  });

  it("works for shrinks with no children", async () => {
    expect(await runShrink(42, n => empty(), n => true)).toEqual(42);
  });

  it("works for shrinks with multiple children", async () => {
    const shrink: (Array<number>) => Stream<Array<number>> = array => {
      const result = [];
      for (let i = 0; i < array.length; i++) {
        const clone = _.cloneDeep(array);
        if (clone[i] > 0) {
          clone[i] = clone[i] - 1;
          result.push(clone);
        }
      }
      return toStream(result);
    };
    const predicate: (Array<number>) => boolean = a => a[1] === 42;
    expect(await runShrink([23, 42, 51], shrink, predicate)).toEqual([
      0,
      42,
      0
    ]);
  });

  it("finds more complex things");
});
