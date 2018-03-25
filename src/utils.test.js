// @flow

import { empty, toStream, deleteIndex } from "./utils";

describe("toStream", () => {
  it("converts an array into a stream", () => {
    const stream = toStream([1, 2, 3]);
    expect(stream.next()).toEqual(1);
    expect(stream.next()).toEqual(2);
    expect(stream.next()).toEqual(3);
    expect(stream.next()).toEqual(null);
  });
});

describe("empty", () => {
  it("returns an empty stream", () => {
    expect(empty().next()).toEqual(null);
  });
});

describe("deleteIndex", () => {
  it("deletes the element with the given index", () => {
    expect(deleteIndex([1, 2, 3], 1)).toEqual([1, 3]);
  });
});
