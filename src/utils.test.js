// @flow

import {
  deleteIndex,
  empty,
  last,
  mapStream,
  mutateArray,
  randomInt,
  removeDuplicates,
  toStream
} from "./utils";

describe("Stream functions", () => {
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

  describe("map", () => {
    it("iterates over a given stream", () => {
      const stream = mapStream(e => e * 2, toStream([1, 2, 3]));
      expect(stream.next()).toEqual(2);
      expect(stream.next()).toEqual(4);
      expect(stream.next()).toEqual(6);
      expect(stream.next()).toEqual(null);
    });
  });
});

describe("deleteIndex", () => {
  it("deletes the element with the given index", () => {
    expect(deleteIndex([1, 2, 3], 1)).toEqual([1, 3]);
  });
});

describe("mutateArray", () => {
  function mutateInt(n: number): number {
    return randomInt(0, 10);
  }

  it("doesn't mutate the existing array", () => {
    let array = [];
    for (let i = 0; i < 100; i++) {
      const old = JSON.stringify(array);
      const nextArray = mutateArray(() => randomInt(0, 10), mutateInt, array);
      expect(old).toEqual(JSON.stringify(array));
      array = nextArray;
    }
  });
});

describe("removeDuplicates", () => {
  it("removes duplicate objects", () => {
    expect(removeDuplicates([{ x: 23, y: 42 }, { x: 23, y: 42 }])).toEqual([
      { x: 23, y: 42 }
    ]);
  });

  it("removes triplicate objects", () => {
    expect(
      removeDuplicates([{ x: 23, y: 42 }, { x: 23, y: 42 }, { x: 23, y: 42 }])
    ).toEqual([{ x: 23, y: 42 }]);
  });

  it("removes duplicates around interspersed unique elements", () => {
    expect(
      removeDuplicates([{ x: 23, y: 42 }, { x: 1, y: 2 }, { x: 23, y: 42 }])
    ).toEqual([{ x: 23, y: 42 }, { x: 1, y: 2 }]);
  });
});
