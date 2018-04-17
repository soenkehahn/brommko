// @flow

import { pick } from "./random";
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

export function mapStream<A, B>(f: A => B, stream: Stream<A>): Stream<B> {
  return {
    next: () => {
      const input = stream.next();
      if (input !== null && input !== undefined) {
        return f(input);
      } else {
        return null;
      }
    }
  };
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
    return pick(
      {
        weight: 5,
        action: () => {
          return addNew();
        }
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

export function removeDuplicates<A>(array: Array<A>): Array<A> {
  const nubSet: Set<string> = new Set();
  const result = [];
  for (const element of array) {
    if (!nubSet.has(JSON.stringify(element))) {
      result.push(element);
      nubSet.add(JSON.stringify(element));
    }
  }
  return result;
}

export function wait(n: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, n * 1000);
  });
}
