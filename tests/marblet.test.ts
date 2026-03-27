// Examples and tests for marblet.
// Originally written against RxJS 6; now runs on RxJS 7.
//
// RxJS 6: import { filter, map } from 'rxjs/operators';
// RxJS 7: import { filter, map } from 'rxjs';          (unified; 'rxjs/operators' still works as a compat shim)

import { Observable, filter, map } from "rxjs";
import { marblet, expectUpstream } from "marblet";

const operators = {
  identity: (source$: Observable<unknown>) => source$.pipe(map((n) => n)),
  evenTimesTen: (source$: Observable<unknown>) =>
    source$.pipe(
      filter((n) => (n as number) % 2 === 0),
      map((n) => (n as number) * 10)
    ),
};

describe("Scheduler examples", () => {
  const { identity, evenTimesTen } = operators;

  // assess() takes any function matching (actual, expected) => void,
  // so it works with Vitest, Jest, or any other assertion library.
  const assertDeepEqual = (actual: unknown, expected: unknown) =>
    expect(actual).toEqual(expected);

  test("simple", () => {
    marblet(
      "a-b|",
      "a-b|",
      expectUpstream({
        a: 1,
        b: 2,
      })
        .pipe(identity)
        .toBe({
          a: 1,
          b: 2,
        })
    ).assess(assertDeepEqual);
  });

  test("simple with array up", () => {
    marblet(
      "0-1|",
      "a-b|",
      expectUpstream([1, 2]).pipe(identity).toBe({
        a: 1,
        b: 2,
      })
    ).assess(assertDeepEqual);
  });

  test("simple with array down", () => {
    marblet(
      "a-b|",
      "0-1|",
      expectUpstream({
        a: 1,
        b: 2,
      })
        .pipe(identity)
        .toBe([1, 2])
    ).assess(assertDeepEqual);
  });

  test("simple with all array", () => {
    marblet(
      "0-1|",
      "0-1|",
      expectUpstream([1, 2]).pipe(identity).toBe([1, 2])
    ).assess(assertDeepEqual);
  });

  test("should filter out odd numbers and multiply them by ten", () => {
    marblet(
      "a-b-c-d-e-f-g-h-i-j|",
      "--b---d---f---h---j|",
      expectUpstream({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
        h: 8,
        i: 9,
        j: 10,
      })
        .pipe(evenTimesTen)
        .toBe({ b: 20, d: 40, f: 60, h: 80, j: 100 })
    ).assess(assertDeepEqual);
  });
});
