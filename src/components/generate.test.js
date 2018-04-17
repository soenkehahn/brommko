// @flow

import { renderComponents } from "./generate";

describe("renderComponents", () => {
  it("renders the key and value of objects", () => {
    expect(renderComponents({ foo: 13 })).toEqual("foo: 13");
  });

  it("renders multiple keys and values", () => {
    expect(renderComponents({ foo: 13, bar: 42 })).toEqual(
      "foo: 13 --- bar: 42"
    );
  });
});
