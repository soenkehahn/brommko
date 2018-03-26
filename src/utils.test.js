// @flow

import { empty, toStream, last, deleteIndex } from "./utils";

describe("empty", () => {
  it("returns an empty stream", () => {
    expect(empty().next()).toEqual(null);
  });
});

describe("toStream", () => {
  it("converts an array into a stream", () => {
    const stream = toStream([1, 2, 3]);
    expect(stream.next()).toEqual(1);
    expect(stream.next()).toEqual(2);
    expect(stream.next()).toEqual(3);
    expect(stream.next()).toEqual(null);
  });
});

describe("last", () => {
  it("returns the last element of the stream", async () => {
    expect(await last(toStream([1, 2, 3]))).toEqual(3);
  });

  it("gracefully deals with empty streams", async () => {
    let thrown = false;
    try {
      await last(empty());
    } catch (err) {
      thrown = true;
      expect(err).toMatch("last: empty stream");
    }
    expect(thrown).toBe(true);
  });
});

describe("deleteIndex", () => {
  it("deletes the element with the given index", () => {
    expect(deleteIndex([1, 2, 3], 1)).toEqual([1, 3]);
  });
});
