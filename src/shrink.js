// @flow

import { type Stream } from "./utils";

export async function runShrink<A>(
  start: A,
  shrink: A => Stream<A>,
  predicate: A => boolean
): Promise<A> {
  if (!predicate(start)) {
    throw `runShrink: predicate not fulfilled: ${JSON.stringify(start)}`;
  }
  return await runShrink_(start, shrink, predicate);
}

async function runShrink_<A>(
  start: A,
  shrink: A => Stream<A>,
  predicate: A => boolean
): Promise<A> {
  const children = shrink(start);
  let child;
  while ((child = children.next())) {
    await null;
    if (predicate(child)) {
      return runShrink_(child, shrink, predicate);
    }
  }
  return start;
}
