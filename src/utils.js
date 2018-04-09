// @flow

import _ from "lodash";

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
  const random = Math.random();
  if (array.length === 0 || random < 0.7) {
    return array.concat([mkNew()]);
  } else {
    const index = randomInt(0, array.length - 1);
    if (Math.random() < 0.3) {
      return deleteIndex(array, index);
    } else {
      const result = _.cloneDeep(array);
      result[index] = mutate(result[index]);
      return result;
    }
  }
}
