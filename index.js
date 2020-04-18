const { TestScheduler } = require("rxjs/testing");
const { Observable } = require("rxjs");
const { filter, map, scan } = require("rxjs/operators");

const simpleRunner = (
  { cold, expectObservable },
  {
    marbles: { before: marbleBefore, after: marbleAfter },
    operator,
    stream: { up, down },
  }
) => {
  const source$ = cold(marbleBefore, up);
  const result$ = operator(source$);

  expectObservable(result$).toBe(marbleAfter, down);
};

const marblet = (marbleBefore, marbleAfter, { up, down, operator }) => {
  const toAssess = {
    marbles: { before: marbleBefore, after: marbleAfter },
    operator,
    stream: { up, down },
  };

  const assess = (schedulerInit, runner = simpleRunner) =>
    new TestScheduler(schedulerInit).run((helpers) =>
      runner(helpers, toAssess)
    );

  return {
    assess,
  };
};

const expectUpstream = (up) => ({
  pipe: (operator) => ({
    toBe: (down) => ({ up, down, operator }),
  }),
});

module.exports = { marblet, expectUpstream };
