// @flow

import _ from "lodash";
import { pickRandomly } from "./random";

export type Stream<A> = {
  next: () => ?A
};

export function empty<A>(): Stream<A> {
  return { next: () => null };
}

export function toStream<A>(array: Array<A>): Stream<A> {
  let index = 0;
  return {
    next: () => {
      if (index >= array.length) {
        return null;
      } else {
        return array[index++];
      }
    }
  };
}

export async function last<A>(stream: Stream<A>): Promise<A> {
  let element = stream.next();
  if (element == null) {
    throw "last: empty stream";
  }
  let next = stream.next();
  while (next != null) {
    await null;
    element = next;
    next = stream.next();
  }
  return element;
}

export function randomInt(lower: number, upper: number): number {
  return Math.floor(Math.random() * Math.floor(1 + upper - lower)) + lower;
}

export function deleteIndex<A>(array: Array<A>, index: number): Array<A> {
  const result = [];
  let i = 0;
  for (const element of array) {
    if (i !== index) {
      result.push(element);
    }
    i++;
  }
  return result;
}

export function mutateArray<A>(
  mkNew: () => A,
  mutate: A => A,
  array: Array<A>
): Array<A> {
  const addNew = () => array.concat([mkNew()]);

  if (array.length === 0) {
    return addNew();
  } else {
    return pickRandomly(
      () => {
        return addNew();
      },
      () => {
        return addNew();
      },
      () => {
        return addNew();
      },
      () => {
        return addNew();
      },
      () => {
        const index = randomInt(0, array.length - 1);
        return deleteIndex(array, index);
      },
      () => {
        const index = randomInt(0, array.length - 1);
        const result = _.cloneDeep(array);
        result[index] = mutate(result[index]);
        return result;
      }
    );
  }
}
