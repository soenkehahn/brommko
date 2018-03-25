// @flow

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
