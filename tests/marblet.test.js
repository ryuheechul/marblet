const { Observable } = require("rxjs");
const { filter, map } = require("rxjs/operators");
const { marblet, expectUpstream } = require("../index.js");

const operators = {
  identity: (source$) => source$.pipe(map((n) => n)),
  evenTimesTen: (source$) =>
    source$.pipe(
      filter((n) => n % 2 === 0),
      map((n) => n * 10)
    ),
};

describe("Scheduler examples", () => {
  const { identity, evenTimesTen } = operators;

  const withJest = (actual, expected) => expect(actual).toEqual(expected);

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
    ).assess(withJest);
  });

  test("simple with array up", () => {
    marblet(
      "0-1|",
      "a-b|",
      expectUpstream([1, 2]).pipe(identity).toBe({
        a: 1,
        b: 2,
      })
    ).assess(withJest);
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
    ).assess(withJest);
  });

  test("simple with all array", () => {
    marblet(
      "0-1|",
      "0-1|",
      expectUpstream([1, 2]).pipe(identity).toBe([1, 2])
    ).assess(withJest);
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
    ).assess(withJest);
  });
});
