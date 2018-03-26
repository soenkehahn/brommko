// @flow

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
  if (random < 1 / (array.length + 1)) {
    return array.concat([mkNew()]);
  } else {
    const index = randomInt(0, array.length - 1);
    if (Math.random() < 0.3) {
      return deleteIndex(array, index);
    } else {
      array[index] = mutate(array[index]);
      return array;
    }
  }
}
