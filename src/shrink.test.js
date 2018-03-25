// @flow

import _ from "lodash";
import { runShrink } from "./shrink";

describe("shrink", () => {
  it("can shrink simple integers", () => {
    const shrink = n => [n - 1];
    const predicate = n => n >= 23;
    const result = runShrink(42, shrink, predicate);
    expect(result).toEqual(23);
  });

  it("throws an exception when the starting value doesn't fulfill the predicate", () => {
    expect(() => {
      runShrink(42, n => [n - 1], n => false);
    }).toThrow("predicate not fulfilled");
  });

  it("works for shrinks with no children", () => {
    expect(runShrink(42, n => [], n => true)).toEqual(42);
  });

  it("works for shrinks with multiple children", () => {
    const shrink: (Array<number>) => Array<Array<number>> = array => {
      const result = [];
      for (let i = 0; i < array.length; i++) {
        const clone = _.cloneDeep(array);
        if (clone[i] > 0) {
          clone[i] = clone[i] - 1;
          result.push(clone);
        }
      }
      return result;
    };
    const predicate: (Array<number>) => boolean = a => a[1] === 42;
    expect(runShrink([23, 42, 51], shrink, predicate)).toEqual([0, 42, 0]);
  });

  it("finds more complex things");
});
