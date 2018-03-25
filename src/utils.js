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
