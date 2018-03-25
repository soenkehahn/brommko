// @flow

export async function runShrink<A>(
  start: A,
  shrink: A => Array<A>,
  predicate: A => boolean
): Promise<A> {
  if (!predicate(start)) {
    throw `runShrink: predicate not fulfilled: ${JSON.stringify(start)}`;
  }
  return await runShrink_(start, shrink, predicate);
}

async function runShrink_<A>(
  start: A,
  shrink: A => Array<A>,
  predicate: A => boolean
): Promise<A> {
  console.log(start);
  const children = shrink(start);
  for (const child of children) {
    await null;
    if (predicate(child)) {
      return runShrink_(child, shrink, predicate);
    }
  }
  return start;
}
