// @flow

export function runShrink<A>(
  start: A,
  shrink: A => Array<A>,
  predicate: A => boolean
): A {
  if (!predicate(start)) {
    throw `runShrink: predicate not fulfilled: ${JSON.stringify(start)}`;
  }
  return runShrink_(start, shrink, predicate);
}

function runShrink_<A>(
  start: A,
  shrink: A => Array<A>,
  predicate: A => boolean
): A {
  console.log(start);
  const children = shrink(start);
  for (const child of children) {
    if (predicate(child)) {
      return runShrink_(child, shrink, predicate);
    }
  }
  return start;
}
