// marblet — a thin wrapper around RxJS TestScheduler for marble testing.
// Originally written to simplify testing with RxJS 6; now supports RxJS 6 and 7.
// The core TestScheduler API (run, cold, expectObservable) is unchanged between versions.

import { TestScheduler } from "rxjs/testing";
import { Observable } from "rxjs";

// Derive RunHelpers from TestScheduler rather than importing it directly,
// since it is not exported from rxjs/testing in RxJS 6.
type RunHelpers = Parameters<Parameters<TestScheduler["run"]>[0]>[0];

type MarbleValues = Record<string, unknown> | unknown[];

interface MarbletConfig {
  up: MarbleValues;
  down: MarbleValues;
  operator: (source$: Observable<unknown>) => Observable<unknown>;
}

interface ToAssess {
  marbles: { before: string; after: string };
  operator: MarbletConfig["operator"];
  stream: { up: MarbleValues; down: MarbleValues };
}

const simpleRunner = (
  { cold, expectObservable }: RunHelpers,
  {
    marbles: { before: marbleBefore, after: marbleAfter },
    operator,
    stream: { up, down },
  }: ToAssess
) => {
  const source$ = cold(marbleBefore, up as Record<string, unknown>);
  const result$ = operator(source$);

  expectObservable(result$).toBe(marbleAfter, down as Record<string, unknown>);
};

const marblet = (
  marbleBefore: string,
  marbleAfter: string,
  { up, down, operator }: MarbletConfig
) => {
  const toAssess: ToAssess = {
    marbles: { before: marbleBefore, after: marbleAfter },
    operator,
    stream: { up, down },
  };

  const assess = (
    schedulerInit: (actual: unknown, expected: unknown) => boolean | void,
    runner = simpleRunner
  ) =>
    new TestScheduler(schedulerInit).run((helpers) =>
      runner(helpers, toAssess)
    );

  return {
    assess,
  };
};

const expectUpstream = (up: MarbleValues) => ({
  pipe: (operator: MarbletConfig["operator"]) => ({
    toBe: (down: MarbleValues): MarbletConfig => ({ up, down, operator }),
  }),
});

export { marblet, expectUpstream };
