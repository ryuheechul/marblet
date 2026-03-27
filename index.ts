import { TestScheduler } from "rxjs/testing";

type RunHelpers = Parameters<Parameters<TestScheduler["run"]>[0]>[0];
import { Observable } from "rxjs";

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
