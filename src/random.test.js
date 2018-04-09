// @flow

import { _pickRandomly } from "./random";

describe("pickRandomly", () => {
  let result;
  beforeEach(() => {
    result = null;
  });

  describe("when picking between two choices", () => {
    const actions = [() => 1, () => 2];

    it("can pick the first choice", () => {
      expect(_pickRandomly(0.4, actions)).toEqual(1);
    });

    it("can pick the first choice", () => {
      expect(_pickRandomly(0.6, actions)).toEqual(2);
    });
  });

  describe("when picking between 3 choices", () => {
    const actions = [() => 1, () => 2, () => 3];

    it("can pick the first choice", () => {
      expect(_pickRandomly(0.2, actions)).toEqual(1);
    });

    it("can pick the second choice", () => {
      expect(_pickRandomly(0.5, actions)).toEqual(2);
    });

    it("can pick the third choice", () => {
      expect(_pickRandomly(0.8, actions)).toEqual(3);
    });
  });

  it("throws for empty actions arrays", () => {
    expect(() => _pickRandomly(0.5, [])).toThrow(
      "pickRandomly: empty actions array"
    );
  });
});
