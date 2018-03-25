// @flow

import { deleteIndex } from "./utils";

describe("deleteIndex", () => {
  it("deletes the element with the given index", () => {
    expect(deleteIndex([1, 2, 3], 1)).toEqual([1, 3]);
  });
});
