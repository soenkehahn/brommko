// @flow

import { type Action, _pick } from "./random";

describe("pick", () => {
  let result;
  beforeEach(() => {
    result = null;
  });

  describe("when picking between two choices", () => {
    const actions: Array<Action<number>> = [() => 1, () => 2];

    it("can pick the first choice", () => {
      expect(_pick(0.4, actions)).toEqual(1);
    });

    it("can pick the second choice", () => {
      expect(_pick(0.6, actions)).toEqual(2);
    });

    it("allows to weigh one action", () => {
      const actions: Array<Action<number>> = [
        { weight: 2, action: () => 1 },
        () => 2
      ];
      expect(_pick(0.6, actions)).toEqual(1);
      expect(_pick(0.7, actions)).toEqual(2);
    });
  });

  describe("when picking between 3 choices", () => {
    const actions = [() => 1, () => 2, () => 3];

    it("can pick the first choice", () => {
      expect(_pick(0.2, actions)).toEqual(1);
    });

    it("can pick the second choice", () => {
      expect(_pick(0.5, actions)).toEqual(2);
    });

    it("can pick the third choice", () => {
      expect(_pick(0.8, actions)).toEqual(3);
    });

    it("allows to weigh all actions", () => {
      const actions = [
        { weight: 50, action: () => 1 },
        { weight: 30, action: () => 2 },
        { weight: 20, action: () => 3 }
      ];
      expect(_pick(0.49, actions)).toEqual(1);
      expect(_pick(0.51, actions)).toEqual(2);
      expect(_pick(0.79, actions)).toEqual(2);
      expect(_pick(0.81, actions)).toEqual(3);
    });
  });

  it("throws for empty actions arrays", () => {
    expect(() => _pick(0.5, [])).toThrow("pick: empty actions array");
  });
});
